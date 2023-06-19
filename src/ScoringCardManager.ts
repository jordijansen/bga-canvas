class ScoringCardManager extends CardManager<Card> {

    private display: SlotStock<Card>

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-scoring-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-scoring-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.dataset.type = ''+card.type_arg;
            },
            setupBackDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-back`;
                div.dataset.type = ''+card.type_arg;
            },

            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        this.display = new SlotStock<Card>(this, $('scoring-card-display'), {
            mapCardToSlot: (card) => `scoring-card-display-slot-${card.location}`,

            slotClasses: ['scoring-card-display-slot'],
            slotsIds: ['scoring-card-display-slot-red', 'scoring-card-display-slot-green', 'scoring-card-display-slot-blue', 'scoring-card-display-slot-purple', 'scoring-card-display-slot-grey'],
        });

        this.display.onCardClick = (card) => this.flipCard(card);


        gameData.scoringCards.forEach(card => this.display.addCard(card))
    }
}