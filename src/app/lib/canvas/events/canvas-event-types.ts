export enum MOUSE_STATE {
    MOVING = 'move',
    CORNER_RESIZE = 'corner-resize',
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
    LEAVE = 'leave',
    MOVE = 'move',
    OUT = 'out'
}
