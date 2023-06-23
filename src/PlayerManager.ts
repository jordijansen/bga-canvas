class PlayerManager  {

    private ribbonCounters: {[playerId: number] : {[ribbonType: string] : Counter}} = {}

    constructor(private game: CanvasGame) {
    }

    public setUp(gameData: CanvasGameData) {
        const playerAreas = [];
        for (const playerId in gameData.players) {
            const player = gameData.players[playerId];

            const playerArea=this.createPlayerArea(player);
            if (Number(player.id) === this.game.getPlayerId()) {
                playerAreas.unshift(playerArea);
            } else {
                playerAreas.push(playerArea);
            }

            this.createPlayerPanels(player);
        }
        playerAreas.forEach(playerArea => dojo.place(playerArea, "player-areas"))
    }

    private createPlayerArea(player: CanvasPlayer) {
        return `<div id="player-area-${player.id}" class="player-area whiteblock">
                    <div class="title-wrapper"><div class="title color-${player.color}"><h1>${player.name}${_("'s Art Collection")}</h1></div></div>
                    <div id="player-inspiration-tokens-${player.id}"></div>
                    <div class="title-wrapper"><div class="title color-${player.color}"><h1>${_("Hand Cards")}</h1></div></div>
                    <div id="player-hand-${player.id}" class="player-hand"></div>
                    <div class="title-wrapper"><div class="title color-${player.color}"><h1>${_("Finished Paintings")}</h1></div></div>
                    <div id="player-finished-paintings-${player.id}" class="player-finished-paintings"></div>
                    <div id="player-background-${player.id}" style="display: none;"></div>
                </div>`
    }

    private createPlayerPanels(player: CanvasPlayer) {
        const html = `<div id="canvas-counters-${player.id}" class="canvas-counters" ></div>`;
        dojo.place(html, `player_board_${player.id}`);
    }
}