// @TODO:

/**
 * Configuration sheet for the Drawing object
 *
 * @param drawing - The Drawing object being configured
 * @param options - Additional application rendering options
 * @param preview - Configure a preview version of the Drawing which is not yet saved
 */
declare class DrawingConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
  /**
   * Extend the application close method to clear any preview sound aura if one exists
   */
  close (): Promise<void>
}

/**
 * Light Source Configuration Sheet
 *
 * @param light - The AmbientLight object for which settings are being configured
 * @param options - LightConfig ui options (see Application)
 */
declare class LightConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
}

/**
 * Ambient Sound Config Sheet
 *
 * @param sound - The sound object being configured
 * @param options - Additional application rendering options
 * @param preview - Configure a preview version of a sound which is not yet saved
 */
declare class AmbientSoundConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
}
/**
 * Tile Config Sheet
 *
 * @param tile - The Tile object being configured
 * @param options - Additional application rendering options
 * @param preview - Configure a preview version of a tile which is not yet saved
 */
declare class TileConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
}

/**
 * A Token Configuration Application
 *
 * @param token - The Token object for which settings are being configured
 * @param options - TokenConfig ui options (see Application)
 *
 * @param configureDefault - Configure the default actor token on submit
 */
declare class TokenConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
}

/**
 * Wall Configuration Sheet
 *
 * @param object - The Wall object for which settings are being configured
 * @param options - Additional options which configure the rendering of the configuration sheet.
 */
declare class WallConfig extends FormApplication {
  _updateObject (event?: Event, formData?: object): void;
}
