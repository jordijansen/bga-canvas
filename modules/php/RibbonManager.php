<?php

class RibbonManager {

    protected Deck $cards;

    public function __construct(Deck $deck) {
        $this->cards = $deck;
        $this->cards->init('ribbon');
    }

    public function setUp() {
        $cards = [];

        $cards[] = array('type'=> TOKEN_RIBBON, 'type_arg' => SCORING_GREEN, 'nbr' => 50);
        $cards[] = array('type'=> TOKEN_RIBBON, 'type_arg' => SCORING_RED, 'nbr' => 50);
        $cards[] = array('type'=> TOKEN_RIBBON, 'type_arg' => SCORING_BLUE, 'nbr' => 50);
        $cards[] = array('type'=> TOKEN_RIBBON, 'type_arg' => SCORING_PURPLE, 'nbr' => 50);
        $cards[] = array('type'=> TOKEN_RIBBON, 'type_arg' => SCORING_GREY, 'nbr' => 50);

        $this->cards->createCards($cards, ZONE_DECK);
    }

    public function getTokensInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'id');
        return array_map(fn($dbCard) => new Token($dbCard), array_values($dbResults));
    }
}
