import { iSize } from './iSize';
import { iColor } from './iColor';
import { iShadow } from './iShadow';
import { iPoint } from './iPoint';
import { iLine } from './iLine';

export interface iRectangle {
    point: iPoint;
    size: iSize;

    color?: iColor;
    outline?: iLine;
    shadow?: iShadow;
}
