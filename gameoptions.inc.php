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
 * gameoptions.inc.php
 *
 * canvas game options description
 * 
 * In this file, you can define your game options (= game variants).
 *   
 * Note: If your game has no variant, you don't have to modify this file.
 *
 * Note²: All options defined in this file should have a corresponding "game state labels"
 *        with the same ID (see "initGameStateLabels" in canvas.game.php)
 *
 * !! It is not a good idea to modify this file when a game is running !!
 *
 */
require_once(__DIR__.'/modules/php/Constants.inc.php');

$game_options = [

    SCORING_CARDS_OPTION_ID => [
        'name' => totranslate('Scoring Cards'),
        'values' => [
            SCORING_CARDS_STANDARD => [
                'name' => totranslate('Standard'),
                'description' => totranslate('Four random scoring cards will be used'),
                'nobeginner' => true,
                'default' => true,
            ],
            SCORING_CARDS_SIMPLIFIED_FAMILY_GAME => [
                'name' => totranslate('Simplified - Family Game'),
                'description' => totranslate('Ideal for families and new gamers, this very simple setup covers all the basics. Scoring Cards: Composition, Variety'),
            ],
            SCORING_CARDS_SIMPLIFIED_CHILL_MODE => [
                'name' => totranslate('Simplified - Chill Mode'),
                'description' => totranslate('For a simpler puzzle, play with any 3 Scoring Cards. Scoring Cards: Random, Random, Random'),
            ],
            SCORING_CARDS_SIMPLIFIED_SYNERGY => [
                'name' => totranslate('Simplified - Synergy'),
                'description' => totranslate('There is a lot of overlap in these scoring conditions, making it easier to get more Ribbons. Scoring Cards: Proximity, Space, Variety'),
            ],
            SCORING_CARDS_STANDARD_FIRST_TIME_PLAYING => [
                'name' => totranslate('Standard - First Time Playing'),
                'description' => totranslate('This set of cards is easy to teach and is a great introductory setup for new players. Scoring Cards: Composition, Emphasis, Repetition, Variety'),
                'firstgameonly' => true
            ],
            SCORING_CARDS_STANDARD_BALANCED => [
                'name' => totranslate('Standard - Balanced'),
                'description' => totranslate('Use 2 cards with Elements and 2 cards without Elements, like this setup, for a well-rounded puzzle experience. Scoring Cards: Consistency, Emphasis, Hierarchy, Proportion'),
            ],
            SCORING_CARDS_STANDARD_NO_ELEMENTS => [
                'name' => totranslate('Standard - No Elements'),
                'description' => totranslate('These cards do not require specific Elements, making all Art Cards more balanced in value. Scoring Cards: Composition, Consistency, Proportion, Symmetry'),
            ],
            SCORING_CARDS_COMPLEX_ALL_ELEMENTS => [
                'name' => totranslate('Complex - All Elements'),
                'description' => totranslate('These cards do not overlap their conditions. Expect a challenge to score multiple Ribbons. Scoring Cards: Emphasis, Hierarchy, Repetition, Style'),
            ],
            SCORING_CARDS_COMPLEX_SPATIAL => [
                'name' => totranslate('Complex - Spatial'),
                'description' => totranslate('This setup requires you to focus on the specific placement of Elements. Scoring Cards: Movement, Proximity, Space, Symmetry'),
            ],
            SCORING_CARDS_COMPLEX_BONUS => [
                'name' => totranslate('Complex - Bonus'),
                'description' => totranslate('Score big points if you can combine these scoring conditions with the right Bonus Icons. Scoring Cards: Hierarchy, Movement, Proportion, Style'),
            ]
        ]
    ],

    PAINTING_WITH_VINCENT_OPTION_ID => [
        'name' => totranslate('Painting with Vincent'),
        'values' => [
            PAINTING_WITH_VINCENT_EXCLUDED => [
                'default' => true,
                'name' => 'disabled',
            ],
            PAINTING_WITH_VINCENT_INCLUDED => [
                'name' => 'enabled',
                'description' => totranslate('In this variant, you play with a simulated, non-scoring player called Vincent. You can use this variant to increase the turnover of the available cards. Recommended for 2-player and solo tables, but can also be used in 3-player games'),
            ]
        ],
        'displaycondition' => [
            [
                'type' => 'minplayers',
                'value' => [2, 3]
            ]
        ]
    ],
];


