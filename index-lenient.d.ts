import './index';

declare global {
  interface LenientGlobalVariableConfig {
    game: never;
    socket: never;
    canvas: never;
  }
}
