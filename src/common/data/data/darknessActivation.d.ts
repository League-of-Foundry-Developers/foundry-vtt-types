import { DocumentSchemaToData, FieldReturnType } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';

interface DarknessActivationSchema extends DocumentSchema {
  /**
   * The minimum darkness level for which activation occurs
   */
  min: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;

  /**
   * The maximum darkness level for which activation occurs
   */
  max: typeof fields.ALPHA_FIELD;
}

/**
 * An embedded data object which defines the darkness range during which some attribute is active
 */
export declare class DarknessActivation extends DocumentData<DarknessActivationSchema, BaseAmbientLight> {
  static defineSchema(): DarknessActivationSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface DarknessActivation extends DocumentSchemaToData<DarknessActivationSchema> {}
