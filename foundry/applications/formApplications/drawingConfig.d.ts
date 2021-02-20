/**
 * Configuration sheet for the Drawing object
 *
 * @param drawing - The Drawing object being configured
 * @param options - Additional application rendering options
 * @param preview - Configure a preview version of the Drawing which is not yet saved
 */
declare class DrawingConfig extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<any>; // TODO: Add correct return type
  /**
   * Extend the application close method to clear any preview sound aura if one exists
   */
  close(): Promise<void>;
}
