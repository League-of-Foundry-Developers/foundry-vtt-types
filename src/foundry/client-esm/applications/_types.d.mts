// Open question - this is just types?

export type ApplicationConfiguration = {};

export type ApplicationPosition = {};

export type AppplicationWindowConfiguration = {};

export type ApplicationFormConfiguration = {};

export type ApplicationHeadersControlEntry = {};

export type ApplicationConstructionParams = {
  position: ApplicationPosition;
};

export type ApplicationRenderOptions = {};

export type ApplicationWindowRenderOptions = {};

/**
 * Context data provided to the renderer
 */
export type ApplicationRenderContext = {};

export type ApplicationClosingOptions = {};

export type ApplicationClickAction = (event: PointerEvent, target: HTMLElement) => Promise<void>;

export type ApplicationFormSubmission = () => Promise<void>;

export type ApplicationTab = {};

export type FormNode = {};

export type FormFooterButton = {};
