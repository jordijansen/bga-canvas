<?php

class ArtCardManager {

    protected Deck $cards;

    public function __construct(Deck $deck) {
        $this->cards = $deck;
        $this->cards->init('art_card');
    }

    public function setUp() {
        $cards = [];

        for ($i = 1; $i <= 60; $i++) {
            $cards[] = array('type' => $i, 'type_arg' => $i, 'nbr' => 1);
        }
        $this->cards->createCards($cards, 'deck');
    }

    public function fillDisplay() {
        for ($i = 1; $i <= DISPLAY_CARD_SIZE; $i++) {
            $this->cards->pickCardsForLocation(1, ZONE_DECK, ZONE_DISPLAY, $i);
        }
        return $this->getCardsInLocation(ZONE_DISPLAY);
    }

    public function getCardsInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'location_arg');
        return array_map(fn($dbCard) => new Card($dbCard), array_values($dbResults));
    }
}
