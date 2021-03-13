/**
 * Ambient Sound Config Sheet
 */
declare class AmbientSoundConfig extends FormApplication<AmbientSoundConfig.Data, AmbientSound> {
  /**
   * @param sound   - The sound object being configured
   * @param options - Additional application rendering options
   */
  constructor(sound: AmbientSound, options?: Partial<AmbientSoundConfig.Options>);

  options: AmbientSoundConfig.Options;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "sound-config",
   *   classes: ["sheet", "sound-sheet"],
   *   title: "SOUND.ConfigTitle",
   *   template: "templates/scene/sound-config.html",
   *   width: 480
   * });
   * ```
   */
  static get defaultOptions(): AmbientSoundConfig.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): AmbientSoundConfig.Data;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: AmbientSoundConfig.FormData): Promise<AmbientSound>;

  /** @override */
  close(options?: Application.CloseOptions): Promise<void>;
}

declare namespace AmbientSoundConfig {
  interface Data {
    object: Duplicated<AmbientSoundConfig['object']['data']>;
    options: AmbientSoundConfig['options'];
    submitText: string;
  }

  interface FormData {
    easing: AmbientSound.Data['easing'];
    path: AmbientSound.Data['path'];
    radius: AmbientSound.Data['radius'] | null;
    type: AmbientSound.Data['type'];
    volume: AmbientSound.Data['volume'];
    x: AmbientSound.Data['x'] | null;
    y: AmbientSound.Data['y'] | null;
  }

  interface Options extends FormApplication.Options {
    /**
     * Configure a preview version of a sound which is not yet saved
     */
    preview?: boolean;
  }
}
