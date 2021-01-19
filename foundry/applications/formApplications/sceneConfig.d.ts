/**
 * A Scene configuration sheet
 * @extends {BaseEntitySheet}
 * @see {@link Scene} The Scene Entity which is being configured
 */
declare class SceneConfig extends BaseEntitySheet {
	/**
	* Get an enumeration of the available grid types which can be applied to this Scene
	*/
	private static _getGridTypes(): Record<string, string>
	/**
	* Get the available weather effect types which can be applied to this Scene
	*/
	private _getWeatherTypes(): Record<string, string>;
	/**
	* Get the alphabetized entities which can be chosen as a configuration for the scene
	* @param {EntityCollection} collection
	*/
	private _getEntities(collection: EntityCollection): {_id:string, name:string}
	/**
	* Capture the current Scene position and zoom level as the initial view in the Scene config
	* @param {Event} event   The originating click event
	*/
	private _onCapturePosition(event: Event): void
	/**
	* Handle click events to open the grid configuration application
	* @param {Event} event   The originating click event
	*/
	private _onGridConfig(event: Event): Promise<void>
}