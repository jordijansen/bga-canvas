<?php

trait StateTrait {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state actions
    //////////////////////////////////////////////////////////////////////////////
    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    function stPlayerTurn()
    {
        $availableActions = $this->getAvailableActions();
        if (sizeof($availableActions) == 1) {
            $this->gamestate->nextState(reset($availableActions));
        }
    }

    function stNextPlayer()
    {
        // If all players have created 3 paintings the game ends
        $totalPaintingCount = $this->paintingManager->countAllPaintings();

        if (intval($totalPaintingCount) == ($this->getPlayersNumber() * NR_OF_PAINTINGS_PER_PLAYER)) {
            if ($this->getPlayersNumber() == 1) {
                $playerScore = intval($this->getPlayerScore($this->getActivePlayerId()));
                if ($playerScore < $this->getSoloScoreToBeat()) {
                    $negatedScore = -$playerScore;
                    $this->updatePlayerScore($this->getActivePlayerId(), $negatedScore);
                }
            }
            $this->setEndGameStats();
            $this->gamestate->nextState( ST_GAME_END);
        } else {
            // Find the next player, a player is skipped if they've created 3 paintings already.
            $skipPlayer = true;
            while ($skipPlayer) {
                if (intval($this->getPlayerNo($this->getActivePlayerId())) == $this->getPlayersNumber() && $this->isPaintingWithVincent()) {
                    // This was the last player for the round, take vincent turn
                    $this->performVincentTurn();
                }

                $this->activeNextPlayer();
                $playerId = $this->getActivePlayerId();
                $skipPlayer = sizeof($this->paintingManager->getPaintings($playerId)) == 3;
            }
            $this->giveExtraTime($this->getActivePlayerId());
            $this->gamestate->nextState( ST_PLAYER_TURN);
        }
    }
}