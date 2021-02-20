/**
 * A Token Configuration Application
 *
 * @param token - The Token object for which settings are being configured
 * @param options - TokenConfig ui options (see Application)
 *
 * @param configureDefault - Configure the default actor token on submit
 */
declare class TokenConfig extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<any>; // TODO: Add correct return type
}
