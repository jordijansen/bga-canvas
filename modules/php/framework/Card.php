<?php

class ArtCardType {
    public string $name;
    public string $namePosition;
    public array $redIcons;
    public array $yellowIcons;
    public array $greenIcons;
    public array $blueIcons;
    public array $purpleIcons;

    public function __construct(string $name, string $namePosition, array $redIcons, array $yellowIcons, array $greenIcons, array $blueIcons, array $purpleIcons)
    {
        $this->name = $name;
        $this->namePosition = $namePosition;
        $this->redIcons = $redIcons;
        $this->yellowIcons = $yellowIcons;
        $this->greenIcons = $greenIcons;
        $this->blueIcons = $blueIcons;
        $this->purpleIcons = $purpleIcons;
    }
}

class ArtCard extends ArtCardType {

    public int $id;
    public string $location;
    public int $location_arg;
    public string $type;
    public int $type_arg;

    public function __construct($dbCard, $ART_CARDS)
    {
        $this->id = intval($dbCard['card_id'] ?? $dbCard['id']);
        $this->location = $dbCard['card_location'] ?? $dbCard['location'];
        $this->location_arg = intval($dbCard['card_location_arg'] ?? $dbCard['location_arg']);
        $this->type = $dbCard['card_type'] ?? $dbCard['type'];
        $this->type_arg = intval($dbCard['card_type_arg'] ?? $dbCard['type_arg']);

        $cardType = $ART_CARDS[$this->type][$this->type_arg];
        $this->name = $cardType->name;
        $this->namePosition = $cardType->namePosition;
        $this->redIcons = $cardType->redIcons;
        $this->yellowIcons =$cardType->yellowIcons;
        $this->greenIcons = $cardType->greenIcons;
        $this->blueIcons = $cardType->blueIcons;
        $this->purpleIcons = $cardType->purpleIcons;
    }
}

class ScoringCardType {

    public string $type;
    public string $name;
    public string $description;
    public array $scoring;

    public function __construct(string $type, array $scoring, string $name, string $description)
    {
        $this->type = $type;
        $this->scoring = $scoring;
        $this->name = $name;
        $this->description = $description;
    }

}

class ScoringCard extends ScoringCardType {

    public int $id;
    public string $location;
    public int $location_arg;
    public string $type;
    public string $type_arg;

    public function __construct($dbCard, $SCORING_CARDS)
    {
        $this->id = intval($dbCard['card_id'] ?? $dbCard['id']);
        $this->location = $dbCard['card_location'] ?? $dbCard['location'];
        $this->location_arg = intval($dbCard['card_location_arg'] ?? $dbCard['location_arg']);
        $this->type = $dbCard['card_type'] ?? $dbCard['type'];
        $this->type_arg = $dbCard['card_type_arg'] ?? $dbCard['type_arg'];

        $cardType = $SCORING_CARDS[$this->type][$this->type_arg];
        $this->type = $cardType->type;
        $this->scoring = $cardType->scoring;
        $this->name = $cardType->name;
        $this->description = $cardType->description;
    }
}


class Card {

    public int $id;
    public string $location;
    public int $location_arg;
    public /*int|null*/ $type;
    public /*int|null*/ $type_arg;

    public function __construct($dbCard)
    {
        $this->id = intval($dbCard['card_id'] ?? $dbCard['id']);
        $this->location = $dbCard['card_location'] ?? $dbCard['location'];
        $this->location_arg = intval($dbCard['card_location_arg'] ?? $dbCard['location_arg']);
        $this->type = array_key_exists('card_type', $dbCard) || array_key_exists('type', $dbCard) ? intval($dbCard['card_type'] ?? $dbCard['type']) : null;
        $this->type_arg = array_key_exists('card_type_arg', $dbCard) || array_key_exists('type_arg', $dbCard) ? intval($dbCard['card_type_arg'] ?? $dbCard['type_arg']) : null;
    }
}

class Token {

    public int $id;
    public string $location;
    public int $location_arg;
    public /*int|null*/ $type;
    public /*int|null*/ $type_arg;
    public function __construct($dbCard)
    {
        $this->id = intval($dbCard['card_id'] ?? $dbCard['id']);
        $this->location = $dbCard['card_location'] ?? $dbCard['location'];
        $this->location_arg = intval($dbCard['card_location_arg'] ?? $dbCard['location_arg']);
        $this->type = array_key_exists('card_type', $dbCard) || array_key_exists('type', $dbCard) ? $dbCard['card_type'] ?? $dbCard['type'] : null;
        $this->type_arg = array_key_exists('card_type_arg', $dbCard) || array_key_exists('type_arg', $dbCard) ? $dbCard['card_type_arg'] ?? $dbCard['type_arg'] : null;
    }
}