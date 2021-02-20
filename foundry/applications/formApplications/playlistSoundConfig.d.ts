/**
 * Playlist Sound Configuration Sheet
 *
 * @param sound - The sound object being configured
 * @param options - Additional application rendering options
 */
declare class PlaylistSoundConfig extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<Playlist.Sound>;
}
