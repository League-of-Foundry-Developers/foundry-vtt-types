import * as _SimplePeer from "simple-peer";

declare global {
  namespace SimplePeer {
    type Options = _SimplePeer.Options;
    type SimplePeer = _SimplePeer.SimplePeer;
    type TypedArray = _SimplePeer.TypedArray;
    type SimplePeerData = _SimplePeer.SimplePeerData;
    type SignalData = _SimplePeer.SignalData;
    type Instance = _SimplePeer.Instance;
  }
  const SimplePeer: SimplePeer.SimplePeer;
}
