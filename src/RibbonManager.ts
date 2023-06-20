class RibbonManager extends CardManager<Token> {

    private static ribbonTokenId: number = 0;

    private players: {[playerId: number]: {[ribbonType: string]: CounterVoidStock<Token>}} = {}

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (token) => `canvas-ribbon-token-${token.id}`,
            setupDiv: (token: Token, div: HTMLElement) => {
                div.classList.add('canvas-ribbon');
                div.classList.add('large');
                div.dataset.type = ''+token.type;
            },
            cardWidth: RIBBON_TOKEN_WIDTH,
            cardHeight: RIBBON_TOKEN_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        for (const playersKey in gameData.players) {
            const player = gameData.players[playersKey];
            this.players[Number(playersKey)] = {};

            this.createRibbonCounterVoidStock(player, 'red')
            this.createRibbonCounterVoidStock(player, 'green')
            this.createRibbonCounterVoidStock(player, 'blue')
            this.createRibbonCounterVoidStock(player, 'purple')
            this.createRibbonCounterVoidStock(player, 'grey')
        }
    }

    public async updateRibbonCounters(playerId: number, painting: Painting, paintingRibbons: { [ribbonType: string]: number }) {
        for (const ribbonType in paintingRibbons) {
            const nrOfRibbons = paintingRibbons[ribbonType];
            this.players[playerId][ribbonType].incValue(paintingRibbons[ribbonType]);

            let tokens = [];
            for (let i = 0; i < nrOfRibbons; i++) {
                tokens.push(this.mockRibbonToken(ribbonType));
            }
            const element = document.querySelector(`#player-finished-painting-${painting.id}`);
            await this.players[playerId][ribbonType].addCards(tokens, {fromElement: element as HTMLElement})
        }
    }

    private mockRibbonToken(type: string): Token {
        return {id: RibbonManager.ribbonTokenId++, type};
    }
    private createRibbonCounterVoidStock( player: CanvasPlayer, ribbonType: string) {
        this.players[player.id][ribbonType] = new CounterVoidStock(this, {
            counter: new ebg.counter(),
            targetElement: `canvas-counters-${player.id}`,
            counterId: `canvas-ribbon-counter-${player.id}-${ribbonType}`,
            initialCounterValue: player.ribbons[ribbonType],
            setupIcon: (element) => {
                element.classList.add("canvas-ribbon");
                element.dataset.type = ribbonType
            }
        });
    }
}