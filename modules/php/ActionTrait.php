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

    public function takeArtCardAction($cardId) {
        self::checkAction(ACT_TAKE_ART_CARD);

        $this->takeArtCard($cardId, $this->getActivePlayerId(), $this->getPlayerName($this->getActivePlayerId()));

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

        // Current player, this can be called off turn
        $result = $this->scoringCardManager->scorePainting($artCards, $this->getCurrentPlayerId());

        self::notifyPlayer($this->getCurrentPlayerId(), 'paintingScored', '', $result);
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

        $artCards = [];
        foreach ($painting['artCardIds'] as $index => $artCardId) {
            $artCard = $this->artCardManager->getCard($artCardId);
            if ($artCard->location != ZONE_PLAYER_HAND || $artCard->location_arg != $activePlayerId) {
                throw new BgaUserException("Art card not in your hand");
            }
            $artCards[] = $artCard;
            $this->artCardManager->addCardToPainting($artCardId, $index, $backgroundCard->id);
        }

        if (sizeof($artCards) != 3) {
            throw new BgaUserException("Not enough art cards provided");
        }

        $paintingRibbons = $this->scoringCardManager->scorePainting($artCards, $this->getActivePlayerId());
        $this->ribbonManager->updateRibbons($activePlayerId, $paintingRibbons);

        $paintingName = $this->paintingManager->getPaintingName($backgroundCard->id);

        $playerScore = $this->scoringCardManager->updatePlayerScore($activePlayerId);

        self::notifyAllPlayers( 'paintingCompleted', '${player_name} completes <b>${paintingNameLeft} ${paintingNameRight}</b> and gains ${ribbonIcons}', [
            'i18n' => ['paintingNameLeft', 'paintingNameRight'],
            'playerId' => $activePlayerId,
            'player_name' => $this->getPlayerName($activePlayerId),
            'playerScore' => $playerScore,
            'painting' => $this->paintingManager->getPainting($backgroundCard->id),
            'paintingNameLeft' => $paintingName['left'],
            'paintingNameRight' => $paintingName['right'],
            'paintingRibbons' => $paintingRibbons,
            // ICONS
            'ribbonIcons' => $paintingRibbons
        ]);

        $this->gamestate->nextState(ST_NEXT_PLAYER);
    }

    public function performVincentTurn() {
        $inspirationTokens = $this->inspirationTokenManager->getTokensInLocation(ZONE_PLAYER_HAND, ZONE_PLAYER_HAND_VINCENT);
        $nrOfFaceUpTokens = 0;
        for ($i = 0; $i < sizeof($inspirationTokens); $i++) {
            $nrOfFaceUpTokens = $nrOfFaceUpTokens + bga_rand(0, 1);
        }
        $nrOfFaceUpTokens = min($nrOfFaceUpTokens, 4);

        $cardsInLocation = $this->artCardManager->getCardsInLocation(ZONE_DISPLAY, $nrOfFaceUpTokens + 1);
        $cardInLocation = reset($cardsInLocation);

        $this->takeArtCard($cardInLocation->id, ZONE_PLAYER_HAND_VINCENT, 'Vincent');
    }

    private function takeArtCard($cardId, $playerId, $playerName) {
        if (!isset($cardId)) {
            throw new BgaUserException(clienttranslate("You must select an Art Card to take"));
        }

        $inspirationTokens = $this->inspirationTokenManager->getTokensInLocation(ZONE_PLAYER_HAND, $playerId);
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
            $inspirationTokensPlaced[] = $this->inspirationTokenManager->placeInspirationTokenOnCard($playerId, reset($cardIdsInThisDisplaySlot));
        }
        // Take inspiration token from card
        $inspirationTokensTaken = $this->inspirationTokenManager->takeInspirationTokensFromCard($playerId, $cardId);
        // Take Art Card
        $cardTaken = $this->artCardManager->takeCard($playerId, $cardId);

        self::notifyAllPlayers('artCardTaken', '${player_name} places ${inspiration_tokens_1} to take <b>${artCardName}</b> and ${inspiration_tokens_2}', [
            'i18n' => ['artCardName'],
            'playerId' => $playerId,
            'player_name' => $playerName,
            'artCardName' => $cardTaken->name,
            'inspirationTokensPlaced' => $inspirationTokensPlaced,
            'inspirationTokensTaken' => $inspirationTokensTaken,
            'cardTaken' => $cardTaken,
            // ICONS
            'inspiration_tokens_1' => sizeof($inspirationTokensPlaced),
            'inspiration_tokens_2' => sizeof($inspirationTokensTaken)
        ]);

        $this->artCardManager->refillDisplay();
        self::notifyAllPlayers('displayRefilled', '', [
            'displayCards' => $this->artCardManager->getCardsInLocation(ZONE_DISPLAY)
        ]);
    }
}
