/**
 * A game settings configuration application
 * This form renders the settings defined via the game.settings.register API which have config = true
 */
declare class SettingsConfig extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<any>; // TODO: Add correct return type
}
