import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";

import fields = foundry.data.fields;

/**
 * A base DataModel class for VFX animation components that can be serialized and played back.
 * @template Schema - The schema type for this component's data
 */
declare class VFXComponent<Schema extends VFXComponent.Schema.Any = VFXComponent.Schema> extends DataModel<Schema> {
  /**
   * The type of this component. Must be overridden in the subclass.
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
   */
  get playing(): boolean;

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
   * @param object - The object to manage
   * @param group  - A canvas group that should contain the object
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
   */
  interface _Schema<Type extends string> extends DataSchema {
    type: fields.StringField<{ required: true; blank: false }, string, Type, string>;
  }

  interface Schema extends _Schema<string> {}

  namespace Schema {
    /** Any component schema — the base constraint used by `VFXComponent` and its subclasses. */
    type Any = _Schema<string>;
  }

  /**
   * The subset of the animejs Timeline surface used by the VFX framework.
   */
  interface Timeline {
    labels: Record<string, number>;
    began: boolean;
    completed: boolean;
    paused: boolean;
    label(name: string, position?: number | string): this;
    sync(timeline: Timeline, position?: number | string): this;
    add(target: object, params: object, position?: number | string): this;
    call(fn: () => void, position?: number | string): this;
    play(): this;
    pause(): this;
    complete(): this;
    cancel(): this;
    init(): this;
    then(onfulfilled?: () => void): Promise<unknown>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * A component-specific animation object with optional setup/teardown hooks.
   */
  interface Animation {
    setup?: ((state: object, params: object) => void) | undefined;
    animate: (t: number, state: object, params: object) => void;
    tearDown?: ((state: object, params: object) => void) | undefined;
  }
}

export default VFXComponent;

declare abstract class AnyVFXComponent extends VFXComponent {
  constructor(...args: never);
}
