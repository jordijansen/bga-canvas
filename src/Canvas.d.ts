interface Card {
    id: number,
    type?: number,
    type_arg?: number,
    location?: string,
    location_arg?: number
}

interface Token {
    id: number,
    type?: string,
    type_arg?: string,
    location?: string,
    location_arg?: number
}

interface CanvasGameData extends GameData {
    displayCards: Card[],
    displayInspirationTokens: Token[],
    scoringCards: Card[]
}

interface CanvasPlayer extends Player {
    handCards: Card[],
    backgroundCards: Card[],
    inspirationTokens: Token[]
}

interface CanvasGame extends Game {
    inspirationTokenManager: InspirationTokenManager;
    gamedatas: CanvasGameData;
    getPlayerId(): number;
    getPlayer(playerId: number): CanvasPlayer;
    isReadOnly(): boolean;
    setTooltipToClass(className: string, html: string): void;
}

interface TakeArtCardArgs {
    availableCards: Card[],
    inspirationTokens: Token[]
}

/**
 * Notification Args
 */

interface NotifArtCardTaken {
    playerId: number,
    player_name: string,
    inspirationTokensPlaced: Token[],
    inspirationTokensTaken: Token[],
    cardTaken: Card
}

interface NotifDisplayRefilled {
    displayCards: Card[]
}