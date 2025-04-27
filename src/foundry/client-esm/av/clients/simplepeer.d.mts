import type AVClient from "../client.d.mts";

/**
 * An implementation of the AVClient which uses the simple-peer library and the Foundry socket server for signaling.
 * Credit to bekit#4213 for identifying simple-peer as a viable technology and providing a POC implementation.
 */
declare class SimplePeerAVClient extends AVClient {}

declare namespace SimplePeerAVClient {}

export default SimplePeerAVClient;
