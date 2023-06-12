class ArtCardManager extends CardManager<Card> {

    private deck: Deck<Card>
    private display: SlotStock<Card>
    private playerHand: {[playerId: number]: LineStock<Card> } = {}
    private paintings: {[paintingId: number]: LineStock<Card>} = {}

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-art-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-art-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.classList.add('art-card')
                div.classList.add('art-card-'+card.type)
                div.dataset.type = ''+card.type;
            },
            isCardVisible: (card: Card) => !!card.type,
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        this.deck = new Deck<Card>(this, $('art-card-deck'), {
            cardNumber: 60,
            topCard: {id: -1}
        });
        this.display = new SlotStock<Card>(this, $('art-card-display'), {
            mapCardToSlot: (card) => `art-card-display-slot-${card.location_arg}`,
            slotClasses: ['art-card-display-slot'],
            slotsIds: ['art-card-display-slot-1', 'art-card-display-slot-2', 'art-card-display-slot-3', 'art-card-display-slot-4', 'art-card-display-slot-5']
        });

        for (const playersKey in gameData.players) {
            this.playerHand[Number(playersKey)] = new LineStock<Card>(this, $(`player-hand-${playersKey}`), {})
            this.playerHand[Number(playersKey)].addCards(gameData.players[playersKey].handCards);
        }

        gameData.displayCards.forEach(card => {
            this.display.addCard(card)
            dojo.place(`<div id="inspiration-token-card-stock-${card.id}" class="inspiration-token-card-stock"></div>`, this.getCardElement(card).getAttribute("id"))
        })
    }

    takeCard(playerId: number, card: Card) {
        return this.playerHand[playerId].addCard(card);
    }

    enterDisplaySelectMode(availableCards: Card[]) {
        this.display.setSelectionMode('single');
        this.display.setSelectableCards(availableCards);
        this.display.onSelectionChange = (selection) => {
            this.unsetDisplayCostIndicator();
            if (selection.length === 1) {
               this.display.getCards()
                   .filter(card => card.location_arg < selection[0].location_arg)
                   .map(card => this.getCardElement(card))
                   .forEach(card => card.classList.add('cost-indicator'));
            }
        }
    }

    exitDisplaySelectMode() {
        this.display.setSelectionMode('none');
        this.display.onSelectionChange = undefined;
        this.unsetDisplayCostIndicator();
    }

    unsetDisplayCostIndicator() {
        this.display.getCards()
            .map(card => this.getCardElement(card))
            .forEach(card => card.classList.remove('cost-indicator'));
    }

    getSelectedDisplayCardId() {
        const selection = this.display.getSelection();
        if (selection && selection.length === 1) {
            return this.display.getSelection()[0].id;
        }
        return null;
    }

    updateDisplayCards(displayCards: Card[]) {
        return this.display.addCards(displayCards.slice(0, -1))
            .then(() => this.display.addCard(displayCards[displayCards.length - 1], {fromStock: this.deck}));
    }

    public createPaintingStock(id: number, elementId: string, cards: Card[]) {
        dojo.place(`<div id="${elementId}-art"></div>`, elementId);
        this.paintings[id] = new LineStock<Card>(this, $(elementId + "-art"), {})
        this.paintings[id].addCards(cards);
    }
}