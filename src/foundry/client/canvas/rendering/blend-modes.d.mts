export const BLEND_MODES: {
  /**
   * A custom blend mode equation which chooses the maximum color from each channel within the stack.
   * @defaultValue
   * ```typescript
   * [
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.MAX,
   *   WebGL2RenderingContext.MAX,
   * ]
   * ```
   */
  MAX_COLOR: [GLenum, GLenum, GLenum, GLenum, GLenum, GLenum];

  /**
   * A custom blend mode equation which chooses the minimum color from each channel within the stack.
   * @defaultValue
   * ```typescript
   * [
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.MIN,
   *   WebGL2RenderingContext.MAX,
   * ]
   * ```
   */
  MIN_COLOR: [GLenum, GLenum, GLenum, GLenum, GLenum, GLenum];

  /**
   * A custom blend mode equation which chooses the minimum color for color channels and min alpha from alpha channel.
   * @defaultValue
   * ```typescript
   * [
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.ONE,
   *   WebGL2RenderingContext.MIN,
   *   WebGL2RenderingContext.MIN,
   * ]
   * ```
   */
  MIN_ALL: [GLenum, GLenum, GLenum, GLenum, GLenum, GLenum];
};
