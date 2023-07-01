<?php

namespace objects;
class Painting
{
    public int $id;
    public int $playerId;

    public \Card $backgroundCard;
    public array $artCards;
    public array $ribbons;


    public function __construct($dbPainting, $backgroundCard, $artCards) {
        $this->id = intval($dbPainting['id']);
        $this->playerId = $dbPainting['player_id'];

        $this->backgroundCard = $backgroundCard;
        $this->artCards = $artCards;
        $this->ribbons = [];
        $this->ribbons['red'] = $dbPainting['red_ribbons'];
        $this->ribbons['green'] = $dbPainting['green_ribbons'];
        $this->ribbons['blue'] = $dbPainting['blue_ribbons'];
        $this->ribbons['purple'] = $dbPainting['purple_ribbons'];
        $this->ribbons['grey'] = $dbPainting['grey_ribbons'];
    }
}

?>