<?php

class ScoringCardManager {

    protected Deck $cards;

    public function __construct(Deck $deck) {
        $this->cards = $deck;
        $this->cards->init('scoring_card');
    }

    public function setUp() {
        $cards = [];

        $cards[] = array('type'=> '1', 'type_arg' => 'COMPOSITION', 'nbr' => 1);
        $cards[] = array('type'=> '2', 'type_arg' => 'CONSISTENCY', 'nbr' => 1);
        $cards[] = array('type'=> '3', 'type_arg' => 'EMPHASIS', 'nbr' => 1);
        $cards[] = array('type'=> '4', 'type_arg' => 'HIERARCHY', 'nbr' => 1);
        $cards[] = array('type'=> '5', 'type_arg' => 'MOVEMENT', 'nbr' => 1);
        $cards[] = array('type'=> '6', 'type_arg' => 'PROXIMITY', 'nbr' => 1);
        $cards[] = array('type'=> '7', 'type_arg' => 'PROPORTION', 'nbr' => 1);
        $cards[] = array('type'=> '8', 'type_arg' => 'REPETITION', 'nbr' => 1);
        $cards[] = array('type'=> '9', 'type_arg' => 'SPACE', 'nbr' => 1);
        $cards[] = array('type'=> '10', 'type_arg' => 'STYLE', 'nbr' => 1);
        $cards[] = array('type'=> '11', 'type_arg' => 'SYMMETRY', 'nbr' => 1);
        $cards[] = array('type'=> '12', 'type_arg' => 'VARIETY', 'nbr' => 1);

        $this->cards->createCards($cards, 'deck');
    }

    public function drawScoringCards() {
        // TODO ADD SCENARIOS
        $this->cards->pickCardsForLocation(1, ZONE_DECK, SCORING_RED);
        $this->cards->pickCardsForLocation(1, ZONE_DECK, SCORING_GREEN);
        $this->cards->pickCardsForLocation(1, ZONE_DECK, SCORING_BLUE);
        $this->cards->pickCardsForLocation(1, ZONE_DECK, SCORING_PURPLE);
    }

    public function getAllScoringCards() {
        $result = [];
        foreach ([SCORING_RED, SCORING_GREEN, SCORING_BLUE, SCORING_PURPLE] as $scoringCardLocation) {
            $result = [...$result, ...$this->getCardsInLocation($scoringCardLocation)];
        }
        return $result;
    }

    public function getCardsInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'id');
        return array_map(fn($dbCard) => new Card($dbCard), array_values($dbResults));
    }
}
