// eslint-disable-next-line import-x/extensions
import * as worker from "../../../../types/workers/image-compressor.mjs";

declare global {
  export import FORMATS = worker.FORMATS;

  export import ProcessBufferToBase64Options = worker.ProcessBufferToBase64Options;
  export import ProcessBufferRedToBufferRGBAOptions = worker.ProcessBufferRedToBufferRGBAOptions;
  export import ProcessBufferRGBAToBufferRedOptions = worker.ProcessBufferRGBAToBufferRedOptions;
  export import CopyBufferOptions = worker.CopyBufferOptions;
  export import Debug = worker.Debug;
  export import ExpandOrReduceBufferOptions = worker.ExpandOrReduceBufferOptions;
  export import ControlHashesReturnObject = worker.ControlHashesReturnObject;

  export import ProcessBufferToBase64Result = worker.ProcessBufferToBase64Result;
  export import ProcessBufferRedToBufferRGBAResult = worker.ProcessBufferRedToBufferRGBAResult;
  export import ProcessBufferRGBAToBufferRedResult = worker.ProcessBufferRGBAToBufferRedResult;
  export import CopyBufferResult = worker.CopyBufferResult;
  export import BufferOperationReturn = worker.BufferOperationReturn;

  export import processBufferToBase64 = worker.processBufferToBase64;
  export import processBufferRedToBufferRGBA = worker.processBufferRedToBufferRGBA;
  export import processBufferRGBAToBufferRED = worker.processBufferRGBAToBufferRED;
  export import copyBuffer = worker.copyBuffer;
  export import controlHashes = worker.controlHashes;
  export import pixelsToOffscreenCanvas = worker.pixelsToOffscreenCanvas;
  export import offscreenToBase64 = worker.offscreenToBase64;
  export import blobToBase64 = worker.blobToBase64;
  export import expandBuffer = worker.expandBuffer;
  export import reduceBuffer = worker.reduceBuffer;
}
