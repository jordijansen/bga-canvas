<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * canvas implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 *
 * canvas.action.php
 *
 * canvas main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/canvas/canvas/myAction.html", ...)
 *
 */


class action_canvas extends APP_GameAction
{
    // Constructor: please do not modify
    public function __default()
    {
        if (self::isArg('notifwindow')) {
            $this->view = "common_notifwindow";
            $this->viewArgs['table'] = self::getArg("table", AT_posint, true);
        } else {
            $this->view = "canvas_canvas";
            self::trace("Complete reinitialization of board game");
        }
    }

    public function chooseAction()
    {
        self::setAjaxMode();

        $action = self::getArg("chosenAction", AT_alphanum, true);
        $this->game->chooseAction($action);

        self::ajaxResponse();
    }

    public function takeArtCard()
    {
        self::setAjaxMode();

        $cardId = self::getArg("cardId", AT_posint, true);
        $this->game->takeArtCard($cardId);

        self::ajaxResponse();
    }

    public function cancelAction()
    {
        self::setAjaxMode();

        $this->game->cancelAction();

        self::ajaxResponse();
    }
}
  
