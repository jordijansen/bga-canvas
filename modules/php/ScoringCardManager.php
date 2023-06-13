<?php

class ScoringCardManager {

    protected Deck $cards;

    public function __construct(Deck $deck) {
        $this->cards = $deck;
        $this->cards->init('scoring_card');
    }

    public function setUp() {
        $cards = [];

        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'COMPOSITION', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'CONSISTENCY', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'EMPHASIS', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'HIERARCHY', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'MOVEMENT', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'PROXIMITY', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'PROPORTION', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'REPETITION', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'SPACE', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'STYLE', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'SYMMETRY', 'nbr' => 1);
        $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => 'VARIETY', 'nbr' => 1);

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
        return array_map(fn($dbCard) => new ScoringCard($dbCard), array_values($dbResults));
    }
    
    public function scorePainting(array $artCards): array {
        $redIcons = [];
        $yellowIcons = [];
        $greenIcons = [];
        $blueIcons = [];
        $purpleIcons = [];
        
        foreach ($artCards as $artCard) {
            if (sizeof($artCard->redIcons) > 0)
                $redIcons = $artCard->redIcons;
            if (sizeof($artCard->yellowIcons) > 0)
                $yellowIcons = $artCard->yellowIcons;
            if (sizeof($artCard->greenIcons) > 0)
                $greenIcons = $artCard->greenIcons;
            if (sizeof($artCard->blueIcons) > 0)
                $blueIcons = $artCard->blueIcons;
            if (sizeof($artCard->purpleIcons) > 0)
                $purpleIcons = $artCard->purpleIcons;
        }

        $allIcons = [...$redIcons, ...$yellowIcons, ...$greenIcons, ...$blueIcons, ...$purpleIcons];
        $result = [];
        foreach ($this->getAllScoringCards() as $scoringCard) {
            if ($scoringCard->type_arg == 'VARIETY') {
                $result[$scoringCard->location] = 0;
                $onlyElements = array_filter($allIcons, fn($arrayValue) => in_array($arrayValue, [TEXTURE, HUE, TONE, SHAPE]));
                if (in_array(TEXTURE, $onlyElements) && in_array(HUE, $onlyElements) && in_array(TONE, $onlyElements) && in_array(SHAPE, $onlyElements))
                {
                    $elementsByCount = array_count_values($onlyElements);
                    $result[$scoringCard->location] = min(array_values($elementsByCount));
                }
            }
        }

        return $result;
    }
}
