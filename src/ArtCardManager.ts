class ArtCardManager extends CardManager<Card> {

    private deck: Deck<Card>
    private display: SlotStock<Card>

    constructor(protected canvasGame: CanvasGame) {
        super(canvasGame, {
            getId: (card) => `canvas-art-card-${card.id}`,
            setupDiv: (card: Card, div: HTMLElement) => {
                div.classList.add('canvas-art-card');
                div.dataset.id = ''+card.id;
            },
            setupFrontDiv: (card: Card, div: HTMLElement) => {
                div.id = `${this.getId(card)}-front`;
                div.dataset.type = ''+card.type;
            },
            isCardVisible: (card: Card) => !!card.type,
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        })
    }

    public setUp(gameData: CanvasGameData) {
        this.deck = new Deck<Card>(this, $('art-card-deck'), {
            cardNumber: 60,
            topCard: {id: -1}
        });
        this.display = new SlotStock<Card>(this, $('art-card-display'), {
            mapCardToSlot: (card) => `art-card-display-slot-${card.location_arg}`,
            slotClasses: ['art-card-display-slot'],
            slotsIds: ['art-card-display-slot-1', 'art-card-display-slot-2', 'art-card-display-slot-3', 'art-card-display-slot-4', 'art-card-display-slot-5']
        });

        gameData.display.forEach(card => this.display.addCard(card))
    }
}