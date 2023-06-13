<?php

class BackgroundCardManager {

    protected Deck $cards;

    public function __construct(Deck $deck) {
        $this->cards = $deck;
        $this->cards->init('background_card');
    }

    public function setUp() {
        $cards = [];

        for ($i = 1; $i <= 20; $i++) {
            $cards[] = array('type' => $i, 'type_arg' => $i, 'nbr' => 1);
        }
        $this->cards->createCards($cards, 'deck');
    }

    public function dealBackgroundCardsToPlayers(array $players) {
        foreach( $players as $playerId => $player) {
            $this->cards->pickCardsForLocation(NR_OF_BACKGROUND_CARDS_PER_PLAYER, ZONE_DECK, ZONE_PLAYER_HAND, $playerId);
        }
    }

    public function getCardsInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'id');
        return array_map(fn($dbCard) => new Card($dbCard), array_values($dbResults));
    }

    public function getCard(int $cardId) {
        return new Card($this->cards->getCard($cardId));
    }

    public function addCardToPainting($cardId, $orderNo, $paintingId) {
        $this->cards->moveCard($cardId, ZONE_PAINTING.'_'.$paintingId, $orderNo);
        return $this->getCard($cardId);
    }
}
