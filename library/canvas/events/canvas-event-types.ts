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
