<?php

use objects\Painting;

class PaintingManager extends APP_DbObject {

    private Canvas $game;

    public function __construct(Canvas $game) {
        $this->game = $game;
    }

    public function createPainting($backgroundCardId, $playerId, $paintingRibbons) {
        $this->DbQuery("INSERT INTO painting (id, player_id, red_ribbons, green_ribbons, blue_ribbons, purple_ribbons, grey_ribbons) 
                            VALUES (".$backgroundCardId.", ". $playerId .", " .$paintingRibbons['red'].", " .$paintingRibbons['green'].", " .$paintingRibbons['blue'].", " .$paintingRibbons['purple'].", " .$paintingRibbons['grey'] . ")");
    }

    public function countAllPaintings(): int
    {
        $totalPaintingCount = 0;
        foreach ($this->game->getPlayers() as $player) {
            if (intval($player['player_zombie']) == 1) {
                $totalPaintingCount = $totalPaintingCount + NR_OF_PAINTINGS_PER_PLAYER;
            } else {
                $totalPaintingCount = $totalPaintingCount + sizeof($this->getPaintings($player['player_id']));
            }
        }
        return $totalPaintingCount;
    }

    public function getPaintings($playerId): array
    {
        $paintings = $this->getCollectionFromDB("SELECT * FROM painting WHERE player_id = ".$playerId);
        return array_map(fn($dbPainting) => $this->toPainting($dbPainting), array_values($paintings));
    }

    public function getPainting($id): Painting
    {
        $paintings = $this->getCollectionFromDB("SELECT * FROM painting WHERE id = ".$id);
        return $this->toPainting(reset($paintings));
    }

    private function toPainting($dbPainting): Painting
    {
        $backgroundCards = $this->game->backgroundCardManager->getCardsInLocation(ZONE_PAINTING.'_'.$dbPainting['id']);
        $artCards = $this->game->artCardManager->getCardsInLocation(ZONE_PAINTING.'_'.$dbPainting['id']);
        return new Painting($dbPainting, reset($backgroundCards), $artCards);
    }

    public function getPaintingName($paintingId): array
    {
        $artCards = $this->game->artCardManager->getCardsInLocation(ZONE_PAINTING.'_'.$paintingId);
        $leftName = '';
        $rightName = '';
        foreach ($artCards as $artCard) {
            if ($artCard->namePosition == 'left') {
                $leftName = $artCard->name;
            }
            if ($artCard->namePosition == 'right') {
                $rightName = $artCard->name;
            }
        }
        return ['left' => $leftName, 'right' => $rightName];
    }
}
