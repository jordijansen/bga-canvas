const determineMaxZoomLevel = () => {
    const bodycoords = dojo.marginBox("canvas-overall");
    const contentWidth = bodycoords.w;
    const rowWidth = BOARD_WIDTH;

    if (contentWidth >= rowWidth) {
        return 1;
    }
    return contentWidth / rowWidth;
}

const getZoomLevels = (maxZoomLevels: number) => {
    const increments = maxZoomLevels / 5;
    return [increments, increments * 2, increments * 3, increments * 4, maxZoomLevels]
}

class AutoZoomManager extends ZoomManager {

    constructor(elementId: string) {
        const zoomLevels = getZoomLevels(determineMaxZoomLevel());
        super({
            element: document.getElementById(elementId),
            smooth: true,
            zoomLevels: zoomLevels,
            defaultZoom: zoomLevels[zoomLevels.length - 1],
            zoomControls: {
                color: 'white',
            },
            onDimensionsChange: (zoom) => {
                if (this) {
                    const newMaxZoomLevel = determineMaxZoomLevel();
                    // @ts-ignore
                    const currentMaxZoomLevel = this.zoomLevels[this.zoomLevels.length -1];
                    if (newMaxZoomLevel != currentMaxZoomLevel) {
                        // @ts-ignore
                        this.zoomLevels = this.getZoomLevels(newMaxZoomLevel);
                        this.setZoom(newMaxZoomLevel)
                    }
                }
            },
        });
    }
}