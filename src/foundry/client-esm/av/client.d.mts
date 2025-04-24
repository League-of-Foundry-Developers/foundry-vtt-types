import type AVMaster from "./master.d.mts";
import type AVSettings from "./settings.d.mts";

/**
 * An interface for an Audio/Video client which is extended to provide broadcasting functionality.
 * @remarks TODO: Stub
 */
declare class AVClient {
  /**
   * @param master   - The master orchestration instance
   * @param settings - The audio/video settings being used
   */
  constructor(master: AVMaster, settings: AVSettings);
}

declare namespace AVClient {}

export default AVClient;
