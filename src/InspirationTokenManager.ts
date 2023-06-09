class InspirationTokenManager extends CardManager<Token> {

    private players: {[playerId: number]: LineStock<Token>} = {}
    private cards: {[cardId: number]: LineStock<Token>} = {}

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (token) => `canvas-inspiration-token-${token.id}`,
            setupDiv: (token: Token, div: HTMLElement) => {
                div.classList.add('canvas-inspiration-token');
                div.dataset.id = ''+token.id;
            },
            cardWidth: INSPIRATION_TOKEN_WIDTH,
            cardHeight: INSPIRATION_TOKEN_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        for (const playersKey in gameData.players) {
            this.players[Number(playersKey)] = new LineStock<Token>(this, $(`player-inspiration-tokens-${playersKey}`), {})
            gameData.players[playersKey].inspirationTokens.forEach(token => this.players[Number(playersKey)].addCard(token))
        }
        this.placeOnCards(gameData.displayInspirationTokens);
    }

    public placeOnCards(tokens: Token[]) {
        const promises = []
        tokens.forEach(token => {
            if (!this.cards[token.location_arg]) {
                this.cards[token.location_arg] = new LineStock<Token>(this, $(`inspiration-token-card-stock-${token.location_arg}`), {})
            }
            promises.push(this.cards[token.location_arg].addCard(token));
        })
        return Promise.all(promises);
    }

    public moveToPlayer(playerId: number, tokens: Token[]) {
        return this.players[playerId].addCards(tokens);
    }
}