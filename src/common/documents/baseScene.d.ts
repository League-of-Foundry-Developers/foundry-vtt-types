import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseAmbientLight } from './baseAmbientLight';
import { BaseAmbientSound } from './baseAmbientSound';
import { BaseDrawing } from './baseDrawing';
import { BaseMeasuredTemplate } from './baseMeasuredTemplate';
import { BaseNote } from './baseNote';
import { BaseTile } from './baseTile';
import { BaseToken } from './baseToken';
import { BaseWall } from './baseWall';

/**
 * The Scene document model.
 */
export declare class BaseScene extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Scene';
      collection: 'scenes';
      label: 'DOCUMENT.Scene';
      isPrimary: true;
      embedded: {
        AmbientLight: typeof BaseAmbientLight;
        AmbientSound: typeof BaseAmbientSound;
        Drawing: typeof BaseDrawing;
        MeasuredTemplate: typeof BaseMeasuredTemplate;
        Note: typeof BaseNote;
        Tile: typeof BaseTile;
        Token: typeof BaseToken;
        Wall: typeof BaseWall;
      };
    }
  >;
}
