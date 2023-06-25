<?php

class InspirationTokenManager {

    protected Canvas $game;
    protected Deck $cards;

    public function __construct(Canvas $game, Deck $deck) {
        $this->game = $game;
        $this->cards = $deck;
        $this->cards->init('inspiration_token');
    }

    public function setUp() {
        $cards = [];

        $cards[] = array('type'=> 'INSPIRATION_TOKEN', 'type_arg' => 'INSPIRATION_TOKEN', 'nbr' => 50);

        $this->cards->createCards($cards, 'deck');
    }

    public function distributeInitialInspirationTokens($players) {
        foreach( $players as $playerId => $player) {
            $this->cards->pickCardsForLocation(NR_OF_INSPIRATION_TOKENS_PER_PLAYER, ZONE_DECK, ZONE_PLAYER_HAND, $playerId);
        }

        if ($this->game->isPaintingWithVincent()) {
            $this->cards->pickCardsForLocation(NR_OF_INSPIRATION_TOKENS_PER_PLAYER, ZONE_DECK, ZONE_PLAYER_HAND, ZONE_PLAYER_HAND_VINCENT);
        }
    }

    public function getTokensInLocation(string $location, int $location_arg = null): array
    {
        $dbResults = $this->cards->getCardsInLocation($location, $location_arg, 'id');
        return array_map(fn($dbCard) => new Token($dbCard), array_values($dbResults));
    }

    public function placeInspirationTokenOnCard($playerId, $cardId) {
        $playerInspirationTokens = $this->getTokensInLocation(ZONE_PLAYER_HAND, $playerId);
        $playerInspirationTokensIds = array_column($playerInspirationTokens, 'id');
        $playerInspirationTokensId = reset($playerInspirationTokensIds);
        $this->cards->moveCard($playerInspirationTokensId, ZONE_CARD, $cardId);
        return new Token($this->cards->getCard($playerInspirationTokensId));
    }

    public function takeInspirationTokensFromCard($playerId, $cardId) {
        $cardInspirationTokens = $this->getTokensInLocation(ZONE_CARD, $cardId);
        $cardInspirationTokensIds = array_column($cardInspirationTokens, 'id');
        $this->cards->moveCards($cardInspirationTokensIds, ZONE_PLAYER_HAND, $playerId);
        return array_map(fn($dbCard) => new Token($dbCard), array_values($this->cards->getCards($cardInspirationTokensIds)));
    }
}
