<?php

trait DebugTrait {

    function dealCardsToPlayer()
    {
        $this->artCardManager->cards->pickCardsForLocation(5, ZONE_DECK, ZONE_PLAYER_HAND, $this->getActivePlayerId());
    }

    function dealCard($typeArg) {
        $allCards = $this->artCardManager->getCardsInLocation(ZONE_DECK);
        foreach ($allCards as $index => $card) {
            if ($card->type_arg == $typeArg) {
                $this->artCardManager->cards->moveCard($card->id, ZONE_PLAYER_HAND, $this->getActivePlayerId());
            }
        }
    }

}
