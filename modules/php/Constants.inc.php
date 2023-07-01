<?php

const DISPLAY_CARD_SIZE = 5;
const NR_OF_BACKGROUND_CARDS_PER_PLAYER = 3;
const NR_OF_PAINTINGS_PER_PLAYER = 3;
const NR_OF_INSPIRATION_TOKENS_PER_PLAYER = 4;

const SCORING_RED = 'red';
const SCORING_GREEN = 'green';
const SCORING_BLUE = 'blue';
const SCORING_PURPLE = 'purple';
const SCORING_GREY = 'grey';

/**
 * Options
 */
const SCORING_CARDS_OPTION_ID = 100;
const SCORING_CARDS_OPTION = 'scoring_cards_option';
const SCORING_CARDS_STANDARD = 1;
const SCORING_CARDS_SIMPLIFIED_FAMILY_GAME = 10;
const SCORING_CARDS_SIMPLIFIED_CHILL_MODE = 11;
const SCORING_CARDS_SIMPLIFIED_SYNERGY = 12;
const SCORING_CARDS_STANDARD_FIRST_TIME_PLAYING = 20;
const SCORING_CARDS_STANDARD_BALANCED = 21;
const SCORING_CARDS_STANDARD_NO_ELEMENTS = 22;
const SCORING_CARDS_COMPLEX_ALL_ELEMENTS = 30;
const SCORING_CARDS_COMPLEX_SPATIAL = 31;
const SCORING_CARDS_COMPLEX_BONUS = 32;

const PAINTING_WITH_VINCENT_OPTION_ID = 110;
const PAINTING_WITH_VINCENT_OPTION = 'painting_with_vincent';
const PAINTING_WITH_VINCENT_EXCLUDED = 0;
const PAINTING_WITH_VINCENT_INCLUDED = 1;

const SOLO_MODE_DIFFICULTY_ID = 120;
const SOLO_MODE_DIFFICULTY = 'solo_mode_difficulty';
const SOLO_MODE_EASY = 25;
const SOLO_MODE_NORMAL = 30;
const SOLO_MODE_HARD = 35;
const SOLO_MODE_MASTER = 40;


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
const ZONE_PLAYER_HAND = 'hand';
const ZONE_PAINTING = 'painting';
const ZONE_CARD = 'card';
const ZONE_PLAYER_HAND_VINCENT = -999999;

/**
 * Element Icons
 */
const HUE = 'HUE';
const SHAPE = 'SHAPE';
const TEXTURE = 'TEXTURE';
const TONE = 'TONE';
const BASIC_ELEMENTS = [HUE, SHAPE, TEXTURE, TONE];

const BONUS_HUE = 'BONUS_HUE';
const BONUS_SHAPE = 'BONUS_SHAPE';
const BONUS_TEXTURE = 'BONUS_TEXTURE';
const BONUS_TONE = 'BONUS_TONE';

const BONUS_ICONS = [BONUS_HUE, BONUS_SHAPE, BONUS_TEXTURE, BONUS_TONE];


/**
 * Global variables
 */


/**
 * Constants
 */
const CANCELLABLE_MOVES = 10;
