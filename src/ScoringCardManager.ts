class ScoringCardManager extends CardManager<ScoringCard> {

    private display: SlotStock<ScoringCard>

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-scoring-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-scoring-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: ScoringCard, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.dataset.type = ''+card.type_arg;
            },
            setupBackDiv: (card: ScoringCard, div: HTMLElement) => {
                div.id = `${this.getId(card)}-back`;
                div.dataset.type = ''+card.type_arg;
            },

            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        this.display = new SlotStock<ScoringCard>(this, $('scoring-card-display'), {
            mapCardToSlot: (card) => `scoring-card-display-slot-${card.location}`,

            slotClasses: ['scoring-card-display-slot'],
            slotsIds: ['scoring-card-display-slot-red', 'scoring-card-display-slot-green', 'scoring-card-display-slot-blue', 'scoring-card-display-slot-purple', 'scoring-card-display-slot-grey'],
        });

        this.display.onCardClick = (card) => this.flipCard(card);

        gameData.scoringCards.forEach(card => this.display.addCard(card))
    }

    public getCardForType(type) {
        return this.display.getCards().find(card => card.location === type);
    }
}