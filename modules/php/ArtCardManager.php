<?php

class ArtCardManager {

    public Deck $cards;
    public $ART_CARDS;

    public function __construct(Deck $deck, $ART_CARDS) {
        $this->ART_CARDS = $ART_CARDS;
        $this->cards = $deck;
        $this->cards->init('art_card');
    }

    public function setUp() {
        $cards = [];

        for ($i = 1; $i <= 60; $i++) {
            $cards[] = array('type' => 'BASE_GAME', 'type_arg' => $i, 'nbr' => 1);
        }
        $this->cards->createCards($cards, 'deck');
        $this->cards->shuffle('deck');
    }

    public function fillDisplay() {
        for ($i = 1; $i <= DISPLAY_CARD_SIZE; $i++) {
            $this->cards->pickCardsForLocation(1, ZONE_DECK, ZONE_DISPLAY, $i);
        }
        return $this->getCardsInLocation(ZONE_DISPLAY);
    }

    public function refillDisplay() {
        for ($i = 1; $i <= DISPLAY_CARD_SIZE; $i++) {
            $cardsInSlot = $this->cards->getCardsInLocation( ZONE_DISPLAY, $i);
            if (sizeof($cardsInSlot) == 0) {
                if ($i == DISPLAY_CARD_SIZE) {
                    $this->cards->pickCardsForLocation(1, ZONE_DECK, ZONE_DISPLAY, $i);
                } else {
                    $cardsInNextSlot = $this->cards->getCardsInLocation( ZONE_DISPLAY, $i + 1);
                    $cardIdsInNextSlot = array_column($cardsInNextSlot, 'id');
                    $this->cards->moveCard(reset($cardIdsInNextSlot), ZONE_DISPLAY, $i);
                }
            }
        }
    }

    public function getCard($cardId) {
        return new ArtCard($this->cards->getCard($cardId), $this->ART_CARDS);
    }

    public function takeCard($playerId, $cardId) {
        $this->cards->moveCard($cardId, ZONE_PLAYER_HAND, $playerId);
        return $this->getCard($cardId);
    }

    public function addCardToPainting($cardId, $orderNo, $paintingId) {
        $this->cards->moveCard($cardId, ZONE_PAINTING.'_'.$paintingId, $orderNo);
        return $this->getCard($cardId);
    }

    public function getCardsInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'location_arg');
        return array_map(fn($dbCard) => new ArtCard($dbCard, $this->ART_CARDS), array_values($dbResults));
    }

    public function countCardsInLocation(string $location, int $location_arg = null): int
    {
        return $this->cards->countCardInLocation($location, $location_arg);
    }

    public function getAvailableCardsForTake(int $nrOfInspirationTokens): array
    {
        $availableCards = [];
        for ($i = 1; $i <= DISPLAY_CARD_SIZE; $i++) {
            if (($i - 1) <= $nrOfInspirationTokens) {
                $availableCards = [...$availableCards, ...$this->getCardsInLocation(ZONE_DISPLAY, $i)];
            }
        }
        return $availableCards;
    }
}
