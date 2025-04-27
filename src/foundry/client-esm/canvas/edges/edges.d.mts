import type { Identity } from "fvtt-types/utils";
import type Edge from "./edge.d.mts";

/**
 * A special class of Map which defines all the edges used to restrict perception in a Scene.
 */
declare class CanvasEdges extends Map<string, Edge> {
  /**
   * Initialize all active edges for the Scene. This workflow occurs once only when the Canvas is first initialized.
   * Edges are created from the following sources:
   * 1. Wall documents
   * 2. Canvas boundaries (inner and outer bounds)
   * 3. Darkness sources
   * 4. Programmatically defined in the "initializeEdges" hook
   */
  initialize(): void;

  /**
   * Incrementally refresh Edges by computing intersections between all registered edges.
   */
  refresh(): void;
}

declare namespace CanvasEdges {
  interface Any extends AnyCanvasEdges {}
  interface AnyConstructor extends Identity<typeof AnyCanvasEdges> {}
}

declare abstract class AnyCanvasEdges extends CanvasEdges {
  constructor(...args: never);
}

export default CanvasEdges;
