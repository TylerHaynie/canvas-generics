export enum MOUSE_STATE {
    MOVING = 'move',
    TLBR_CORNER_RESIZE = 'tlbr_corner_resize',
    TRBL_CORNER_RESIZE = 'trbl_corner_resize',
    HORIZONTAL_RESIZE = 'horizontal_resize',
    VERTICAL_RESIZE = 'vertical_resize',
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

export enum KEYBOARD_EVENT_TYPE {
    KEY_DOWN = 'key_down',
    KEY_UP = 'key_up',
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

export enum ALIGNMENT {
    'START' = 'start',
    'END' = 'end',
    'LEFT' = 'left',
    'RIGHT' = 'right',
    'CENTER' = 'center'
}

export enum BASELINE {
    'TOP' = 'top',
    'HANGING' = 'hanging',
    'MIDDLE' = 'middle',
    'ALPHABETIC' = 'alphabetic',
    'IDEOGRAPHIC' = 'ideographic',
    'BOTTOM' = 'bottom'
}

export enum DIRECTION {
    'LTR' = 'ltr',
    'RTL' = 'rtl',
    'INHERIT' = 'inherit'
}

export enum FONT_STYLE {
    'NORMAL' = 'normal',
    'ITALIC' = 'italic',
    'OBLIQUE' = 'oblique'
}

export enum FONT_VARIANT {
    'NORMAL' = 'normal',
    'SMALL_CAPS' = 'small-caps',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit'
}

export enum FONT_WEIGHT {
    'NORMAL' = 'normal',
    'BOLD' = 'bold',
    'BOLDER' = 'bolder',
    'LIGHTER' = 'lighter',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit',
    '*100' = '100',
    '*200' = '200',
    '*300' = '300',
    '*400' = '400',
    '*500' = '500',
    '*600' = '600',
    '*700' = '700',
    '*800' = '800',
    '*900' = '900',
}

export enum FONT_SIZE {
    'MEDIUM' = 'medium',
    'XX_SMALL' = 'xx-small',
    'X_SMALL' = 'x-small',
    'SMALL' = 'small',
    'LARGE' = 'large',
    'X_LARGE' = 'x-large',
    'XX_LARGE' = 'xx-large',
    'SMALLER' = 'smaller',
    'LARGER' = 'larger',
    'LENGTH' = 'length',
    'PERCENT' = '%',
    'INITIAL' = 'initial',
    'INHERIT' = 'inherit',
}

export enum LENGTH_UNIT {
    'EM' = 'em',
    'EX' = 'ex',
    'PERCENT' = '%',
    'PX' = 'px',
    'CM' = 'cm',
    'MM' = 'mm',
    'IN' = 'in',
    'PT' = 'pt',
    'PC' = 'pc',
}
