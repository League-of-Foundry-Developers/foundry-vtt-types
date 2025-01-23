import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseScene extends Document<"Scene", BaseScene.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Scene
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseScene.ConstructorData, context?: Document.ConstructionContext<BaseScene.Parent>);

  override parent: BaseScene.Parent;

  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

  static " __fvtt_types_internal_document_name_static": "Scene";
}

export default BaseScene;

declare namespace BaseScene {
  export import Metadata = Scene.Metadata;
  export import Parent = Scene.Parent;
  export import Stored = Scene.Stored;
  export import Source = Scene.Source;
  export import PersistedData = Scene.PersistedData;
  export import CreateData = Scene.CreateData;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
  export import Schema = Scene.Schema;
  export import DatabaseOperation = Scene.DatabaseOperation;
}
