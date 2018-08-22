export enum MOUSE_STATE {
    MOVING = 'move',
    TLBR_CORNER_RESIZE = 'tlbr-corner-resize',
    TRBL_CORNER_RESIZE = 'trbl-corner-resize',
    HORIZONTAL_RESIZE = 'horizontal-resize',
    VERTICAL_RESIZE = 'vertical-resize',
    GRAB = 'grab',
    DEFAULT = 'default',
}

export enum MOUSE_EVENT_TYPE {
    MOVE = 'move',
    DOWN = 'down',
    UP = 'up',
    WHEEL = 'wheel',
    OUT = 'out'
}

export enum PAN_ZOOM_EVENT_TYPE {
    ZOOM = 'zoom',
    PAN = 'pan',
    RESET = 'reset'
}

export enum UI_EVENT_TYPE {
    DOWN = 'down',
    UP = 'up',
    HOVER = 'hover',
    MOVE = 'move',
    OUT = 'out',
    CLICK = 'click'
}

export enum EIGHTS {
    ONE = 0.125,
    TWO = 0.25,
    THREE = 0.375,
    FOUR = 0.50,
    FIVE = 0.625,
    SIX = 0.75,
    SEVEN = 0.875,
    EIGHT = 1.0
}

export enum QUARTERS {
    ONE = 0.25,
    TWO = 0.50,
    THREE = 0.75,
    FOUR = 1.0
}

export enum DIRECTION {
    NORTH = 'north',
    SOUTH = 'south',
    EAST = 'east',
    WEST = 'west'
}
