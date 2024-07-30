export {};

type Color = number;

declare global {
  /**
   * A SpriteMesh which visualizes a Token object in the PrimaryCanvasGroup.
   */
  class TokenMesh extends OccludableObjectMixin(SpriteMesh) {
    /**
     * Sorting values to deal with ties.
     * @defaultValue `750`
     */
    static PRIMARY_SORT_ORDER: number;

    static override get defaultData(): TokenMesh.Data;

    override refresh(): void;

    override setPosition(x: number, y: number): void;

    override updateBounds(): void;

    protected override _getTextureCoordinate(testX: number, testY: number): { x: number; y: number } | null;

    /**
     * Get the attributes for this TokenMesh which configure the display of this TokenMesh and are compatible
     * with CanvasAnimation.
     */
    getDisplayAttributes(): TokenMeshDisplayAttributes;
  }

  namespace TokenMesh {
    type Data = {
      /**
       * Is this TokenMesh rotation locked?
       * @defaultValue `false`
       */
      lockRotation: boolean;
    } & ReturnType<typeof OccludableObjectMixin<typeof SpriteMesh>>["defaultData"];
  }

  interface TokenMeshDisplayAttributes {
    x: number;

    y: number;

    width: number;

    height: number;

    alpha: number;

    rotation: number;

    scaleX: number;

    scaleY: number;

    tint: Color;
  }
}
