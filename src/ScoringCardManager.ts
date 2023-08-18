class ScoringCardManager extends CardManager<ScoringCard> {

    private display: SlotStock<ScoringCard>

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-scoring-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-scoring-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: ScoringCard, div: HTMLElement) => this.setupFrontDiv(card, div),
            setupBackDiv: (card: ScoringCard, div: HTMLElement) => this.setupBackDiv(card, div),
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        this.display = new SlotStock<ScoringCard>(this, $('scoring-card-display'), {
            mapCardToSlot: (card) => `scoring-card-display-slot-${card.location}`,
            gap: '25px',
            center: false,
            slotClasses: ['scoring-card-display-slot'],
            slotsIds: ['scoring-card-display-slot-red', 'scoring-card-display-slot-green', 'scoring-card-display-slot-blue', 'scoring-card-display-slot-purple', 'scoring-card-display-slot-grey'],
        });

        this.display.onCardClick = (card) => this.flipCard(card);

        gameData.scoringCards.forEach(card => this.display.addCard(card).then(() => {
            (this.canvasGame as Canvas).setTooltip(this.getId(card), this.formatDescription(card.description))
        }))
    }

    public getCardForType(type) {
        return this.display.getCards().find(card => card.location === type);
    }

    private setupFrontDiv(card: ScoringCard, div: HTMLElement) {
        div.id = `${this.getId(card)}-front`;
        div.dataset.type = ''+card.type_arg;

        if (div.getElementsByClassName('scoring-card-title').length === 0) {
            const title = document.createElement('div');
            title.classList.add('scoring-card-title')

            const titleText = document.createTextNode(_(card.name));
            title.appendChild(titleText)

            div.appendChild(title);
        }
    }

    private setupBackDiv(card: ScoringCard, div: HTMLElement) {
        div.id = `${this.getId(card)}-back`;
        div.dataset.type = ''+card.type_arg;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';

        if (div.getElementsByClassName('scoring-card-clarifications').length === 0) {
            const clarifications = document.createElement('div');
            clarifications.classList.add('scoring-card-clarifications')
            const clarificationsText = document.createTextNode(_("Clarifications"));
            clarifications.appendChild(clarificationsText)
            div.appendChild(clarifications);

            const description = document.createElement('div');
            description.classList.add('scoring-card-description')
            description.innerHTML = this.formatDescription(card.description)
            div.appendChild(description);

            const examples = document.createElement('div');
            examples.classList.add('scoring-card-examples')
            const examplesText = document.createTextNode(_("Examples"));
            examples.appendChild(examplesText)
            div.appendChild(examples);
        }
    }

    private formatDescription(description) {
        //@ts-ignore
        return bga_format(_(description), {
            '_': (t) => `<span class="canvas-element-icon ${t}"></span>`
        });
    }
}