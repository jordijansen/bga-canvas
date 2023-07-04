interface Card {
    id: number,
    type?: number,
    type_arg?: number,
    location?: string,
    location_arg?: number
}

interface ScoringCard extends Card {
    scoring: {[nrOfRibbons: number]: number}
    name: string,
    description: string
}

interface Token {
    id: number,
    type?: string,
    type_arg?: string,
    location?: string,
    location_arg?: number
}

interface Painting {
    id: number,
    playerId: number,
    backgroundCard: Card,
    artCards: Card[],
    ribbons: {[scoringType: string]: number}
}

interface CanvasGameData extends GameData {
    displayCards: Card[],
    displayInspirationTokens: Token[],
    scoringCards: ScoringCard[]
    vincent: {active: boolean, inspirationTokens: Token[]}
    soloScoreToBeat: number
}

interface CanvasPlayer extends Player {
    handCards: Card[],
    backgroundCards: Card[],
    inspirationTokens: Token[],
    paintings: Painting[],
    ribbons: {[scoringType: string]: number},
    playerNo: string
    draftPainting?: {backgroundCardId: number, artCardIds: number[]}
}

interface CanvasGame extends Game {
    inspirationTokenManager: InspirationTokenManager;
    artCardManager: ArtCardManager;
    backgroundCardManager: BackgroundCardManager;
    scoringCardManager: ScoringCardManager;
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

interface CompletePaintingArgs {
    backgroundCards: Card[],
    artCards: Card[]
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

interface NotifPaintingScored {
    [scoringType: string]: number
}

interface NotifPaintingCompleted {
    playerId: number,
    player_name: string,
    playerScore: number,
    painting: Painting,
    paintingRibbons: {[scoringType: string]: number}
}