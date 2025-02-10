// eslint-disable-next-line import-x/extensions
import * as worker from "../../../../types/workers/image-compressor.mjs";

declare global {
  export import FORMATS = worker.FORMATS;
  export import Debug = worker.Debug;

  export import ProcessBufferToBase64Options = worker.ProcessBufferToBase64Options;
  export import ExpandOrReduceBufferOptions = worker.ExpandOrReduceBufferOptions;
  export import ProcessBufferToBase64Return = worker.ProcessBufferToBase64Return;
  export import ProcessBufferRedToBufferRGBAReturn = worker.ProcessBufferRedToBufferRGBAReturn;
  export import ProcessBufferRGBAToBufferREDReturn = worker.ProcessBufferRGBAToBufferREDReturn;

  export import processBufferToBase64 = worker.processBufferToBase64;
  export import processBufferRedToBufferRGBA = worker.processBufferRedToBufferRGBA;
  export import processBufferRGBAToBufferRED = worker.processBufferRGBAToBufferRED;
  export import controlHashes = worker.controlHashes;
  export import pixelsToOffscreenCanvas = worker.pixelsToOffscreenCanvas;
  export import offscreenToBase64 = worker.offscreenToBase64;
  export import blobToBase64 = worker.blobToBase64;
  export import expandBuffer = worker.expandBuffer;
  export import reduceBuffer = worker.reduceBuffer;
}
