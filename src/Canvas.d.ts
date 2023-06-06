interface Card {
    id: number,
    type?: string,
    type_arg?: number,
    location?: string,
    location_arg?: number
}

interface CanvasGameData extends GameData {
    display: Card[],
    scoringCards: Card[]
}

interface CanvasPlayer extends Player {
    backgroundCards: Card[]
}

interface CanvasGame extends Game {
    getPlayerId(): number;
    getPlayer(playerId: number): CanvasPlayer;
    isReadOnly(): boolean;
    setTooltipToClass(className: string, html: string): void;
}