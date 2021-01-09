// @TODO:

/**
 * Top menu scene navigation
 */
declare class SceneNavigation extends Application {
  /**
   * Assign the default options which are supported by the SceneNavigation UI
   */
  static get defaultOptions (): Application.Options

  /**
   * Return an Array of Scenes which are displayed in the Navigation bar
   */
  get scenes (): Scene[]

  /**
   * Collapse the SceneNavigation menu, sliding it up if it is currently expanded
   */
  collapse (): Promise<boolean>

  /**
   * Expand the SceneNavigation menu, sliding it down if it is currently collapsed
   */
  expand (): Promise<boolean>

  /**
   * Prepare the default data which is required to render the SceneNavigation menu
   */
  getData (): object

  /**
   * Extend the Application.render logic to first check the rendering context to see what was changed
   * If a specific context was provided, make sure an update to the navigation is necessary before rendering
   */
  render (force?: boolean, options?: Application.RenderOptions): Application
}
