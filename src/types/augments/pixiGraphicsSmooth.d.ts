import * as graphicsSmooth from "@pixi/graphics-smooth";

declare global {
  namespace PIXI {
    export import smooth = graphicsSmooth; // eslint-disable-line @typescript-eslint/no-unused-vars
  }
}
