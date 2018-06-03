import { iSize } from './iSize';
import { iColor } from './iColor';
import { iShadow } from './iShadow';
import { iVector } from './iVector';
import { iLine } from './iLine';

export interface iRectangle {
    vector: iVector;
    size: iSize;

    color?: iColor;
    outline?: iLine;
    shadow?: iShadow;
}
