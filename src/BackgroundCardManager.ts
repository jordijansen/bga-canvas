class BackgroundCardManager extends CardManager<Card> {

    private players: {[playerId: number]: LineStock<Card>} = {}
    private paintings: {[paintingId: number]: LineStock<Card>} = {}

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-background-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-background-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.classList.add('background-card');
                div.classList.add('background-card-'+card.type);
                div.dataset.type = ''+card.type;
            },
            isCardVisible: (card: Card) => !!card.type,
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        // for (const playersKey in gameData.players) {
        //     const player = gameData.players[playersKey];
        //
        //     this.players[Number(playersKey)] = new LineStock<Card>(this, $(`player-background-${playersKey}`), {})
        //     player.backgroundCards.forEach(card => this.moveCardToPlayerHand(Number(playersKey), card))
        //
        // }
    }

    public moveCardToPlayerHand(playerId: number, card: Card) {
        return this.players[playerId].addCard(card)
    }

    public createPaintingStock(id: number, elementId: string, card: Card) {
        dojo.place(`<div id="${elementId}-background"></div>`, elementId);
        this.paintings[id] = new LineStock<Card>(this, $($(elementId + "-background")), {})
        this.paintings[id].addCard(card);
    }

}