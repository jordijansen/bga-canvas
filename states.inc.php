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
 * states.inc.php
 *
 * canvas game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!
require_once("modules/php/Constants.inc.php");

$basicGameStates = [

    // The initial state. Please do not modify.
    ST_GAME_SETUP_ID => [
        "name" => ST_GAME_SETUP,
        "description" => clienttranslate("Game setup"),
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => [ "" => ST_PLAYER_TURN_ID ]
    ],

    // Final state.
    // Please do not modify.
    ST_GAME_END_ID => [
        "name" => ST_GAME_END,
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd",
    ],
];

$playerActionsGameStates = [
    ST_PLAYER_TURN_ID => [
        "name" => ST_PLAYER_TURN,
        "description" => clienttranslate('${actplayer} must choose an action'),
        "descriptionmyturn" => clienttranslate('${you} must choose an action: '),
        "type" => "activeplayer",
        "args" => "argPlayerTurn",
        "possibleactions" => [
            ACT_CHOOSE_ACTION,
        ],
        "transitions" => [
            ACT_TAKE_ART_CARD => ST_TAKE_ART_CARD_ID,
            ACT_COMPLETE_PAINTING => ST_COMPLETE_PAINTING_ID
        ]
    ],
    ST_TAKE_ART_CARD_ID => [
        "name" => ST_TAKE_ART_CARD,
        "description" => clienttranslate('${actplayer} must Take an Art Card'),
        "descriptionmyturn" => clienttranslate('${you} must Take an Art Card'),
        "type" => "activeplayer",
        "args" => "argTakeArtCard",
        "possibleactions" => [
            ACT_TAKE_ART_CARD,
            ACT_CANCEL_ACTION
        ],
        "transitions" => [
            ACT_CANCEL_ACTION => ST_PLAYER_TURN_ID,
            ST_NEXT_PLAYER => ST_NEXT_PLAYER_ID
        ]
    ],
    ST_COMPLETE_PAINTING_ID => [
        "name" => ST_COMPLETE_PAINTING,
        "description" => clienttranslate('${actplayer} must Complete a Painting'),
        "descriptionmyturn" => clienttranslate('${you} must Complete a Painting'),
        "type" => "activeplayer",
        "args" => "argCompletePainting",
        "possibleactions" => [
            ACT_COMPLETE_PAINTING,
            ACT_CANCEL_ACTION
        ],
        "transitions" => [
            ACT_CANCEL_ACTION => ST_PLAYER_TURN_ID,
            ST_NEXT_PLAYER => ST_NEXT_PLAYER_ID
        ]
    ],
];

$gameGameStates = [
    ST_NEXT_PLAYER_ID => [
        "name" => ST_NEXT_PLAYER,
        "description" => "",
        "type" => "game",
        "action" => "stNextPlayer",
        "transitions" => [
            'nextPlayer' => ST_PLAYER_TURN_ID,
        ],
        "updateGameProgression" => true
    ],
];

$machinestates = $basicGameStates + $playerActionsGameStates + $gameGameStates;



