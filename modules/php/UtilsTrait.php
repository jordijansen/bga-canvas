<?php

use objects\Painting;
use objects\Undo;

trait UtilsTrait {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Generic Utility functions
    ////////////

    function saveForUndo() {
        // TODO
        $displayCards = $this->cardManager->getCardsInLocation(ZONE_DISPLAY);

        $this->setGlobalVariable(UNDO, new Undo(
            array_map(fn($card) => $card->id, $displayCards),
        ));

        $this->setGameStateValue(CANCELLABLE_MOVES, 0);
    }

    function canCancelMoves() {
        return intval($this->getGameStateValue(CANCELLABLE_MOVES)) > 0;
    }

    function setGlobalVariable(string $name, /*object|array*/ $obj) {
        $jsonObj = json_encode($obj);
        $this->DbQuery("INSERT INTO `global_variables`(`name`, `value`)  VALUES ('$name', '$jsonObj') ON DUPLICATE KEY UPDATE `value` = '$jsonObj'");
    }

    function getGlobalVariable(string $name, $asArray = null) {
        $json_obj = $this->getUniqueValueFromDB("SELECT `value` FROM `global_variables` where `name` = '$name'");
        if ($json_obj) {
            $object = json_decode($json_obj, $asArray);
            return $object;
        } else {
            return null;
        }
    }

    function deleteGlobalVariable(string $name) {
        $this->DbQuery("DELETE FROM `global_variables` where `name` = '$name'");
    }

    function deleteGlobalVariables(array $names) {
        $this->DbQuery("DELETE FROM `global_variables` where `name` in (".implode(',', array_map(fn($name) => "'$name'", $names)).")");
    }

    function getPlayerName(int $playerId) {
        return self::getUniqueValueFromDB("SELECT player_name FROM player WHERE player_id = $playerId");
    }

    function getPlayers() {
        return $this->getCollectionFromDB("SELECT * FROM player");
    }

    function getPlayerNo($playerId) {
        return $this->getUniqueValueFromDB("SELECT player_no FROM player WHERE player_id = $playerId");
    }

    function getPlayerScore(int $playerId) {
        return $this->getUniqueValueFromDB("SELECT player_score FROM player WHERE player_id = $playerId");
    }

    function updatePlayerScoreAndAux(int $playerId, int $playerScore, int $playerScoreAux = 0) {
        $this->DbQuery("UPDATE player SET player_score = ".$playerScore.", player_score_aux = ".$playerScoreAux." WHERE player_id = ". $playerId);
    }

    function updatePlayerScore(int $playerId, int $playerScore) {
        $this->DbQuery("UPDATE player SET player_score = ".$playerScore." WHERE player_id = ". $playerId);
    }


    //////////////////////////////////////////////////////////////////////////////
    //////////// Canvas Utility functions
    ////////////
    function getAvailableActions(): array
    {
        $nrOfHandCards = $this->artCardManager->countCardsInLocation(ZONE_PLAYER_HAND, $this->getActivePlayerId());
        $availableActions = [];
        if ($nrOfHandCards < 5) {
            $availableActions = [ACT_TAKE_ART_CARD];
        }
        if ($nrOfHandCards >= 3) {
            $availableActions = [...$availableActions, ACT_COMPLETE_PAINTING];
        }
        return $availableActions;
    }

    function isPaintingWithVincent(): bool
    {
        // Painting with Vincent is included if the players choose so, or if there is only 1 player
        return $this->getGameStateValue(PAINTING_WITH_VINCENT_OPTION) == PAINTING_WITH_VINCENT_INCLUDED || $this->getPlayersNumber() == 1;
    }

    function getSoloScoreToBeat(): int
    {
        $scoringCardOption = $this->getGameStateValue(SCORING_CARDS_OPTION);
        if ($scoringCardOption == SCORING_CARDS_STANDARD) {
            return $this->getGameStateValue(SOLO_MODE_DIFFICULTY);
        } else {
            return $this->SOLO_MODE_SCENARIO_GOAL_SCORES[$scoringCardOption];
        }
    }

    function setEndGameStats()
    {
        $this->setStat(intval($this->getUniqueValueFromDB("SELECT sum(number) / (SELECT count(1) FROM painting) FROM ribbon")), TABLE_NUMBER_OF_RIBBONS_PER_PAINTING);

        foreach ($this->getPlayers() as $player) {
            $playerId = intval($player['player_id']);
            $inspirationTokens = $this->inspirationTokenManager->getTokensInLocation(ZONE_PLAYER_HAND, $playerId);
            $this->setStat(sizeof($inspirationTokens), PLAYER_INSPIRATION_TOKENS,  $playerId);

            $paintings = $this->paintingManager->getPaintings($playerId);
            $ribbonCount = 0;
            /** @var Painting $painting */
            foreach ($paintings as $painting) {
                foreach ($painting->ribbons as $ribbonType => $nrOfRibbons) {
                    $ribbonCount += $nrOfRibbons;
                }
            }
            if (sizeof($paintings) > 0) {
                $this->setStat($ribbonCount / sizeof($paintings), PLAYER_NUMBER_OF_RIBBONS_PER_PAINTING, $playerId);
            }

            $ribbons = $this->ribbonManager->getRibbonsForPlayer($playerId);

            /** @var ScoringCard $scoringCard */
            foreach ($this->scoringCardManager->getAllScoringCards() as $scoringCard) {
                $statName = 'PLAYER_RIBBONS_' .$scoringCard->type;
                $nrOfRibbons = $ribbons[$scoringCard->location];

                $this->setStat($nrOfRibbons, $statName, $playerId);
            }

            $this->setStat($ribbons[SCORING_GREY], PLAYER_RIBBONS_GREY, $playerId);
        }
    }
}
