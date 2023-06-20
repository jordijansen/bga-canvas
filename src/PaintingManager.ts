class PaintingManager {

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
            artCards: []
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
        this.completePaintingMode = {
            backgroundCards,
            artCards,
            painting: {
                backgroundCard: backgroundCards[0],
                artCards: artCards.slice(0, 3)
            }
        }
        dojo.place(this.createCompletePaintingPickerElement(), 'complete-painting')
        dojo.place(this.createCompletePaintingPreviewElement(), 'complete-painting')

        dojo.place(this.createBackgroundSlot(this.completePaintingMode.backgroundCards.length), 'art-cards-picker-top-text', 'before');
        dojo.place(this.createBackgroundElement(this.completePaintingMode.painting.backgroundCard),'complete-painting-background-card-slot')
        dojo.connect($('change-background-button'), 'onclick', () => this.changeBackgroundCard());

        for (let i = 1; i <= 3; i++) {
            dojo.place(this.createArtCardSlot(i), 'art-cards-picker-top-text', 'before')
            dojo.place(this.createArtCardElement(this.completePaintingMode.painting.artCards[i - 1]),`complete-painting-art-card-slot-${i}`)

            dojo.connect($(`art-card-move-left-${i}`), 'onclick', () => this.moveArtCard('left', i));
            dojo.connect($(`art-card-move-right-${i}`), 'onclick', () => this.moveArtCard('right', i));
            dojo.connect($(`art-card-change-${i}`), 'onclick', () => this.changeArtCard(i));
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

    private moveArtCard(direction, i) {
        const newIndex = direction === 'left' ? i -1 : i + 1;
        const newPositionCard = this.completePaintingMode.painting.artCards[newIndex - 1];
        const oldPositionCard = this.completePaintingMode.painting.artCards[i - 1];

        dojo.place(this.createArtCardElement(newPositionCard), `complete-painting-art-card-slot-${i}`, 'only')
        this.completePaintingMode.painting.artCards[i - 1] = newPositionCard;

        dojo.place(this.createArtCardElement(oldPositionCard), `complete-painting-art-card-slot-${newIndex}`, 'only')
        this.completePaintingMode.painting.artCards[newIndex - 1] = oldPositionCard;
        this.updatePreview();
    }

    private changeArtCard(i) {
        const currentCard = this.completePaintingMode.painting.artCards[i - 1];
        const currentCardIndex = this.completePaintingMode.artCards.indexOf(currentCard);

        let searchIndex = currentCardIndex + 1;
        let newCard = undefined;
        while (!newCard) {
            if (this.completePaintingMode.artCards.length === searchIndex) {
                searchIndex = 0;
            }
            if (!this.completePaintingMode.painting.artCards.includes(this.completePaintingMode.artCards[searchIndex])) {
                newCard = this.completePaintingMode.artCards[searchIndex];
            }
            searchIndex = searchIndex + 1;
        }

        dojo.place(this.createArtCardElement(newCard), `complete-painting-art-card-slot-${i}`, 'only')
        this.completePaintingMode.painting.artCards[i - 1] = newCard;

        this.updateUnusedCards();
        this.updatePreview();
    }

    public exitCompletePaintingMode() {
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
                    <div id="art-cards-picker-bottom-text"><h1>${_("Bottom")}</h1></div>
                    <div id="art-cards-picker-top-text"><h1>${_("Top")}</h1></div>
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
                <div class="top-button-wrapper button-wrapper"><a id="art-card-move-left-${id}" class="bgabutton bgabutton_blue" style="visibility: ${id === 1 ? 'hidden' : 'visible'};"><i class="fa fa-arrow-left" aria-hidden="true"></i></a></div>
                <div id="complete-painting-art-card-slot-${id}" class="complete-painting-art-card-slot"></div>
                <div class="center-button-wrapper button-wrapper"><a id="art-card-change-${id}" class="bgabutton bgabutton_blue" style="visibility: ${this.completePaintingMode.artCards.length <= 3 ? 'hidden' : 'visible'};"><i class="fa fa-refresh" aria-hidden="true"></i></a></div>
                <div class="bottom-button-wrapper button-wrapper"><a id="art-card-move-right-${id}" class="bgabutton bgabutton_blue" style="visibility: ${id === 3 ? 'hidden' : 'visible'};"><i class="fa fa-arrow-right" aria-hidden="true"></i></a></div>
            </div>
        `
    }

    private createBackgroundSlot(nrOfBackgroundCards: number) {
        return `
            <div>
                <div class="top-button-wrapper button-wrapper"><a id="change-background-button" class="bgabutton bgabutton_blue ${nrOfBackgroundCards <= 1 ? 'disabled' : ''}"><i class="fa fa-refresh" aria-hidden="true"></i></a></div>
                <div id="complete-painting-background-card-slot" class="complete-painting-art-card-slot"></div>
            </div>
        `
    }

    private createBackgroundElement(card: Card, postfix: string = 'clone') {
        const clone = this.canvasGame.backgroundCardManager.createCardElement(card) as any;
        clone.id = `${clone.id}-${postfix}`;
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
                dojo.place(this.createArtCardElement(card),`art-cards-picker-unused`)
            })
    }

    private updatePreview() {
        this.createPaintingElement(this.completePaintingMode.painting.backgroundCard, this.completePaintingMode.painting.artCards, 'complete-painting-preview-slot', 'large')

        this.canvasGame.takeNoLockAction('scorePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds: this.completePaintingMode.painting.artCards.map(card => card.id)
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
        dojo.destroy('complete-painting-picker-wrapper');
        this.canvasGame.takeAction('completePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds: this.completePaintingMode.painting.artCards.map(card => card.id)
            })
        })
    }

    public createPaintingElement(backgroundCard: Card, artCards: Card[], node: string, size: string = 'normal', copyright: boolean = false) {
        const paintingId = `canvas-painting-${backgroundCard.id}-preview`;
        dojo.place(`<div id="${paintingId}" class="canvas-painting ${size}"></div>`, node, 'only')
        const cardsWrapperId = `${paintingId}-cards-wrapper`;
        dojo.place(`<div id="${cardsWrapperId}" class="canvas-painting-cards-wrapper"></div>`, paintingId)
        dojo.place(`<div class="background-card background-card-${backgroundCard.type}"></div>`, cardsWrapperId);
        artCards.forEach(card => { dojo.place(`<div class="art-card art-card-${card.type_arg}"></div>`, cardsWrapperId);})
        if (copyright) {
            dojo.place('<div id="canvas-copyright">#CanvasPainting<br/>&#169; Road To Infamy Games<br/>Play Canvas on BoardGameArena.com</div>', paintingId);
        }
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

        const elementId = this.createPaintingElement(painting.backgroundCard, painting.artCards, 'html2canvas-result', 'large', true);
        const el = document.getElementById(elementId)

        // @ts-ignore
        domtoimage
            .toPng(el)
            .then(function (dataUrl) {
                // dojo.empty('html2canvas-result')
                dojo.place(`<img src="${dataUrl}" />`, dialogContentId, 'only')
                dojo.place(`<span>${_("Share your #CanvasPainting with the world by clicking the button below")}</span>`, dialogContentId)
                dojo.place(`<a id="share-painting-${painting.id}" class="bgabutton bgabutton_blue"><i class="fa fa-share" aria-hidden="true"></i></a>`, dialogContentId)
                dojo.connect($(`share-painting-${painting.id}`), 'onclick', () => {
                    // @ts-ignore
                    domtoimage
                        .toBlob(el)
                        .then(async function (blob) {
                            const fileName = `my-canvas-painting-${new Date().getTime()}.png`;
                            const data = {
                                files: [
                                    new File([blob], fileName, {
                                        type: blob.type,
                                    }),
                                ],
                                title: 'Canvas Painting'
                            };
                            try {
                                if (navigator.canShare && navigator.canShare(data)) {
                                    await navigator.share(data);
                                } else {
                                    const a = document.createElement('a');
                                    const url = window.URL.createObjectURL(blob);
                                    a.href = url;
                                    a.download = fileName;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    a.remove();
                                }
                            } catch (err) {
                                console.error(err.name, err.message);
                            }
                        })
                        .catch(function (error) {
                            console.error('oops, something went wrong!', error);
                        })
                });
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    }
}