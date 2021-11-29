import './index';

declare global {
  interface LenientGlobalVariableConfig {
    canvas: never;
    game: never;
    socket: never;
    ui: never;
  }
}
