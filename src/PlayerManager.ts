class PlayerManager  {

    constructor(private game: CanvasGame) {
    }

    public setUp(gameData: CanvasGameData) {
        const playerAreas = [];
        let players = [];
        for (const playerId in gameData.players) {
            players.push(gameData.players[playerId]);
        }
        players = this.getOrderedPlayers(players);
        players.forEach(player => {
            const playerArea=this.createPlayerArea(player);
            if (Number(player.id) === this.game.getPlayerId()) {
                playerAreas.unshift(playerArea);
            } else {
                playerAreas.push(playerArea);
            }

            this.createPlayerPanels(player);
        })
        playerAreas.forEach(playerArea => dojo.place(playerArea, "player-areas"))
    }

    private getOrderedPlayers(players: CanvasPlayer[]) {
        const result = players.sort((a, b) => Number(a.playerNo) - Number(b.playerNo));
        const playerIndex = result.findIndex(player => Number(player.id) === Number((this.game as any).player_id));
        return playerIndex > 0 ? [...players.slice(playerIndex), ...players.slice(0, playerIndex)] : players;
    }

    public createVincentPlayerPanel() {
        let lastPlayerId = null;
        for (let playersKey in this.game.gamedatas.players) {
            if (Object.keys(this.game.gamedatas.players).length === Number(this.game.gamedatas.players[playersKey].playerNo)) {
                lastPlayerId = this.game.gamedatas.players[playersKey].id;
            }
        }
        dojo.place(`<div id="overall_vincent_board" class="player-board" style="height: auto;">
                                    <div class="player_board_inner">
                                            <h1 style="text-align: center;">Vincent</h1>
                                            <div class="player_board_content">
                                                ${this.createCanvasCounterWrapper('vincent')}
                                                <div id="vincent-card-stock"></div>
                                            </div>
                                    </div>
                                </div>`, `overall_player_board_${lastPlayerId}`, 'after');

    }

    public createSoloScoreToBeatPanel(soloScoreToBeat: number) {
        dojo.place(`<div id="overall-solo-score-to-beat" class="player-board" style="height: auto;">
                                    <div class="player_board_inner">
                                            <div class="player_board_content">
                                                <h1 style="text-align: center;">${_('Goal Score')}</h1>
                                                <span class="canvas-score-crosshair">${soloScoreToBeat}</span>
                                            </div>
                                    </div>
                                </div>`, `player_boards`, 'first');
    }

    private createPlayerArea(player: CanvasPlayer) {
        return `<div id="player-table-${player.id}" class="player-area whiteblock">
                    <div class="title-wrapper"><div class="title color-${player.color}"><h1>${dojo.string.substitute( _("${playerName}'s Art Collection"), {playerName: player.name} )}</h1></div></div>
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