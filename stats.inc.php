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
 * stats.inc.php
 *
 * canvas game statistics description
 *
 */

/*
    In this file, you are describing game statistics, that will be displayed at the end of the
    game.
    
    !! After modifying this file, you must use "Reload  statistics configuration" in BGA Studio backoffice
    ("Control Panel" / "Manage Game" / "Your Game")
    
    There are 2 types of statistics:
    _ table statistics, that are not associated to a specific player (ie: 1 value for each game).
    _ player statistics, that are associated to each players (ie: 1 value for each player in the game).

    Statistics types can be "int" for integer, "float" for floating point values, and "bool" for boolean
    
    Once you defined your statistics there, you can start using "initStat", "setStat" and "incStat" method
    in your game logic, using statistics names defined below.
    
    !! It is not a good idea to modify this file when a game is running !!

    If your game is already public on BGA, please read the following before any change:
    http://en.doc.boardgamearena.com/Post-release_phase#Changes_that_breaks_the_games_in_progress
    
    Notes:
    * Statistic index is the reference used in setStat/incStat/initStat PHP method
    * Statistic index must contains alphanumerical characters and no space. Example: 'turn_played'
    * Statistics IDs must be >=10
    * Two table statistics can't share the same ID, two player statistics can't share the same ID
    * A table statistic can have the same ID than a player statistics
    * Statistics ID is the reference used by BGA website. If you change the ID, you lost all historical statistic data. Do NOT re-use an ID of a deleted statistic
    * Statistic name is the English description of the statistic as shown to players
    
*/
require_once(__DIR__.'/modules/php/Constants.inc.php');

$stats_type = [

    // Statistics global to table
    "table" => [
        TABLE_NUMBER_OF_RIBBONS_PER_PAINTING => [
            "id"=> TABLE_NUMBER_OF_RIBBONS_PER_PAINTING_ID,
            "name" => totranslate("Ribbons per painting"),
            "type" => "float"
        ],
    ],

    // Statistics existing for each player
    "player" => [
        PLAYER_INSPIRATION_TOKENS => [
            "id"=> PLAYER_INSPIRATION_TOKENS_ID,
            "name" => totranslate("Inspiration tokens remaining"),
            "type" => "int"
        ],
        PLAYER_NUMBER_OF_RIBBONS_PER_PAINTING => [
            "id"=> PLAYER_NUMBER_OF_RIBBONS_PER_PAINTING_ID,
            "name" => totranslate("Ribbons per painting"),
            "type" => "float"
        ],
        PLAYER_RIBBONS_GREY => [
            "id"=> PLAYER_RIBBONS_GREY_ID,
            "name" => totranslate("Grey Ribbons"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_COMPOSITION => [
            "id"=> PLAYER_RIBBONS_COMPOSITION_ID,
            "name" => totranslate("Ribbons for Composition"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_CONSISTENCY => [
            "id"=> PLAYER_RIBBONS_CONSISTENCY_ID,
            "name" => totranslate("Ribbons for Consistency"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_EMPHASIS => [
            "id"=> PLAYER_RIBBONS_EMPHASIS_ID,
            "name" => totranslate("Ribbons for Emphasis"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_HIERARCHY => [
            "id"=> PLAYER_RIBBONS_HIERARCHY_ID,
            "name" => totranslate("Ribbons for Hierarchy"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_MOVEMENT => [
            "id"=> PLAYER_RIBBONS_MOVEMENT_ID,
            "name" => totranslate("Ribbons for Movement"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_PROXIMITY => [
            "id"=> PLAYER_RIBBONS_PROXIMITY_ID,
            "name" => totranslate("Ribbons for Proximity"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_PROPORTION => [
            "id"=> PLAYER_RIBBONS_PROPORTION_ID,
            "name" => totranslate("Ribbons for Proportion"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_REPETITION => [
            "id"=> PLAYER_RIBBONS_REPETITION_ID,
            "name" => totranslate("Ribbons for Repetition"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_SPACE => [
            "id"=> PLAYER_RIBBONS_SPACE_ID,
            "name" => totranslate("Ribbons for Space"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_STYLE => [
            "id"=> PLAYER_RIBBONS_STYLE_ID,
            "name" => totranslate("Ribbons for Style"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_SYMMETRY => [
            "id"=> PLAYER_RIBBONS_SYMMETRY_ID,
            "name" => totranslate("Ribbons for Symmetry"),
            "type" => "int"
        ],
        PLAYER_RIBBONS_VARIETY => [
            "id"=> PLAYER_RIBBONS_VARIETY_ID,
            "name" => totranslate("Ribbons for Variety"),
            "type" => "int"
        ],
    ]

];
