<?php

class RibbonManager extends APP_DbObject {

    public function __construct() {
    }

    public function setUp($players) {
        foreach( $players as $playerId => $player) {
            foreach ([SCORING_RED, SCORING_GREEN, SCORING_BLUE, SCORING_PURPLE, SCORING_GREY] as $index => $scoring) {
                $this->DbQuery("INSERT INTO ribbon (player_id, ribbon_type, number) VALUES (". $playerId .",'".$scoring."', 0)");
            }
        }
    }

    public function getRibbonsForPlayer($playerId) {
        $dbResults = $this->getCollectionFromDB("SELECT ribbon_type, number FROM ribbon WHERE player_id =".$playerId);
        return array_combine(array_keys($dbResults), array_map(fn($dbRibbon) => $dbRibbon['number'], array_values($dbResults)));
    }

    public function updateRibbons(int $playerId, array $paintingRibbons)
    {
        foreach ($paintingRibbons as $ribbonType => $number) {
            $this->DbQuery("UPDATE ribbon SET number = number + ".$number." WHERE player_id = ". $playerId ." AND ribbon_type = '".$ribbonType."'");
        }
    }
}
