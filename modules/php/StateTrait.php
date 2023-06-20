<?php

trait StateTrait {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    //////////////////////////////////////////////////////////////////////////////
    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    function stNextPlayer()
    {
        // If all players have created 3 paintings the game ends
        $totalPaintingCount = $this->paintingManager->countAllPaintings();
        if (intval($totalPaintingCount) == ($this->getPlayersNumber() * 3)) {
            $this->gamestate->nextState( ST_GAME_END);
        } else {
            // Find the next player, a player is skipped if they've created 3 paintings already.
            $skipPlayer = true;
            while ($skipPlayer) {
                $this->activeNextPlayer();
                $playerId = $this->getActivePlayerId();
                $skipPlayer = sizeof($this->paintingManager->getPaintings($playerId)) == 3;
            }
            $this->gamestate->nextState( ST_PLAYER_TURN);
        }
    }
}