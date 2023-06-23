class PaintingManager {

    public isCompletePaintingMode = false;
    private completePaintingMode: {
        backgroundCards: Card[],
        artCards: Card[],
        painting: {
            backgroundCard: Card,
            artCards: Card[]
        }
    } = {
        backgroundCards: [],
        artCards: [],
        painting: {
            backgroundCard: undefined,
            artCards: [undefined, undefined, undefined]
        },
    }
    constructor(protected canvasGame: Canvas) {

    }

    public setUp(gameData: CanvasGameData) {

        for (const playersKey in gameData.players) {
            const player = gameData.players[playersKey];
            player.paintings.forEach(painting => this.createPainting(painting, false))
        }

    }

    public createPainting(painting: Painting, showAnimation: boolean) {
        const targetElementId = `player-finished-paintings-${painting.playerId}`;
        const paintingElementId = `player-finished-painting-${painting.id}`;
        const cardsWrapperId = `${paintingElementId}-cards-wrapper`;
        dojo.place(`<div id="${paintingElementId}" class="canvas-painting">
                            <div id="${cardsWrapperId}" class="canvas-painting-cards-wrapper"></div>
                         </div>`, showAnimation ? 'canvas-table' : targetElementId);

        this.canvasGame.backgroundCardManager.createPaintingStock(painting.id, cardsWrapperId, painting.backgroundCard);
        this.canvasGame.artCardManager.createPaintingStock(painting.id, cardsWrapperId, painting.artCards);

        const element = $(paintingElementId);
        if (showAnimation) {
            return this.canvasGame.animationManager.play(new BgaCumulatedAnimation({animations: [
                    new BgaAttachWithAnimation({
                        animation: new BgaSlideAnimation({ element, transitionTimingFunction: 'ease-out' }),
                        attachElement: document.getElementById('canvas-show-painting-overlay')
                    }),
                    new BgaPauseAnimation({ element}),
                ]}))
        } else {
            this.addPaintingToPngButton(painting, paintingElementId)
            return Promise.resolve();
        }
    }

    public addPaintingToPngButton(painting: Painting, paintingElementId: string) {
        dojo.place(`<a id="save-painting-${painting.id}" class="bgabutton bgabutton_blue"><i class="fa fa-heart" aria-hidden="true"></i></a>`, paintingElementId)
        dojo.connect($(`save-painting-${painting.id}`), 'onclick', () => this.paintingToPng(painting));
    }

    public enterCompletePaintingMode(backgroundCards: Card[], artCards: Card[]) {
        this.isCompletePaintingMode = true;
        this.completePaintingMode.backgroundCards = backgroundCards;
        this.completePaintingMode.artCards = artCards;
        this.completePaintingMode.painting.backgroundCard = this.completePaintingMode.painting.backgroundCard ? this.completePaintingMode.painting.backgroundCard : backgroundCards[0];

        dojo.place(this.createCompletePaintingPickerElement(), 'complete-painting')
        dojo.place(this.createCompletePaintingPreviewElement(), 'complete-painting')

        dojo.place(this.createBackgroundSlot(), 'art-cards-picker-top-text', 'before');
        dojo.place(this.createBackgroundElement(this.completePaintingMode.painting.backgroundCard),'complete-painting-background-card-slot')
        dojo.connect($('change-background-button'), 'onclick', () => this.changeBackgroundCard());

        for (let i = 0; i < 3; i++) {
            dojo.place(this.createArtCardSlot(i), 'art-cards-picker-top-text', 'before')
            if (this.completePaintingMode.painting.artCards[i]) {
                this.addCardToPaintingAtPosition(this.completePaintingMode.painting.artCards[i], i)
            }
        }

        this.updateUnusedCards();
        this.updatePreview();
    }

    private changeBackgroundCard() {
        let newBackgroundCardIndex = this.completePaintingMode.backgroundCards.indexOf(this.completePaintingMode.painting.backgroundCard) + 1;
        if (newBackgroundCardIndex >= this.completePaintingMode.backgroundCards.length) {
            newBackgroundCardIndex = 0;
        }
        const newBackgroundCard = this.completePaintingMode.backgroundCards[newBackgroundCardIndex];
        if (newBackgroundCard) {
            dojo.place(this.createBackgroundElement(newBackgroundCard), 'complete-painting-background-card-slot', 'only')
            this.completePaintingMode.painting.backgroundCard = newBackgroundCard;
        }
        this.updatePreview();
    }

    public exitCompletePaintingMode() {
        this.isCompletePaintingMode = false;
        dojo.empty('complete-painting');
    }

    public enterHighlightPaintingMode(player: CanvasPlayer) {
        const overlayId = $('canvas-show-painting-overlay');
        dojo.empty(overlayId);
        dojo.addClass(overlayId, 'overlay-visible');

        dojo.place(`<div class="title-wrapper"><div class="title color-${player.color}"><h1>${player.name}${_("'s Completed Painting")}</h1></div></div>`, overlayId)
    }

    public exitHighlightPaintingMode() {
        const overlayId = $('canvas-show-painting-overlay');
        dojo.removeClass(overlayId, 'overlay-visible')
    }

    private createCompletePaintingPickerElement() {
        return `
            <div id="complete-painting-picker-wrapper">
                <div class="title-wrapper"><div class="title"><h1>${_("Art Picker")}</h1></div></div>
                <div id="art-cards-picker">
                    <div id="art-cards-picker-bottom-text"><h1>${_("Back")}</h1></div>
                    <div id="art-cards-picker-top-text"><h1>${_("Front")}</h1></div>
                </div> 
                <div class="title-wrapper"><div class="title"><h1>${_("Unused Cards")}</h1></div></div>
                <div id="art-cards-picker-unused">
                    
                </div> 
            </div>
        `
    }

    private createCompletePaintingPreviewElement() {
        return `
            <div id="complete-painting-preview">
                <div class="title-wrapper"><div class="title secondary"><h1>${_("Painting Preview")}</h1></div></div>
                <div id="complete-painting-preview-scoring"></div>
                <div id="complete-painting-preview-slot-wrapper">
                    <div id="complete-painting-preview-slot" class="canvas-painting"></div>   
                </div>  
            </div>
        `
    }

    private createArtCardSlot(id: number) {
        return `
            <div>
                <div id="complete-painting-art-card-slot-${id}" class="complete-painting-art-card-slot"><span>${id + 1}</span></div>
            </div>
        `
    }

    private createBackgroundSlot() {
        return `
            <div>
                <div class="center-button-wrapper button-wrapper"><a id="change-background-button" class="bgabutton bgabutton_blue"><i class="fa fa-refresh" aria-hidden="true"></i></a></div>
                <div id="complete-painting-background-card-slot" class="complete-painting-art-card-slot"></div>
            </div>
        `
    }

    private createBackgroundElement(card: Card, postfix: string = 'clone') {
        console.log(card);
        const clone = this.canvasGame.backgroundCardManager.getCardElement(card).cloneNode(true) as any;
        clone.id = `${clone.id}-${postfix}`;
        clone.style = '';
        return clone;
    }

    private createArtCardElement(card: Card, postfix: string = 'clone') {
        const clone = this.canvasGame.artCardManager.getCardElement(card).cloneNode(true) as any;
        clone.id = `${clone.id}-${postfix}`;
        return clone;
    }

    private updateUnusedCards() {
        dojo.empty($(`art-cards-picker-unused`))
        this.completePaintingMode.artCards
            .filter(card => !this.completePaintingMode.painting.artCards.includes(card))
            .forEach(card => {
                const cardElement = this.createArtCardElement(card);
                dojo.place(cardElement,`art-cards-picker-unused`)
                dojo.connect($(cardElement.id), 'onclick', () => this.addCardToPainting(card));
            })
    }

    private addCardToPaintingAtPosition(card, index) {
        this.completePaintingMode.painting.artCards[index] = card;
        const cardElement = this.createArtCardElement(card);
        dojo.place(cardElement, `complete-painting-art-card-slot-${index}`, 'only')
        dojo.connect($(cardElement.id), 'onclick', () => this.removeCardFromPainting(card));

        this.updateUnusedCards();
        this.updatePreview();
    }

    private addCardToPainting(card) {
        let index = 0;
        for (let i = 0; i < this.completePaintingMode.painting.artCards.length; i++) {
            if (!this.completePaintingMode.painting.artCards[i]) {
                index = i;
                break;
            }
        }
        this.addCardToPaintingAtPosition(card, index);
    }

    private removeCardFromPainting(card) {
        const index = this.completePaintingMode.painting.artCards.indexOf(card);
        this.completePaintingMode.painting.artCards[index] = undefined;
        dojo.place(`<span>${index + 1}</span>`, `complete-painting-art-card-slot-${index}`, 'only')

        this.updateUnusedCards();
        this.updatePreview();
    }

    private updatePreview() {
        this.createPaintingElement(this.completePaintingMode.painting.backgroundCard, this.completePaintingMode.painting.artCards, 'complete-painting-preview-slot', 'large')

        const artCardIds = this.completePaintingMode.painting.artCards.filter(card => !!card).map(card => card.id);
        this.canvasGame.takeNoLockAction('scorePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds
            })
        })
    }

    public updatePreviewScore(args: NotifPaintingScored) {
        dojo.empty($('complete-painting-preview-scoring'));
        Object.entries(args).forEach(([key, value]) => {
            dojo.place(`<span class="complete-painting-preview-scoring-ribbon"><span>${value}</span><span class="canvas-ribbon" data-type="${key}"></span></span>`, 'complete-painting-preview-scoring');
        })
    }

    public confirmPainting() {
        const artCardIds = this.completePaintingMode.painting.artCards.filter(card => !!card).map(card => card.id);

        if (artCardIds.length === 3) {
            dojo.destroy('complete-painting-picker-wrapper');
            this.canvasGame.takeAction('completePainting', {
                painting: JSON.stringify({
                    backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                    artCardIds
                })
            }, () => this.completePaintingMode.painting = {
                backgroundCard: undefined,
                artCards: [undefined, undefined, undefined]
            });
        } else {
            (this.canvasGame as any).showMessage(_("You need to add 3 Art Cards to your painting"), 'error')
        }
    }

    public createPaintingElement(backgroundCard: Card, artCards: Card[], node: string, size: string = 'normal') {
        const paintingId = `canvas-painting-${backgroundCard.id}-preview`;
        let zIndex = 100;
        dojo.place(`<div id="${paintingId}" class="canvas-painting ${size}"></div>`, node, 'only')
        const cardsWrapperId = `${paintingId}-cards-wrapper`;
        dojo.place(`<div id="${cardsWrapperId}" class="canvas-painting-cards-wrapper"></div>`, paintingId)
        dojo.place(`<div class="background-card background-card-${backgroundCard.type}" style="z-index: ${zIndex++};"></div>`, cardsWrapperId);
        artCards.filter(card => !!card).forEach(card => { dojo.place(`<div class="art-card art-card-${card.type_arg}" style="z-index: ${zIndex++};"></div>`, cardsWrapperId);})
        return paintingId;
    }

    private paintingToPng(painting) {
        const dialogId =  'share-painting-' + painting.id;
        const dialogContentId = 'share-painting-' + painting.id + '-content';
        const myDlg = new ebg.popindialog();
        myDlg.create( dialogId);
        myDlg.setTitle( _("Share your painting!") );
        myDlg.setContent(`<div id="${dialogContentId}" class="share-painting-dialog-content"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>`);
        myDlg.show();

        this.createPaintingElement(painting.backgroundCard, painting.artCards, 'html2canvas-result', 'large');
        dojo.place('<div class="canvas-copyright">&#169; Road To Infamy Games - Play Canvas on BoardGameArena.com</div>', 'html2canvas-result');
        // @ts-ignore
        html2canvas(document.querySelector("#html2canvas-result"), {scale: 1, imageTimeout: 0, allowTaint: true, useCORS: true}).then(canvas => {
            const fileName = `my-canvas-painting-${new Date().getTime()}.png`;
            const dataUrl = canvas.toDataURL("image/png");
            dojo.place(`<img src="${dataUrl}" crossorigin="anonymous" />`, dialogContentId, 'only')
            dojo.place(`<span>${_("Share your #CanvasPainting with the world by clicking the buttons below")}</span>`, dialogContentId)
            dojo.place(`<a id="download-painting-${painting.id}" class="bgabutton bgabutton_blue" href="${dataUrl}" download="${fileName}"><i class="fa fa-download" aria-hidden="true"></i></a>`, dialogContentId)
            dojo.place(`<a id="share-painting-${painting.id}" class="bgabutton bgabutton_blue"><i class="fa fa-share" aria-hidden="true"></i></a>`, dialogContentId)
            dojo.connect($(`share-painting-${painting.id}`), 'onclick', async () => {
                const blob = await this.asBlob(dataUrl);
                const data = {
                    files: [
                        new File([blob], fileName, {
                            type: blob.type,
                        }),
                    ],
                    title: 'Canvas Painting',
                    text: 'Look at my #CanvasPainting. Play Canvas on BoardGameArena.com'
                };
                try {
                    if (navigator.canShare && navigator.canShare(data)) {
                        await navigator.share(data);
                    } else {
                        document.getElementById(`download-painting-${painting.id}`).click();
                    }
                } catch (err) {
                    console.error(err.name, err.message);
                }
            });
        });
    }

    private asBlob(dataUrl) : Promise<Blob> {
        return new Promise(function (resolve) {
            const binaryString = atob(dataUrl.split(',')[1]);
            const length = binaryString.length;
            const binaryArray = new Uint8Array(length);

            for (let i = 0; i < length; i++) {
                binaryArray[i] = binaryString.charCodeAt(i);
            }

            resolve(
                new Blob([binaryArray], {
                    type: 'image/png',
                })
            );
        });
    }
}