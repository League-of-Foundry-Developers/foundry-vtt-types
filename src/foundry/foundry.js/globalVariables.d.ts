declare global {
  /**
   * @defaultValue `undefined`
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let canvas: 'canvas' extends keyof LenientGlobalVariableTypes ? Canvas : Canvas | undefined;

  /**
   * A "secret" global to help debug attributes of the currently controlled Token.
   * This is only for debugging, and may be removed in the future, so it's not safe to use.
   */
  let _token: InstanceType<CONFIG['Token']['objectClass']> | null;
}

export {};
