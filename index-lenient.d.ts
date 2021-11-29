import './index';

declare global {
  interface LenientGlobalVariableTypes {
    canvas: never;
    game: never;
    socket: never;
    ui: never;
  }
}
