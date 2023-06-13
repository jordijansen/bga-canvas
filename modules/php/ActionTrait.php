<?php

use objects\Take;

trait ActionTrait {

    //////////////////////////////////////////////////////////////////////////////
    //////////// Player actions
    //////////// 
    
    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in nicodemus.action.php)
    */
    public function chooseAction(string $action) {
        self::checkAction(ACT_CHOOSE_ACTION);

        if (in_array($action, $this->getAvailableActions())) {
            $this->gamestate->nextState($action);
        } else {
            throw new BgaUserException("Unknown action provided for chooseAction");
        }
    }

    public function takeArtCard($cardId) {
        self::checkAction(ACT_TAKE_ART_CARD);


        if (!isset($cardId)) {
            throw new BgaUserException(clienttranslate("You must select an Art Card to take"));
        }

        $activePlayerId = $this->getActivePlayerId();
        $inspirationTokens = $this->inspirationTokenManager->getTokensInLocation(ZONE_PLAYER_HAND, $activePlayerId);
        $availableCards = $this->artCardManager->getAvailableCardsForTake(sizeof($inspirationTokens));
        $availableCardIds = array_column($availableCards, 'id');

        if (!in_array($cardId, $availableCardIds)) {
            throw new BgaUserException(clienttranslate("You don't have enough Inspiration Tokens or selected card is not in display"));
        }

        // Move the card from display to player hand
        $cardToTake = $this->artCardManager->getCard($cardId);
        // Place inspiration tokens on other cards if needed
        $inspirationTokensPlaced = [];
        for ($i = 1; $i < $cardToTake->location_arg; $i++) {
            $cardsInThisDisplaySlot = $this->artCardManager->getCardsInLocation(ZONE_DISPLAY, $i);
            $cardIdsInThisDisplaySlot = array_map(fn($card) => $card->id, array_values($cardsInThisDisplaySlot));
            $inspirationTokensPlaced[] = $this->inspirationTokenManager->placeInspirationTokenOnCard($activePlayerId, reset($cardIdsInThisDisplaySlot));
        }
        // Take inspiration token from card
        $inspirationTokensTaken = $this->inspirationTokenManager->takeInspirationTokensFromCard($activePlayerId, $cardId);
        // Take Art Card
        $cardTaken = $this->artCardManager->takeCard($activePlayerId, $cardId);

        self::notifyAllPlayers('artCardTaken', '${player_name} places ${inspiration_tokens_1} to take an Art Card and ${inspiration_tokens_2}', [
            'playerId' => $activePlayerId,
            'player_name' => $this->getPlayerName($activePlayerId),
            'inspirationTokensPlaced' => $inspirationTokensPlaced,
            'inspirationTokensTaken' => $inspirationTokensTaken,
            'cardTaken' => $cardTaken,
            // ICONS
            'inspiration_tokens_1' => sizeof($inspirationTokensPlaced),
            'inspiration_tokens_2' => sizeof($inspirationTokensTaken)
        ]);

        $this->artCardManager->refillDisplay();
        self::notifyAllPlayers('displayRefilled', 'Display refilled', [
            'displayCards' => $this->artCardManager->getCardsInLocation(ZONE_DISPLAY)
        ]);

        $this->gamestate->nextState(ST_NEXT_PLAYER);
    }

    public function cancelAction() {
        self::checkAction(ACT_CANCEL_ACTION);
        $this->gamestate->nextState(ACT_CANCEL_ACTION);
    }

    public function scorePainting($painting) {
        $artCards = [];
        foreach ($painting['artCardIds'] as $index => $artCardId) {
            $artCards[] = $this->artCardManager->getCard($artCardId);
        }

        $result = $this->scoringCardManager->scorePainting($artCards);

        // TODO implement scoring
        self::notifyPlayer($this->getActivePlayerId(), 'paintingScored', '', $result);
    }

    public function completePainting($painting) {
        self::checkAction(ACT_COMPLETE_PAINTING);
        $activePlayerId = $this->getActivePlayerId();
        if (!isset($painting['backgroundCardId'])) {
            throw new BgaUserException("No background card provided");
        }

        $backgroundCard = $this->backgroundCardManager->getCard($painting['backgroundCardId']);
        if ($backgroundCard->location != ZONE_PLAYER_HAND || $backgroundCard->location_arg != $activePlayerId) {
            throw new BgaUserException("Background card not in your hand");
        }
        $this->DbQuery("INSERT INTO painting (id, player_id) VALUES (".$backgroundCard->id.", ". $activePlayerId .")");
        $backgroundCard = $this->backgroundCardManager->addCardToPainting($backgroundCard->id, 0, $backgroundCard->id);

        foreach ($painting['artCardIds'] as $index => $artCardId) {
            $artCard = $this->artCardManager->getCard($artCardId);
            if ($artCard->location != ZONE_PLAYER_HAND || $artCard->location_arg != $activePlayerId) {
                throw new BgaUserException("Art card not in your hand");
            }
            $this->artCardManager->addCardToPainting($artCardId, $index, $backgroundCard->id);
        }

        self::notifyAllPlayers( 'paintingCompleted', '${player_name} completes a painting and scores ${ribbons}', [
            'playerId' => $activePlayerId,
            'player_name' => $this->getPlayerName($activePlayerId),
            'painting' => $this->paintingManager->getPainting($backgroundCard->id),
            'ribbons' => 0
        ]);

        $this->gamestate->nextState(ST_NEXT_PLAYER);
    }
}
