interface Card {
    id: number,
    type?: string,
    type_arg?: number,
    location?: string,
    location_arg?: number
}

interface CanvasGameData extends GameData {

}

interface CanvasPlayer extends Player {

}

interface CanvasGame extends Game {
    getPlayerId(): number;
    getPlayer(playerId: number): CanvasPlayer;
    isReadOnly(): boolean;
    setTooltipToClass(className: string, html: string): void;
}