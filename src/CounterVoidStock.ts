interface CounterVoidStockSettings {
    counter: any,
    targetElement: string,
    counterId: string,
    initialCounterValue?: number,
    setupWrapper?: (HTMLElement) => void
    setupIcon?: (HTMLElement) => void
    setupCounter?: (HTMLElement) => void
    setupStock?: (HTMLElement) => void
}
class CounterVoidStock<T> extends VoidStock<T> implements Counter{

    public counter: Numbers;

    constructor(protected game: Game,
                protected manager: CardManager<T>,
                protected setting: CounterVoidStockSettings) {
        super(manager, document.createElement("div"))
        const targetElement = document.getElementById(setting.targetElement);
        if (!targetElement) {
            console.warn('targetElement not found')
            return;
        }

        const wrapperElement = document.createElement("div");
        wrapperElement.classList.add("counter-void-stock-wrapper")
        if (setting.setupWrapper) {
            setting.setupWrapper(wrapperElement);
        }

        const iconElement = document.createElement("div");
        iconElement.classList.add("counter-void-stock-icon")
        if (setting.setupIcon) {
            setting.setupIcon(iconElement);
        }
        wrapperElement.appendChild(iconElement);

        const counterElement = document.createElement("div");
        counterElement.classList.add("counter-void-stock-counter")
        counterElement.id = setting.counterId;
        if (setting.setupCounter) {
            setting.setupCounter(counterElement);
        }
        wrapperElement.appendChild(counterElement);


        this.element.classList.add("counter-void-stock-stock")
        if (setting.setupStock) {
            setting.setupStock(this.element);
        }
        wrapperElement.appendChild(this.element);
        targetElement.appendChild(wrapperElement);

        this.counter = new Numbers(game);
        this.counter.addTarget(setting.counterId);
        this.counter.setValue(setting.initialCounterValue);
    }
    public create(nodeId: string) {}
    public getValue() {return this.counter.getValue()}
    public incValue (by: number) {this.counter.setValue(this.counter.getValue() + by)}
    public decValue (by: number) {this.counter.setValue(this.counter.getValue() - by)}
    public setValue (value: number) {this.counter.setValue(value)}
    public toValue(value: number) {this.counter.toValue(value)}
    public disable(){}
}