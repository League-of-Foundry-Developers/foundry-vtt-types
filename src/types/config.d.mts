export {};

declare global {
  /**
   * Some global variables (such as {@link game}) are only initialized after certain events have happened during the
   * initialization of Foundry VTT. For that reason, the correct types for these variables include the types for the
   * uninitialized state.
   *
   * While this is correct from a type checking perspective, it can be inconvenient to have to type guard these global
   * variables everywhere. Some users might prefer the convenience over the 100% correctness in type checking.
   *
   * For this reason, this interface provides a way for users to configure certain global variables to be typed more
   * leniently, i.e., as the types of their initialized state. This is done via declaration merging. To do so merge in
   * a property with the name of the event that should be assumed to have been run.
   *
   * The currently supported hooks are:
   * - init
   * - i18nReady
   * - setup
   * - ready
   *
   * You can also set the special key "none" to make the default behavior set the variable to `undefined` instead of a union.
   *
   * @example
   * ```typescript
   * declare global {
   *   interface AssumeHookRan {
   *     setup: never; // the type doesn't matter
   *   }
   * }
   *
   * const referenceToGame: Game = game; // ok! :)
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface AssumeHookRan {}

  /**
   * This interface is used to configure the used document classes at a type
   * level. Module and system authors should use declaration merging to provide
   * the types of their configured document classes. It is extremely important
   * that this is kept in sync with the configuration that actually happens at
   * runtime.
   *
   * @example
   * ```typescript
   * // myActor.ts
   * class MyActor extends Actor {}
   *
   * // entryPoint.ts
   * import { MyActor } from "./myActor"
   *
   * hooks.once("init", () => {
   *   CONFIG.Actor.documentClass = typeof MyActor;
   * });
   *
   * declare global {
   *   interface DocumentClassConfig {
   *     Actor: typeof MyActor
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface DocumentClassConfig {}

  /**
   * This interface is used to configure the used object classes at a type
   * level. Module and system authors should use declaration merging to provide
   * the types of their configured object classes. It is extremely important
   * that this is kept in sync with the configuration that actually happens at
   * runtime.
   *
   * @example
   * ```typescript
   * // myToken.ts
   * class MyToken extends Token {}
   *
   * // entryPoint.ts
   * import { MyToken } from "./myToken"
   *
   * Hooks.once("init", () => {
   *   CONFIG.Token.objectClass = MyToken;
   * });
   *
   * declare global {
   *   interface PlaceableObjectClassConfig {
   *     Token: typeof MyToken;
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface PlaceableObjectClassConfig {}

  /**
   * This interface together with {@link SourceConfig} is used to configure the
   * types of the `data`  and `data._source` properties of the
   * {@link foundry.documents.BaseActor} and {@link foundry.documents.BaseItem}
   * classes. System authors should use declaration merging to provide the types
   * that match their `template.json` file. It is also very important for these
   * types to stay in sync with the `template.json` file, otherwise unexpected
   * runtime errors might appear.
   *
   * @example
   * ```typescript
   * interface ArmorDataSourceData {
   *   armorValue: number;
   * }
   *
   * interface ArmorDataSource {
   *   type: "armor";
   *   data: ArmorDataSourceData;
   * }
   *
   * interface WeaponDataSourceData {
   *   damagePerHit: number;
   *   attackSpeed: number;
   * }
   *
   * interface WeaponDataSource {
   *   type: "weapon";
   *   data: WeaponDataSourceData;
   * }
   *
   * interface ArmorDataPropertiesData extends ArmorDataSourceData {
   *   weight: number;
   * }
   *
   * interface ArmorDataProperties {
   *   type: "armor";
   *   data: ArmorDataPropertiesData;
   * }
   *
   * interface WeaponDataPropertiesData extends WeaponDataSourceData {
   *   damage: number;
   * }
   *
   * interface WeaponDataProperties {
   *   type: "weapon";
   *   data: WeaponDataPropertiesData;
   * }
   *
   * type MyItemDataSource = ArmorDataSource | WeaponDataSource;
   * type MyItemDataProperties = ArmorDataProperties | WeaponDataProperties;
   *
   * declare global {
   *   interface DataConfig {
   *     Item: MyItemDataProperties;
   *   }
   *
   *   interface SourceConfig {
   *     Item: MyItemDataSource;
   *   }
   * }
   * const item = await Item.create({
   *   name: "Axe",
   *   type: "weapon",
   *   attackSpeed: 1,
   *   damage: 5
   * });
   *
   * if(item.data.type === "weapon") {
   *   const damage: number = item.data.data.damage;
   * }
   *
   * if(item.data._source.type === "armor") {
   *   const armorValue = item.data._source.data.armorValue;
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface DataConfig {}

  /**
   * Configure the return type of the `getData` method for AppV1 Applications.
   *
   * mode - The mode of the return type.
   * - if mode is "partial", the return type is a partial of the data object, and will allow for any Record\<string,unknown\> to be returned, regardless of the actual data object.
   * - if mode is "exact", the return type is the exact data object, and will not allow for any additional properties to be returned.
   * - if mode is "object", the return type is a generic object, and will allow for any object to be returned, regardless of the actual data object.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface GetDataConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface DataModelConfig {}

  /** @see {@link DataConfig} */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface SourceConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface FlagConfig {}

  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface WebRTCConfig {}

  /**
   * Injects extra data for modules from `game.module.get("module-id")`.
   * @see {@link RequiredModules} for removing the `undefined` type for required modules.
   *  @example
   * ```typescript
   * interface ModuleConfig {
   *   "module-id": {
   *     api: APIObject;
   *   };
   * }
   * const moduleApi: APIObject | undefined = game.module.get("module-id")?.api;
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface ModuleConfig {}

  /**
   * Removes `undefined` for modules listed as keys here from the return type of `game.module.get`.
   * Useful if a module is a required dependency.
   * @see {@link ModuleConfig} for adding useful properties to the returned modules, like APIs.
   * @example
   * ```typescript
   * interface RequiredModules {
   *   "module-id": true;
   * }
   * const module: Game.ModuleData<foundry.packages.ModuleData> = game.module.get("module-id");
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
  interface RequiredModules {}
}

type ValidDataModel = {
  [DocumentName in foundry.abstract.Document.SystemType]?: {
    // Recommended to be a TypeDataModel subclass but DataModel is also technically valid.
    [DocumentType in string]?: foundry.abstract.DataModel<any, any>;
  };
};

type MustBeValid<T extends ValidDataModel> = T;

type _TestValidDataModelConfig = MustBeValid<DataModelConfig>;
