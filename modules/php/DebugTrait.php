<?php

trait DebugTrait {

    function dealCardsToPlayer()
    {
        $this->artCardManager->cards->pickCardsForLocation(5, ZONE_DECK, ZONE_PLAYER_HAND, $this->getActivePlayerId());
    }

}
