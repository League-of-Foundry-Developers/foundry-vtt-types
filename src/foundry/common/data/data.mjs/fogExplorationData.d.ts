import DocumentData from '../../abstract/data.mjs';
import { ForeignDocumentField } from '../fields.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import { ConfiguredDocumentClass, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { isBase64Image } from '../validators.mjs';

interface FogExplorationDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  scene: ForeignDocumentField<{ type: typeof documents.BaseScene }>;
  user: ForeignDocumentField<{ type: typeof documents.BaseUser }>;
  explored: DocumentField<string> & {
    type: typeof String;
    required: true;
    nullable: true;
    default: null;
    validate: typeof isBase64Image;
    validationError: 'The provided FogExploration explored image is not a valid base64 image string';
  };
  positions: typeof fields.OBJECT_FIELD;
  timestamp: FieldReturnType<typeof fields.TIMESTAMP_FIELD, { required: true }>;
}

interface FogExplorationDataProperties {
  /**
   * The _id which uniquely identifies this FogExploration document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The _id of the Scene document to which this fog applies
   * @defaultValue `null`
   */
  scene: string | null;

  /**
   * The _id of the User document to which this fog applies
   * @defaultValue `null`
   */
  user: string | null;

  /**
   * The base64 png image of the explored fog polygon
   * @defaultValue `null`
   */
  explored: string | null;

  /**
   * The object of scene positions which have been explored at a certain vision radius
   * @defaultValue `{}`
   */
  positions: Record<string, { radius: number; limit: boolean }>;

  /** The timestamp at which this fog exploration was last updated */
  timestamp: number;
}

interface FogExplorationDataConstructorData {
  /**
   * The _id which uniquely identifies this FogExploration document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The _id of the Scene document to which this fog applies
   * @defaultValue `null`
   */
  scene?: string | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>> | null | undefined;

  /**
   * The _id of the User document to which this fog applies
   * @defaultValue `null`
   */
  user?: string | null | undefined;

  /**
   * The base64 png image of the explored fog polygon
   * @defaultValue `null`
   */
  explored?: string | null | undefined;

  /**
   * The object of scene positions which have been explored at a certain vision radius
   * @defaultValue `{}`
   */
  positions?: Record<string, { radius: number; limit: boolean }> | null | undefined;

  /** The timestamp at which this fog exploration was last updated */
  timestamp?: number | null | undefined;
}

/**
 * The data schema for a FogExploration document.
 */
export declare class FogExplorationData extends DocumentData<
  FogExplorationDataSchema,
  FogExplorationDataProperties,
  PropertiesToSource<FogExplorationDataProperties>,
  FogExplorationDataConstructorData
> {
  static defineSchema(): FogExplorationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface FogExplorationData extends FogExplorationDataProperties {}
