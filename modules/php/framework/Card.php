<?php

class CardType {
    public int $id;
    public string $location;
    public int $location_arg;
    public /*int|null*/ $type;
    public /*int|null*/ $type_arg;


    public function __construct(int $id, string $location, int $location_arg, /*string|null*/ $type, /*int|null*/ $type_arg)
    {
        $this->id = $id;
        $this->location = $location;
        $this->location_arg = $location_arg;
        $this->type = $type;
        $this->type_arg = $type_arg;
    }
}

class Card extends CardType {

    public function __construct($dbCard)
    {
        parent::__construct(
            $this->id = intval($dbCard['card_id'] ?? $dbCard['id']),
            $this->location = $dbCard['card_location'] ?? $dbCard['location'],
            $this->location_arg = intval($dbCard['card_location_arg'] ?? $dbCard['location_arg']),
            $this->type = array_key_exists('card_type', $dbCard) || array_key_exists('type', $dbCard) ? intval($dbCard['card_type'] ?? $dbCard['type']) : null,
            $this->type_arg = array_key_exists('card_type_arg', $dbCard) || array_key_exists('type_arg', $dbCard) ? intval($dbCard['card_type_arg'] ?? $dbCard['type_arg']) : null,
        );
    }
}