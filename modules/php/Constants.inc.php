<?php

const DISPLAY_CARD_SIZE = 5;
const NR_OF_BACKGROUND_CARDS_PER_PLAYER = 3;
const NR_OF_INSPIRATION_TOKENS_PER_PLAYER = 5;

const SCORING_RED = 'red';
const SCORING_GREEN = 'green';
const SCORING_BLUE = 'blue';
const SCORING_PURPLE = 'purple';
const SCORING_GREY = 'grey';

const TOKEN_INSPIRATION = 'INSPIRATION';
const TOKEN_RIBBON = 'RIBBON';

/**
 * State
 */
const ST_GAME_SETUP = 'gameSetup';
const ST_GAME_SETUP_ID = 1;

const ST_PLAYER_TURN = 'playerTurn';
const ST_PLAYER_TURN_ID = 20;

const ST_TAKE_ART_CARD = 'takeArtCard';
const ST_TAKE_ART_CARD_ID = 30;

const ST_COMPLETE_PAINTING = 'completePainting';
const ST_COMPLETE_PAINTING_ID = 40;

const ST_NEXT_PLAYER = 'nextPlayer';
const ST_NEXT_PLAYER_ID = 80;

const ST_GAME_END = 'gameEnd';
const ST_GAME_END_ID = 99;


/**
 * Actions
 */
const ACT_CHOOSE_ACTION = 'chooseAction';
const ACT_TAKE_ART_CARD = 'takeArtCard';
const ACT_COMPLETE_PAINTING = 'completePainting';
const ACT_CANCEL_ACTION = 'cancelAction';

/**
 * Card Zones
 */
const ZONE_DECK = 'deck';
const ZONE_DISPLAY = 'display';
const ZONE_DISCARD = 'discard';
const ZONE_PLAYER_HAND = 'hand';
const ZONE_CARD = 'card';

/**
 * Global variables
 */


/**
 * Constants
 */
const CANCELLABLE_MOVES = 10;
