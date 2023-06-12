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
                        <h1 style="background-color: #${player.color};">${player.name}${_("'s Art Collection")}</h1>
                    </div>
                    <div id="player-inspiration-tokens-${player.id}"></div>
                    <div class="title-wrapper"><div class="title"><h1>${_("Hand Cards")}</h1></div></div>
                    <div id="player-hand-${player.id}"></div>
                    <div class="player-collection-wrapper">
                        <div class="player-collection-wrapper-item">
                            <div class="title-wrapper"><div class="title secondary"><h1>${_("Background Cards")}</h1></div></div>
                            <div id="player-background-${player.id}"></div>   
                        </div>  
                        <div class="player-collection-wrapper-item">
                            <div class="title-wrapper"><div class="title secondary"><h1>${_("Finished Paintings")}</h1></div></div>
                            <div id="player-finished-paintings-${player.id}" class="player-finished-paintings">
                                
                            </div>
                        </div>
                    </div>
                </div>`
    }
}