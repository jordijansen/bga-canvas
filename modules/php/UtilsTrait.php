<?php

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

    function getPlayerNo(int $playerId) {
        return $this->getUniqueValueFromDB("SELECT player_no FROM player WHERE player_id = $playerId");
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
}
