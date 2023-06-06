class BackgroundCardManager extends CardManager<Card> {

    private players: {[playerId: number]: LineStock<Card>} = {}

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-background-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-background-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.dataset.type = ''+card.type;
            },
            isCardVisible: (card: Card) => !!card.type,
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        for (const playersKey in gameData.players) {
            this.players[Number(playersKey)] = new LineStock<Card>(this, $(`player-background-${playersKey}`), {})
            gameData.players[playersKey].backgroundCards.forEach(card => this.players[Number(playersKey)].addCard(card))
        }

    }
}