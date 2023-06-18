<?php

class ScoringCardManager {

    protected Deck $cards;
    private $SCORING_CARDS;

    public function __construct(Deck $deck, $SCORING_CARDS) {
        $this->SCORING_CARDS = $SCORING_CARDS;
        $this->cards = $deck;
        $this->cards->init('scoring_card');
    }

    public function setUp() {
        $cards = [];

        for ($i = 1; $i <= 12; $i++) {
            $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => $i, 'nbr' => 1);
        }

        $this->cards->createCards($cards, ZONE_DECK);
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
        return array_map(fn($dbCard) => new ScoringCard($dbCard, $this->SCORING_CARDS), array_values($dbResults));
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
            if ($scoringCard->name == 'VARIETY') {
                $result[$scoringCard->location] = 0;
                $onlyElements = array_filter($allIcons, fn($arrayValue) => in_array($arrayValue, BASIC_ELEMENTS));
                if (in_array(TEXTURE, $onlyElements) && in_array(HUE, $onlyElements) && in_array(TONE, $onlyElements) && in_array(SHAPE, $onlyElements))
                {
                    $elementsByCount = array_count_values($onlyElements);
                    $result[$scoringCard->location] = min(array_values($elementsByCount));
                }
            } else if ($scoringCard->name == 'STYLE') {
                $textureIcons = array_filter($allIcons, fn($arrayValue) => in_array($arrayValue, [TEXTURE]));
                $result[$scoringCard->location] = floor(sizeof($textureIcons) / 3);
            } else if ($scoringCard->name == 'SYMMETRY') {
               $foundPairs = 0;
               foreach (BASIC_ELEMENTS as $basicElement) {
                   if ((in_array($basicElement, $redIcons) && in_array($basicElement, $purpleIcons)) ||
                       (in_array($basicElement, $yellowIcons) && in_array($basicElement, $blueIcons))) {
                       $foundPairs = $foundPairs + 1;
                   }
               }
               $result[$scoringCard->location] = $foundPairs;
            }
        }

        return $result;
    }
}
