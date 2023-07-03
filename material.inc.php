<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * canvas implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * canvas game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


require_once(__DIR__.'/modules/php/Constants.inc.php');
require_once(__DIR__.'/modules/php/framework/Card.php');

$this->ART_CARDS = [
    "BASE_GAME" => [
        1 => new ArtCardType('Precious', 'left', [SHAPE, TEXTURE], [BONUS_TONE], [], [], []),
        2 => new ArtCardType('Peaceful', 'left', [HUE], [HUE, TONE], [], [], []),
        3 => new ArtCardType('Heavy', 'left', [TONE], [SHAPE, TONE], [], [], []),
        4 => new ArtCardType('Fragile', 'left', [SHAPE], [HUE], [], [], []),
        5 => new ArtCardType('Chosen', 'left', [SHAPE, TEXTURE], [], [SHAPE], [], []),
        6 => new ArtCardType('Harmonious', 'left', [HUE], [], [TONE], [], []),
        7 => new ArtCardType('Melancholy', 'left', [SHAPE, TONE], [], [], [TONE], []),
        8 => new ArtCardType('Corrupted', 'left', [], [TONE], [SHAPE], [], []),
        9 => new ArtCardType('Nature', 'right', [], [HUE, SHAPE], [], [BONUS_TONE], []),
        10 => new ArtCardType('Beauty', 'right', [], [], [HUE], [SHAPE], []),
        11 => new ArtCardType('Bait', 'right', [], [], [SHAPE, TEXTURE], [], [TEXTURE]),

        12 => new ArtCardType('Heightened', 'left', [TONE], [SHAPE], [], [], []),
        13 => new ArtCardType('Liberated', 'left', [HUE, TEXTURE], [], [TEXTURE], [], []),
        14 => new ArtCardType('Unashamed', 'left', [TEXTURE], [BONUS_SHAPE], [], [], []),
        15 => new ArtCardType('Risky', 'left', [BONUS_TEXTURE], [], [SHAPE, TONE], [], []),
        16 => new ArtCardType('Sudden', 'left', [TONE], [], [TEXTURE], [], []),
        17 => new ArtCardType('Fading', 'left', [TEXTURE], [], [], [HUE], []),
        18 => new ArtCardType('Delicate', 'left', [HUE], [], [], [], [HUE, TEXTURE]),
        19 => new ArtCardType('Innocent', 'left', [], [HUE], [SHAPE], [], []),
        20 => new ArtCardType('Complexity', 'right', [], [TEXTURE], [], [SHAPE], []),
        21 => new ArtCardType('Surrender', 'right', [], [], [HUE], [TEXTURE], []),
        22 => new ArtCardType('Dreams', 'right', [], [], [TONE], [], [HUE]),

        23 => new ArtCardType('Impropable', 'left', [SHAPE], [], [HUE], [], []),
        24 => new ArtCardType('Deep', 'left', [HUE, SHAPE], [], [], [SHAPE], []),
        25 => new ArtCardType('Whimsical', 'left', [HUE], [], [], [TEXTURE], []),
        26 => new ArtCardType('Imminent', 'left', [TEXTURE], [], [], [SHAPE], []),
        27 => new ArtCardType('Forbidden', 'left', [BONUS_HUE], [], [], [TEXTURE, TONE], []),
        28 => new ArtCardType('Divine', 'left', [SHAPE, TONE], [], [], [], [SHAPE]),
        29 => new ArtCardType('Vast', 'left', [BONUS_SHAPE], [], [], [], [HUE, TONE]),
        30 => new ArtCardType('Expanse', 'right', [], [TONE], [], [TEXTURE, TONE], []),
        31 => new ArtCardType('Game', 'right', [], [SHAPE], [], [BONUS_TEXTURE], []),
        32 => new ArtCardType('Adventure', 'right', [], [], [BONUS_SHAPE], [TONE], []),
        33 => new ArtCardType('Perspective', 'right', [], [], [HUE, TONE], [], [TONE]),

        34 => new ArtCardType('Ominous', 'left', [TEXTURE], [], [], [], [TONE]),
        35 => new ArtCardType('Exploring', 'left', [TONE], [], [], [], [BONUS_HUE]),
        36 => new ArtCardType('Illuminated', 'left', [HUE], [], [], [], [TONE]),
        37 => new ArtCardType('Extreme', 'left', [], [SHAPE, TEXTURE], [BONUS_HUE], [], []),
        38 => new ArtCardType('Graceful', 'left', [], [TONE], [HUE, TONE], [], []),
        39 => new ArtCardType('Wandering', 'left', [], [TEXTURE, TONE], [TEXTURE], [], []),
        40 => new ArtCardType('Masked', 'left', [], [SHAPE], [SHAPE, TEXTURE], [], []),
        41 => new ArtCardType('Revolution', 'right', [], [HUE], [], [HUE, SHAPE], []),
        42 => new ArtCardType('Obstacle', 'right', [], [TEXTURE], [], [TONE], []),
        43 => new ArtCardType('Childhood', 'right', [], [], [TEXTURE, TONE], [], [TEXTURE]),
        44 => new ArtCardType('Nightmare', 'right', [], [], [BONUS_TONE], [], [SHAPE]),

        45 => new ArtCardType('Anxiety', 'right', [], [HUE, TEXTURE], [], [], [TEXTURE]),
        46 => new ArtCardType('View', 'right', [], [SHAPE], [], [], [SHAPE, TONE]),
        47 => new ArtCardType('Sanctuary', 'right', [], [HUE], [], [], [HUE, TEXTURE]),
        48 => new ArtCardType('Freedom', 'right', [], [TONE], [], [], [SHAPE]),
        49 => new ArtCardType('Darkness', 'right', [], [BONUS_TEXTURE], [], [], [HUE]),
        50 => new ArtCardType('Trap', 'right', [], [TEXTURE], [], [], [BONUS_SHAPE]),
        51 => new ArtCardType('Escape', 'right', [], [], [SHAPE, TEXTURE], [TEXTURE], []),
        52 => new ArtCardType('Curiosity', 'right', [], [], [BONUS_TEXTURE], [HUE, TONE], []),
        53 => new ArtCardType('Pride', 'right', [], [], [HUE, TONE], [HUE], []),
        54 => new ArtCardType('Attraction', 'right', [], [], [HUE], [], [HUE, SHAPE]),
        55 => new ArtCardType('Truth', 'right', [], [], [], [SHAPE, HUE], [SHAPE]),

        56 => new ArtCardType('Purpose', 'right', [], [], [], [TONE], [TEXTURE, TONE]),
        57 => new ArtCardType('Moment', 'right', [], [], [], [HUE, TEXTURE], [BONUS_TONE]),
        58 => new ArtCardType('Mess', 'right', [], [], [], [SHAPE], [TEXTURE]),
        59 => new ArtCardType('Mistake', 'right', [], [], [], [TEXTURE], [HUE]),
        60 => new ArtCardType('Warning', 'right', [], [], [], [BONUS_HUE], [TONE])
    ]
];

$this->SCORING_CARDS = [
    "BASE_GAME" => [
        1 =>  new ScoringCardType('COMPOSITION', [1 => 1, 2 => 3, 3 => 9], clienttranslate('Composition'), clienttranslate('')),
        2 =>  new ScoringCardType('CONSISTENCY', [1 => 3, 2 => 6, 3 => 10], clienttranslate('Consistency'), clienttranslate('')),
        3 =>  new ScoringCardType('EMPHASIS', [1 => 1, 2 => 4, 3 => 11], clienttranslate('Emphasis'), clienttranslate('')),
        4 =>  new ScoringCardType('HIERARCHY', [1 => 4, 2 => 9, 3 => 15], clienttranslate('Hierarchy'), clienttranslate('')),
        5 =>  new ScoringCardType('MOVEMENT', [1 => 3, 2 => 7, 3 => 12], clienttranslate('Movement'), clienttranslate('')),
        6 =>  new ScoringCardType('PROXIMITY', [1 => 2, 2 => 5, 3 => 8, 4 => 12], clienttranslate('Proximity'), clienttranslate('')),
        7 =>  new ScoringCardType('PROPORTION', [1 => 2, 2 => 5, 3 => 10], clienttranslate('Proportion'), clienttranslate('')),
        8 =>  new ScoringCardType('REPETITION', [1 => 3, 2 => 7, 3 => 11, 4 => 16], clienttranslate('Repetition'), clienttranslate('')),
        9 =>  new ScoringCardType('SPACE', [1 => 2, 2 => 4, 3 => 7, 4 => 11], clienttranslate('Space'), clienttranslate('')),
        10 => new ScoringCardType('STYLE', [1 => 4, 2 => 10, 3 => 18], clienttranslate('Style'), clienttranslate('')),
        11 => new ScoringCardType('SYMMETRY', [1 => 1, 2 => 3, 3 => 6, 4 => 11], clienttranslate('Symmetry'), clienttranslate('')),
        12 => new ScoringCardType('VARIETY', [1 => 4, 2 => 8, 3 => 13], clienttranslate('Variety'), clienttranslate('')),
    ]
];

// Note that SCORING_CARDS_STANDARD is not in here as that has its own way of scoring
$this->SOLO_MODE_SCENARIO_GOAL_SCORES = [
     SCORING_CARDS_SIMPLIFIED_FAMILY_GAME => 18,
     SCORING_CARDS_SIMPLIFIED_CHILL_MODE => 25,
     SCORING_CARDS_SIMPLIFIED_SYNERGY => 28,
     SCORING_CARDS_STANDARD_FIRST_TIME_PLAYING => 32,
     SCORING_CARDS_STANDARD_BALANCED => 33,
     SCORING_CARDS_STANDARD_NO_ELEMENTS => 35,
     SCORING_CARDS_COMPLEX_ALL_ELEMENTS => 36,
     SCORING_CARDS_COMPLEX_SPATIAL => 37,
     SCORING_CARDS_COMPLEX_BONUS => 40
];
