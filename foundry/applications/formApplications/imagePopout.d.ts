/**
 * An Image Popout Application
 * Provides optional support to edit the image path being viewed
 * @param image - The image being viewed
 * @param options - Standard Application rendering options
 * @param onUpdate - An optional callback function which should be triggered if the Image path is edited
 */
declare class ImagePopout extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<any>; // TODO: Add correct return type
}
