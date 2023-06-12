<?php

namespace objects;
class Painting
{
    public int $id;
    public int $playerId;

    public \Card $backgroundCard;
    public array $artCards;


    public function __construct($dbPainting, $backgroundCard, $artCards) {
        $this->id = intval($dbPainting['id']);
        $this->playerId = $dbPainting['player_id'];

        $this->backgroundCard = $backgroundCard;
        $this->artCards = $artCards;
    }
}

?>