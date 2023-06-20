<?php

class ScoringCardManager {

    private Canvas $game;
    protected Deck $cards;
    private $SCORING_CARDS;

    public function __construct(Canvas $game, Deck $deck, $SCORING_CARDS) {
        $this->game = $game;
        $this->cards = $deck;
        $this->cards->init('scoring_card');

        $this->SCORING_CARDS = $SCORING_CARDS;
    }

    public function setUp() {
        $cards = [];

        for ($i = 1; $i <= 12; $i++) {
            $cards[] = array('type'=> 'BASE_GAME', 'type_arg' => $i, 'nbr' => 1);
        }

        $this->cards->createCards($cards, ZONE_DECK);
        $this->cards->shuffle(ZONE_DECK);

    }

    public function drawScoringCards() {
        $scoringCards = $this->determineScoringCards();
        $scoringCardLocations = [SCORING_RED, SCORING_GREEN, SCORING_BLUE, SCORING_PURPLE];
        $allScoringCards = $this->getCardsInLocation(ZONE_DECK);

        foreach ($scoringCards as $index => $scoringCardType) {
            if ($scoringCardType == 'RANDOM') {
                $this->cards->pickCardsForLocation(1, ZONE_DECK, $scoringCardLocations[$index]);
            } else {
                foreach ($allScoringCards as $scoringCard) {
                    if ($scoringCard->name == $scoringCardType) {
                        $this->cards->moveCard($scoringCard->id, $scoringCardLocations[$index]);
                    }
                }
            }
        }
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

        $allIcons = [$redIcons, $yellowIcons, $greenIcons, $blueIcons, $purpleIcons];
        $allIconsFlat = [...$redIcons, ...$yellowIcons, ...$greenIcons, ...$blueIcons, ...$purpleIcons];
        $allBasicElements = array_filter($allIconsFlat, fn($arrayValue) => in_array($arrayValue, BASIC_ELEMENTS));
        $elementsByCount = array_count_values($allBasicElements);
        $result = [];
        foreach ($this->getAllScoringCards() as $scoringCard) {
            $result[$scoringCard->location] = 0;
            if ($scoringCard->name == 'COMPOSITION') {
                // Scores if each swatch has at least 1 icon
                $result[$scoringCard->location] = sizeof($redIcons) > 0 && sizeof($yellowIcons) > 0 && sizeof($greenIcons) > 0 && sizeof($blueIcons) > 0 && sizeof($purpleIcons) > 0 ? 1 : 0;
            } else if ($scoringCard->name == 'CONSISTENCY') {
                // Scores if the painting has exactly 6 elements
                $result[$scoringCard->location] = sizeof($allBasicElements) == 6 ? 1 : 0;
            } else if ($scoringCard->name == 'EMPHASIS') {
                // Scores if exactly 1 HUE element is visible
                $hueIcons = array_filter($allIconsFlat, fn($arrayValue) => $arrayValue == HUE);
                $result[$scoringCard->location] = sizeof($hueIcons) == 1 ? 1 : 0;
            } else if ($scoringCard->name == 'HIERARCHY') {
                // The number of tone elements should be bigger or equal to the count of all other basic elements
                if (in_array(TONE, $allBasicElements)) {
                    $toneCount = $elementsByCount[TONE];
                    $maxElementCount = max(array_values($elementsByCount));
                    $result[$scoringCard->location] = $maxElementCount <= $toneCount ? 1 : 0;
                }
            } else if ($scoringCard->name == 'MOVEMENT') {
                // Scores if there are 3 basic elements in adjacent swatches
                foreach (BASIC_ELEMENTS as $basicElement) {
                    $elementsInARowCount = 0;
                    foreach ($allIcons as $swatch) {
                        $elementsInARowCount = in_array($basicElement, $swatch) ? $elementsInARowCount + 1 : 0;

                        if ($elementsInARowCount == 3) {
                            $result[$scoringCard->location] = $result[$scoringCard->location] + 1;
                            break;
                        }
                    }
                }
            } else if ($scoringCard->name == 'PROXIMITY') {
                // Scores for each set of TEXTURE and TONE elements in adjacent swatches.
                $foundTexture = false;
                $foundTone = false;
                foreach ($allIcons as $swatch) {
                    if (in_array(TEXTURE, $swatch) && $foundTone) {
                        $result[$scoringCard->location] = $result[$scoringCard->location] + 1;
                    }
                    if (in_array(TONE, $swatch) && $foundTexture) {
                        $result[$scoringCard->location] = $result[$scoringCard->location] + 1;
                    }

                    $foundTexture = in_array(TEXTURE, $swatch);
                    $foundTone = in_array(TONE, $swatch);
                }
            } else if ($scoringCard->name == 'PROPORTION') {
                // Score sets of at least 3 of the same icons and 2 of the same icon. Can be 5 of the same icon as well.
                $elementsWith5OrMoreCount = sizeof(array_filter($elementsByCount, fn($arrayValue) => $arrayValue >= 5));
                $elementsWith3Or4Count = sizeof(array_filter($elementsByCount, fn($arrayValue) => $arrayValue == 3 || $arrayValue == 4));
                $elementsWith2Count = sizeof(array_filter($elementsByCount, fn($arrayValue) => $arrayValue == 2));

                $result[$scoringCard->location] = $result[$scoringCard->location] + $elementsWith5OrMoreCount;
                if ($elementsWith3Or4Count == 1 && $elementsWith2Count == 1) {
                    $result[$scoringCard->location] = $result[$scoringCard->location] + 1;
                } else if ($elementsWith3Or4Count >= 2) {
                    if ($elementsWith2Count == 0) {
                        $result[$scoringCard->location] = $result[$scoringCard->location] + floor($elementsWith3Or4Count / 2);
                    } else {
                        $elementsWith3Or4CountRemaining = $elementsWith3Or4Count - $elementsWith2Count;
                        $result[$scoringCard->location] = $result[$scoringCard->location] + $elementsWith2Count;
                        $result[$scoringCard->location] = $result[$scoringCard->location] + floor($elementsWith3Or4CountRemaining / 2);
                    }
                }
            }  else if ($scoringCard->name == 'REPETITION') {
                // Scores for each pair of shapes
                $shapeIcons = array_filter($allIconsFlat, fn($arrayValue) => $arrayValue == SHAPE);
                $result[$scoringCard->location] = floor(sizeof($shapeIcons) / 2);
            } else if ($scoringCard->name == 'SPACE') {
                foreach ($allIcons as $index => $swatch) {
                    $foundHue[$index] = in_array(HUE, $swatch);
                    $foundShape[$index] = in_array(SHAPE, $swatch);
                }

                $usedShapeIndexes = [];
                foreach ($foundHue as $i => $hueFound) {
                    if ($hueFound) {
                        foreach ($foundShape as $x => $shapeFound) {
                            if ($shapeFound && $x != $i && !in_array($x, $usedShapeIndexes) && $x != ($i - 1) && $x != ($i + 1)) {
                                $usedShapeIndexes[] = $x;
                                $result[$scoringCard->location] = $result[$scoringCard->location] + 1;
                                break;
                            }
                        }
                    }
                }
            } else if ($scoringCard->name == 'STYLE') {
                $textureIcons = array_filter($allIconsFlat, fn($arrayValue) => $arrayValue == TEXTURE);
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
            } else if ($scoringCard->name == 'VARIETY') {
                if (in_array(TEXTURE, $allBasicElements) && in_array(HUE, $allBasicElements) && in_array(TONE, $allBasicElements) && in_array(SHAPE, $allBasicElements))
                {
                    $result[$scoringCard->location] = min(array_values($elementsByCount));
                }
            }
        }

        $allBonusIcons = array_filter($allIconsFlat, fn($arrayValue) => in_array($arrayValue, BONUS_ICONS));
        $result[SCORING_GREY] = 0;
        foreach ($allBonusIcons as $bonusIcon) {
            switch ($bonusIcon) {
                case BONUS_HUE:
                    $result[SCORING_GREY] = $result[SCORING_GREY] + $elementsByCount[HUE];
                    break;
                case BONUS_SHAPE:
                    $result[SCORING_GREY] = $result[SCORING_GREY] + $elementsByCount[SHAPE];
                    break;
                case BONUS_TEXTURE:
                    $result[SCORING_GREY] = $result[SCORING_GREY] + $elementsByCount[TEXTURE];
                    break;
                case BONUS_TONE:
                    $result[SCORING_GREY] = $result[SCORING_GREY] + $elementsByCount[TONE];
                    break;
            }
        }


        return $result;
    }

    private function determineScoringCards() {
        switch ($this->game->getGameStateValue(SCORING_CARDS_OPTION)) {
            case SCORING_CARDS_STANDARD:
                return ['RANDOM', 'RANDOM', 'RANDOM', 'RANDOM'];
            case SCORING_CARDS_SIMPLIFIED_FAMILY_GAME:
                return ['COMPOSITION', 'VARIETY'];
            case SCORING_CARDS_SIMPLIFIED_CHILL_MODE:
                return ['RANDOM', 'RANDOM', 'RANDOM'];
            case SCORING_CARDS_SIMPLIFIED_SYNERGY:
                return ['PROXIMITY', 'SPACE', 'VARIETY'];
            case SCORING_CARDS_STANDARD_FIRST_TIME_PLAYING:
                return ['COMPOSITION', 'EMPHASIS', 'REPETITION', 'VARIETY'];
            case SCORING_CARDS_STANDARD_BALANCED:
                return ['CONSISTENCY', 'EMPHASIS', 'HIERARCHY', 'PROPORTION'];
            case SCORING_CARDS_STANDARD_NO_ELEMENTS:
                return ['COMPOSITION', 'CONSISTENCY', 'PROPORTION', 'SYMMETRY'];
            case SCORING_CARDS_COMPLEX_ALL_ELEMENTS:
                return ['EMPHASIS', 'HIERARCHY', 'REPETITION', 'STYLE'];
            case SCORING_CARDS_COMPLEX_SPATIAL:
                return ['MOVEMENT', 'PROXIMITY', 'SPACE', 'SYMMETRY'];
            case SCORING_CARDS_COMPLEX_BONUS:
                return ['HIERARCHY', 'MOVEMENT', 'PROPORTION', 'STYLE'];
        }
    }
}
