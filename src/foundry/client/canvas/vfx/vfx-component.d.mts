import type { PIXI } from "#configuration";
import type { AnyMutableObject, Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type { Timeline as AnimeTimeline } from "animejs/timeline";

import fields = foundry.data.fields;

declare class VFXComponent<Schema extends VFXComponent.Schema.Any = VFXComponent.Schema> extends DataModel<Schema> {
  /**
   * The type of this component. Must be overridden in the subclass.
   * @defaultValue `""`
   */
  static TYPE: string;

  static override defineSchema(): VFXComponent.Schema;

  /**
   * A component-specific sub-timeline.
   */
  get timeline(): VFXComponent.Timeline;

  /**
   * Have the materials for this component been loaded?
   */
  get loaded(): boolean;

  /**
   * Is the animation for this component playing?
   * @remarks `undefined` before {@linkcode VFXComponent.draw | VFXComponent#draw} has created the timeline.
   */
  get playing(): boolean | undefined;

  /**
   * Asset paths required to be loaded for this component.
   */
  get assetPaths(): Set<string>;

  /**
   * A registry of display objects which are managed by this component.
   */
  get managedDisplayObjects(): Record<string, PIXI.DisplayObject[]>;

  /**
   * Adds a DisplayObject to the set of managed primary display objects.
   * Entries in this list will be added to the primary canvas container when the component is attached and
   * removed when the component is destroyed.
   * @param object - The object to manage
   * @param group  - A canvas group that should contain the object (default: `"primary"`)
   */
  addManagedDisplayObject<DisplayObject extends PIXI.DisplayObject>(
    object: DisplayObject,
    group?: string,
  ): DisplayObject;

  /**
   * Load this component.
   */
  load(): Promise<void>;

  /**
   * Perform subclass-specific loading steps to prepare assets for rendering.
   */
  protected _load(): Promise<void>;

  /**
   * Prepare the timeline and create display objects used by this component.
   * Components should override the _draw method to implement subclass-specific steps.
   */
  draw(): Promise<void>;

  /**
   * Perform subclass-specific drawing steps to configure the component timeline and create display objects.
   */
  protected _draw(): Promise<void>;

  /**
   * Attach display objects used by this component to the canvas containers that should render them.
   */
  attach(): void;

  /**
   * Perform subclass-specific attachment steps to customize how display objects are added to the canvas.
   */
  protected _attach(): void;

  /**
   * Stop playback of this component and destroy its contents.
   */
  stop(): Promise<void>;

  /**
   * Cancel playback of this component and destroy its contents.
   */
  cancel(): Promise<void>;

  /**
   * Perform subclass-specific steps to discontinue component playback.
   */
  protected _stop(): Promise<void>;

  /**
   * Perform subclass-specific teardown steps to destroy and dispose of component materials.
   */
  protected _destroy(): void;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<VFXComponent.Schema>;

  static override get schema(): fields.SchemaField<VFXComponent.Schema>;

  static override validateJoint(data: VFXComponent.SourceData): void;

  static override fromSource(source: VFXComponent.CreateData, context?: DataModel.FromSourceOptions): VFXComponent;

  static override fromJSON(json: string): VFXComponent;

  #VFXComponent: true;
}

declare namespace VFXComponent {
  interface Any extends AnyVFXComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXComponent> {}

  /**
   * The shape of a VFX component schema, generic over the component's `type` discriminant literal.
   * Subclasses extend `_Schema<"theirType">` so the initialized `type` narrows to that literal while
   * assignment/persisted stay `string` (keeping the field's method params variance-compatible with the base).
   * @internal
   */
  interface _Schema<Type extends string> extends DataSchema {
    type: fields.StringField<{ required: true; blank: false }, string, Type, string>;
  }

  interface Schema extends _Schema<string> {}

  namespace Schema {
    /** Any component schema — the base constraint used by `VFXComponent` and its subclasses. */
    type Any = _Schema<string>;
  }

  type Timeline = AnimeTimeline;

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Data extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * A component-specific animation object with optional setup/teardown hooks.
   */
  interface Animation {
    setup?: ((state: AnyMutableObject, params: AnyMutableObject) => void) | undefined;

    animate: (t: number, state: AnyMutableObject, params: AnyMutableObject) => void;

    tearDown?: ((state: AnyMutableObject, params: AnyMutableObject) => void) | undefined;
  }
}

export default VFXComponent;

declare abstract class AnyVFXComponent extends VFXComponent {
  constructor(...args: never);
}
