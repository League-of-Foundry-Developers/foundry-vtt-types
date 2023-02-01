import { ConfiguredDocumentClass, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { ForeignDocumentField } from "../fields.mjs";

interface FogExplorationDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  scene: ForeignDocumentField<{ type: typeof documents.BaseScene }>;
  user: ForeignDocumentField<{ type: typeof documents.BaseUser }>;
  explored: DocumentField<string> & {
    type: typeof String;
    required: true;
    nullable: true;
    default: null;
    validate: (data: string) => boolean;
    validationError: "The provided FogExploration explored image is not a valid base64 image string";
  };
  positions: fields.ObjectField;
  timestamp: FieldReturnType<fields.TimestampField, { required: true }>;
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

  /**
   * The timestamp at which this fog exploration was last updated
   * @defaultValue `Date.now()`
   */
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
  scene?: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>> | string | null | undefined;

  /**
   * The _id of the User document to which this fog applies
   * @defaultValue `null`
   */
  user?: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseUser>> | string | null | undefined;

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

  /**
   * The timestamp at which this fog exploration was last updated
   * @defaultValue `Date.now()`
   */
  timestamp?: number | null | undefined;
}

type FogExplorationDataSource = PropertiesToSource<FogExplorationDataProperties>;

/**
 * The data schema for a FogExploration document.
 */
export class FogExplorationData extends DocumentData<
  FogExplorationDataSchema,
  FogExplorationDataProperties,
  FogExplorationDataSource,
  FogExplorationDataConstructorData
> {
  static override defineSchema(): FogExplorationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FogExplorationData extends FogExplorationDataProperties {}
