<?php

use objects\Painting;

class PaintingManager  extends APP_DbObject {

    private Canvas $game;

    public function __construct(Canvas $game) {
        $this->game = $game;
    }

    public function createPainting($backgroundCardId, $playerId) {
        $this->DbQuery("INSERT INTO painting (id, player_id) VALUES (".$backgroundCardId.", ". $playerId .")");
    }

    public function countAllPaintings(): int
    {
        return $this->getUniqueValueFromDB("SELECT COUNT(1) FROM painting");
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
