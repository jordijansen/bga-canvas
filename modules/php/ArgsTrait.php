<?php

trait ArgsTrait
{

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    //////////////////////////////////////////////////////////////////////////////
    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */
    function argPlayerTurn(): array
    {
        return [
            'availableActions' => $this->getAvailableActions()
        ];
    }

    function argTakeArtCard(): array
    {
        $inspirationTokens = $this->inspirationTokenManager->getTokensInLocation(ZONE_PLAYER_HAND, $this->getActivePlayerId());
        $availableCards = $this->artCardManager->getAvailableCardsForTake(sizeof($inspirationTokens));

        return [
            'availableActions' => $this->getAvailableActions(),
            'inspirationTokens' => $inspirationTokens,
            'availableCards' => $availableCards
        ];
    }

    function argCompletePainting(): array
    {
        return [
            'availableActions' => $this->getAvailableActions()
        ];
    }

}