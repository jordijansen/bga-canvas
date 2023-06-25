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

            this.createPlayerPanels(player);
        }
        playerAreas.forEach(playerArea => dojo.place(playerArea, "player-areas"))
    }

    public createVincentPlayerPanel() {
        let lastPlayerId = null;
        for (let playersKey in this.game.gamedatas.players) {
            if (Object.keys(this.game.gamedatas.players).length === Number(this.game.gamedatas.players[playersKey].playerNo)) {
                lastPlayerId = this.game.gamedatas.players[playersKey].id;
            }
        }
        console.log(lastPlayerId);
        dojo.place(`<div id="overall_vincent_board" class="player-board" style="height: auto;">
                                    <div class="player_board_inner">
                                            <div class="player-name">
                                               ${_('Vincent')}
                                            </div>
                                            <div class="player_board_content">
                                                ${this.createCanvasCounterWrapper('vincent')}
                                                <div id="vincent-card-stock"></div>
                                            </div>
                                    </div>
                                </div>`, `overall_player_board_${lastPlayerId}`, 'after');

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
        dojo.place(this.createCanvasCounterWrapper(player.id), `player_board_${player.id}`);
    }

    private createCanvasCounterWrapper(id) {
        return `<div id="canvas-counters-${id}" class="canvas-counters" ></div>`;
    }
}