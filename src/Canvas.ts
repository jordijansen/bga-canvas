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
const ANIMATION_MS = 800;
const TOOLTIP_DELAY = document.body.classList.contains('touch-device') ? 1500 : undefined;
const LOCAL_STORAGE_ZOOM_KEY = 'Canvas-zoom';
const CARD_WIDTH = 250;
const CARD_HEIGHT = 425;
const INSPIRATION_TOKEN_WIDTH = 60;
const INSPIRATION_TOKEN_HEIGHT = 52;
const RIBBON_TOKEN_WIDTH = 88;
const RIBBON_TOKEN_HEIGHT = 140;

class Canvas implements CanvasGame {

    instantaneousMode: boolean;
    notifqueue: {};
    inspirationTokenManager: InspirationTokenManager;
    artCardManager: ArtCardManager;
    backgroundCardManager: BackgroundCardManager;
    animationManager: AnimationManager;

    public gamedatas: CanvasGameData;
    private zoomManager: ZoomManager;
    private playerManager: PlayerManager;
    private paintingManager: PaintingManager;
    private scoringCardManager: ScoringCardManager;
    private ribbonManager: RibbonManager;

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
        this.animationManager = new AnimationManager(this, {duration: ANIMATION_MS});
        this.playerManager = new PlayerManager(this);
        this.artCardManager = new ArtCardManager(this);
        this.backgroundCardManager = new BackgroundCardManager(this);
        this.scoringCardManager = new ScoringCardManager(this);
        this.inspirationTokenManager = new InspirationTokenManager(this);
        this.paintingManager = new PaintingManager(this);
        this.ribbonManager = new RibbonManager(this);

        this.scoringCardManager.setUp(gamedatas);
        this.playerManager.setUp(gamedatas);
        this.backgroundCardManager.setUp(gamedatas);
        this.artCardManager.setUp(gamedatas);
        this.inspirationTokenManager.setUp(gamedatas);
        this.paintingManager.setUp(gamedatas);
        this.ribbonManager.setUp(gamedatas);

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
            case 'completePainting':
                this.onEnteringCompletePainting(args.args);
                break;
        }
    }

    private onEnteringTakeArtCard(args: TakeArtCardArgs) {
        if ((this as any).isCurrentPlayerActive()) {
            this.artCardManager.enterDisplaySelectMode(args.availableCards);
        }
    }

    private onEnteringCompletePainting(args: CompletePaintingArgs) {
        if ((this as any).isCurrentPlayerActive()) {
            if (!this.paintingManager.isCompletePaintingMode) {
                this.toggleCompletePaintingTool();
            }
        }
    }


    public onLeavingState(stateName: string) {
        log( 'Leaving state: '+stateName );

        switch (stateName) {
            case 'takeArtCard':
                this.onLeavingTakeArtCard();
                break;
            case 'completePainting':
                this.onLeavingCompletePainting();
                break;
        }
    }

    private onLeavingTakeArtCard() {
        if ((this as any).isCurrentPlayerActive()) {
            this.artCardManager.exitDisplaySelectMode();
            this.paintingManager.exitCompletePaintingMode();
        }
    }

    private onLeavingCompletePainting() {
        if ((this as any).isCurrentPlayerActive()) {
            this.paintingManager.exitCompletePaintingMode();
        }
    }

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    public onUpdateActionButtons(stateName: string, args: any) {

        if ((this as any).isCurrentPlayerActive() && !this.isReadOnly()) {
            switch (stateName) {
                case 'playerTurn':
                    if (args.availableActions.includes('takeArtCard')) {
                        (this as any).addActionButton('chooseActionTakeArtCard', _("Take an Art Card"), () => this.chooseAction('takeArtCard'));
                    }
                    if (args.availableActions.includes('completePainting')) {
                        (this as any).addActionButton('chooseActionCompletePainting', _("Complete Painting"), () => this.chooseAction('completePainting'));
                    }
                    break;
                case 'takeArtCard':
                    (this as any).addActionButton('confirmTakeArtCard', _("Confirm"), () => this.confirmTakeArtCard());
                    if (args.availableActions.length > 1) {
                        (this as any).addActionButton('cancelAction', _("Cancel"), () => this.cancelAction(), null, null, 'gray');
                    }
                    break;
                case 'completePainting':
                    (this as any).addActionButton('confirmCompletePainting', _("Confirm"), () => this.confirmCompletePainting());
                    if (args.availableActions.length > 1) {
                        (this as any).addActionButton('cancelAction', _("Cancel"), () => this.cancelAction(), null, null, 'gray');
                    }
                    break;
            }

            if ([].includes(stateName) && args.canCancelMoves) {
                (this as any).addActionButton('undoLastMoves', _("Undo last moves"), () => this.undoLastMoves(), null, null, 'gray');
            }
        }

        if (!this.isReadOnly() && !((this as any).isCurrentPlayerActive() && stateName == 'completePainting')) {
            (this as any).addActionButton('toggleCompletePaintingTool', _("Show/Hide Complete Painting Tool"), () => this.toggleCompletePaintingTool(), null, null, 'gray');
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

    private confirmCompletePainting() {
        this.paintingManager.confirmPainting();
    }

    private undoLastMoves() {
        this.takeAction('undoLastMoves');
    }

    private toggleCompletePaintingTool() {
        if (this.paintingManager.isCompletePaintingMode) {
            this.paintingManager.exitCompletePaintingMode();
        } else {
            this.paintingManager.enterCompletePaintingMode(this.backgroundCardManager.getPlayerCards(this.getPlayerId()), this.artCardManager.getPlayerCards(this.getPlayerId()));
        }
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

    public takeAction(action: string, data?: any, onComplete: () => void = () => {}) {
        data = data || {};
        data.lock = true;
        (this as any).ajaxcall(`/canvas/canvas/${action}.html`, data, this, onComplete);
    }
    public takeNoLockAction(action: string, data?: any, onComplete: () => void = () => {}) {
        data = data || {};
        (this as any).ajaxcall(`/canvas/canvas/${action}.html`, data, this, onComplete);
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
            ['paintingScored', 1],
            ['paintingCompleted', undefined]
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
        this.artCardManager.exitDisplaySelectMode();
        return this.inspirationTokenManager.placeOnCards(args.inspirationTokensPlaced, args.playerId)
            .then(() => this.inspirationTokenManager.moveToPlayer(args.playerId, args.inspirationTokensTaken))
            .then(() => this.artCardManager.takeCard(args.playerId, args.cardTaken));
    }

    notif_displayRefilled(args: NotifDisplayRefilled) {
        return this.artCardManager.updateDisplayCards(args.displayCards);
    }

    notif_paintingScored(args: NotifPaintingScored) {
        this.paintingManager.updatePreviewScore(args)
    }

    notif_paintingCompleted(args: NotifPaintingCompleted) {
        this.paintingManager.exitCompletePaintingMode();
        this.paintingManager.enterHighlightPaintingMode(this.getPlayer(args.playerId));

        return this.paintingManager.createPainting(args.painting, true)
            .then(() => this.ribbonManager.updateRibbonCounters(args.playerId, args.painting, args.paintingRibbons))
            .then(() => this.paintingManager.exitHighlightPaintingMode())
            .then(() => this.animationManager.play( new BgaAttachWithAnimation({
                     animation: new BgaSlideAnimation({ element: $(`player-finished-painting-${args.painting.id}`), transitionTimingFunction: 'ease-out' }),
                     attachElement: document.getElementById(`player-finished-paintings-${args.playerId}`)
                 })))
            .then(() => {
                this.paintingManager.addPaintingToPngButton(args.painting, `player-finished-painting-${args.painting.id}`);
                this.setScore(args.playerId, args.playerScore);
            })
    }


    public format_string_recursive(log: string, args: any) {
        try {
            if (log && args && !args.processed) {
                Object.keys(args).forEach(argKey => {
                    if (argKey.startsWith('ribbonIcons')) {
                        const ribbons = [];
                        Object.keys(args[argKey]).forEach(key => {
                            for (let i = 0; i < args[argKey][key]; i++) {
                                ribbons.push(this.getRibbonIcon(key));
                            }
                        })
                        args[argKey] = ribbons.join('');
                    } else if (argKey.startsWith('inspiration_tokens') && typeof args[argKey] == 'number') {
                        args[argKey] = this.getInspirationTokenIcon(args[argKey]);
                    }
                })
            }
        } catch (e) {
            console.error(log, args, "Exception thrown", e.stack);
        }
        return (this as any).inherited(arguments);
    }

    private getRibbonIcon(type: string) {
        return `<span class="canvas-ribbon small" data-type="${type}" style="margin: 0 2px"></span>`
    }

    private getInspirationTokenIcon(number: number) {
        return `${number}<span class="canvas-inspiration-token-2d" style="margin-left: 4px; margin-right: 2px;"></span>`
    }
}