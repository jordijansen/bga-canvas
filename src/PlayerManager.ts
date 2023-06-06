class PlayerManager  {

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
        }
        playerAreas.forEach(playerArea => dojo.place(playerArea, "player-areas"))
    }

    private createPlayerArea(player: CanvasPlayer) {
        return `<div id="player-area-${player.id}" class="player-area whiteblock">
                    <div class="canvas-title-wrapper">
                        <h2 class="canvas-title" style="background-color: #${player.color};">${player.name}${_("'s Art Collection")}</h2>
                    </div>
                    <h2>${_("Finished Paintings")}</h2>
                    <div id="player-finished-paintings-${player.id}"></div>
                    <h2>${_("Background Cards")}</h2>
                    <div id="player-background-${player.id}"></div>
                </div>`
    }
}