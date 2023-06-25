class InspirationTokenManager extends CardManager<Token> {

    private players: {[playerId: number]: CounterVoidStock<Token>} = {}
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
            this.players[Number(playersKey)] = new CounterVoidStock(this.canvasGame, this, {
                counter: new ebg.counter(),
                targetElement: `canvas-counters-${playersKey}`,
                counterId: `canvas-inspiration-token-counter-${playersKey}`,
                initialCounterValue: gameData.players[playersKey].inspirationTokens.length,
                setupIcon: (element) => {element.classList.add("canvas-inspiration-token-2d")}
            });
        }
        this.placeOnCards(gameData.displayInspirationTokens);
    }

    public setUpVincent(inspirationTokens) {
        this.players[Number(-999999)] = new CounterVoidStock(this.canvasGame, this, {
            counter: new ebg.counter(),
            targetElement: `canvas-counters-vincent`,
            counterId: `canvas-inspiration-token-counter-vincent`,
            initialCounterValue: inspirationTokens.length,
            setupIcon: (element) => {element.classList.add("canvas-inspiration-token-2d")}
        });
    }

    public placeOnCards(tokens: Token[], playerId?: number) {
        const promises = []
        tokens.forEach(token => {
            if (!this.cards[token.location_arg]) {
                this.cards[token.location_arg] = new LineStock<Token>(this, $(`inspiration-token-card-stock-${token.location_arg}`), {})
            }
            const animation = playerId ? {fromStock: this.players[playerId]} : {};
            promises.push(this.cards[token.location_arg].addCard(token, animation));
        })
        if (playerId) {
            this.players[playerId].decValue(tokens.length);
        }
        return Promise.all(promises);
    }

    public moveToPlayer(playerId: number, tokens: Token[]) {
        this.players[playerId].incValue(tokens.length);
        return this.players[playerId].addCards(tokens);
    }
}