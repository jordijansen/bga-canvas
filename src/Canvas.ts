declare const define;
declare const ebg;
declare const $;
declare const dojo: Dojo;
declare const _;
declare const g_gamethemeurl;
declare const g_replayFrom;
declare const g_archive_mode;

const ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]

const BOARD_WIDTH = 2000;
const ANIMATION_MS = 500;
const TOOLTIP_DELAY = document.body.classList.contains('touch-device') ? 1500 : undefined;
const LOCAL_STORAGE_ZOOM_KEY = 'Canvas-zoom';
const CARD_WIDTH = 250;
const CARD_HEIGHT = 425;
const INSPIRATION_TOKEN_WIDTH = 60;
const INSPIRATION_TOKEN_HEIGHT = 52;

class Canvas implements CanvasGame {

    instantaneousMode: boolean;
    notifqueue: {};
    inspirationTokenManager: InspirationTokenManager;
    public gamedatas: CanvasGameData;
    private zoomManager: ZoomManager;
    private playerManager: PlayerManager;
    private artCardManager: ArtCardManager;
    private backgroundCardManager: BackgroundCardManager;
    private scoringCardManager: ScoringCardManager;

    constructor() {

    }

    /*
        setup:

        This method must set up the game user interface according to current game situation specified
        in parameters.

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)

        "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */

    public setup(gamedatas: CanvasGameData) {
        log( "Starting game setup" );
        log('gamedatas', gamedatas);

        this.zoomManager = new AutoZoomManager('canvas-table');
        this.playerManager = new PlayerManager(this);
        this.artCardManager = new ArtCardManager(this);
        this.backgroundCardManager = new BackgroundCardManager(this);
        this.scoringCardManager = new ScoringCardManager(this);
        this.inspirationTokenManager = new InspirationTokenManager(this);

        this.scoringCardManager.setUp(gamedatas);
        this.playerManager.setUp(gamedatas);
        this.backgroundCardManager.setUp(gamedatas);
        this.artCardManager.setUp(gamedatas);
        this.inspirationTokenManager.setUp(gamedatas);

        this.setupNotifications();
        log( "Ending game setup" );
    }

    ///////////////////////////////////////////////////
    //// Game & client states

    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    public onEnteringState(stateName: string, args: any) {
        log('Entering state: ' + stateName, args.args);

        switch (stateName) {
            case 'takeArtCard':
                this.onEnteringTakeArtCard(args.args);
                break;
        }
    }

    private onEnteringTakeArtCard(args: TakeArtCardArgs) {
        this.artCardManager.enterDisplaySelectMode(args.availableCards);
    }


    public onLeavingState(stateName: string) {
        log( 'Leaving state: '+stateName );

        switch (stateName) {
            case 'takeArtCard':
                this.onLeavingTakeArtCard();
                break;
        }
    }

    private onLeavingTakeArtCard() {
        this.artCardManager.exitDisplaySelectMode();
    }


    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    public onUpdateActionButtons(stateName: string, args: any) {

        if ((this as any).isCurrentPlayerActive() && !this.isReadOnly()) {
            switch (stateName) {
                case 'playerTurn':
                    (this as any).addActionButton('chooseActionTakeArtCard', _("Take an Art Card"), () => this.chooseAction('takeArtCard'));
                    (this as any).addActionButton('chooseActionCompletePainting', _("Complete Painting"), () => this.chooseAction('completePainting'));
                    break;
                case 'takeArtCard':
                    (this as any).addActionButton('confirmTakeArtCard', _("Confirm"), () => this.confirmTakeArtCard());
                    (this as any).addActionButton('undoLastMoves', _("Cancel"), () => this.cancelAction(), null, null, 'gray');
                    break;

            }

            if ([].includes(stateName) && args.canCancelMoves) {
                (this as any).addActionButton('undoLastMoves', _("Undo last moves"), () => this.undoLastMoves(), null, null, 'gray');
            }
        }
    }

    private chooseAction(chosenAction: string) {
        this.takeAction('chooseAction', {chosenAction})
    }

    private cancelAction() {
        this.takeAction('cancelAction', {})
    }

    private confirmTakeArtCard() {
        const cardId = this.artCardManager.getSelectedDisplayCardId();
        this.takeAction('takeArtCard', {cardId})

    }

    private undoLastMoves() {
        this.takeAction('undoLastMoves');
    }

    private wrapInConfirm(runnable: () => void) {
        if (this.isAskForConfirmation()) {
            (this as any).confirmationDialog(_("This action can not be undone. Are you sure?"), () => {
                runnable();
            });
        } else {
            runnable();
        }
    }

    ///////////////////////////////////////////////////
    //// Utility methods
    ///////////////////////////////////////////////////

    public isReadOnly() {
        return (this as any).isSpectator || typeof g_replayFrom != 'undefined' || g_archive_mode;
    }

    public getPlayerId(): number {
        return Number((this as any).player_id);
    }

    public getPlayer(playerId: number): CanvasPlayer {
        return Object.values(this.gamedatas.players).find(player => Number(player.id) == playerId);
    }

    public takeAction(action: string, data?: any) {
        data = data || {};
        data.lock = true;
        (this as any).ajaxcall(`/canvas/canvas/${action}.html`, data, this, () => {});
    }
    public takeNoLockAction(action: string, data?: any) {
        data = data || {};
        (this as any).ajaxcall(`/canvas/canvas/${action}.html`, data, this, () => {});
    }

    public setTooltip(id: string, html: string) {
        (this as any).addTooltipHtml(id, html, TOOLTIP_DELAY);
    }
    public setTooltipToClass(className: string, html: string) {
        (this as any).addTooltipHtmlToClass(className, html, TOOLTIP_DELAY);
    }

    private setScore(playerId: number, score: number) {
        (this as any).scoreCtrl[playerId]?.toValue(score);
    }

    private isAskForConfirmation() {
        return true; // For now always ask for confirmation, might make this a preference later on.
    }

    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications

    /*
        setupNotifications:

        In this method, you associate each of your game notifications with your local method to handle it.

        Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                your pylos.game.php file.

    */
    setupNotifications() {
        log( 'notifications subscriptions setup' );

        const notifs = [
            ['artCardTaken', undefined],
            ['displayRefilled', undefined],
        ];

        notifs.forEach((notif) => {
            dojo.subscribe(notif[0], this, notifDetails => {
                log(`notif_${notif[0]}`, notifDetails.args);

                const promise = this[`notif_${notif[0]}`](notifDetails.args);

                // tell the UI notification ends
                promise?.then(() => (this as any).notifqueue.onSynchronousNotificationEnd());
            });
            // make all notif as synchronous
            (this as any).notifqueue.setSynchronous(notif[0], notif[1]);
        });
    }

    notif_artCardTaken(args: NotifArtCardTaken) {
        return this.inspirationTokenManager.placeOnCards(args.inspirationTokensPlaced)
            .then(() => this.inspirationTokenManager.moveToPlayer(args.playerId, args.inspirationTokensTaken))
            .then(() => this.artCardManager.takeCard(args.playerId, args.cardTaken));
    }

    notif_displayRefilled(args: NotifDisplayRefilled) {
        return this.artCardManager.updateDisplayCards(args.displayCards);
    }


    public format_string_recursive(log: string, args: any) {
        try {
            if (log && args && !args.processed) {
                Object.keys(args).forEach(argKey => {
                    // TODO
                })
            }
        } catch (e) {
            console.error(log, args, "Exception thrown", e.stack);
        }
        return (this as any).inherited(arguments);
    }
}