const determineBoardWidth = () => {
    return 1000;
}


const determineMaxZoomLevel = (game: Canvas) => {
    const bodycoords = dojo.marginBox("zoom-overall");
    const contentWidth = bodycoords.w;
    const rowWidth = determineBoardWidth();

    return contentWidth / rowWidth;
}

const getZoomLevels = (maxZoomLevel: number) => {
    let zoomLevels = [];
    let increments = 0.05;
    if (maxZoomLevel > 1) {
        const maxZoomLevelsAbove1 = maxZoomLevel - 1;
        increments = (maxZoomLevelsAbove1 / 9)
        zoomLevels = [];
        for (let i = 1; i <= 9; i++) {
            zoomLevels.push((increments * i) + 1);
        }
    }
    for (let i = 1; i <= 9; i++) {
        zoomLevels.push(1 - (increments * i));
    }
    zoomLevels = [...zoomLevels, 1, maxZoomLevel];
    zoomLevels = zoomLevels.sort();
    zoomLevels = zoomLevels.filter(zoomLevel => (zoomLevel <= maxZoomLevel) && (zoomLevel > 0.3))
    return zoomLevels;
}

class AutoZoomManager extends ZoomManager {

    constructor(game: Canvas, elementId: string, localStorageKey: string) {
        const storedZoomLevel = localStorage.getItem(localStorageKey);
        const maxZoomLevel = determineMaxZoomLevel(game);
        if (storedZoomLevel && Number(storedZoomLevel) > maxZoomLevel) {
            localStorage.removeItem(localStorageKey);
        }

        const zoomLevels = getZoomLevels(determineMaxZoomLevel(game));
        console.log(zoomLevels);
        console.log(maxZoomLevel < 1 ? maxZoomLevel : 1);
        super({
            element: document.getElementById(elementId),
            smooth: false,
            zoomLevels: zoomLevels,
            defaultZoom: maxZoomLevel < 1 ? maxZoomLevel : 1,
            zoomControls: {
                color: 'white',
                position: 'top-right',

            }
        });
    }
}