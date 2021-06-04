// TODO
declare global {
  /**
   * The client-side ChatMessage document which extends the common BaseChatMessage abstraction.
   * Each ChatMessage document contains ChatMessageData which defines its data schema.
   *
   * @see {@link data.ChatMessageData}              The ChatMessage data sche
   * ma
   * @see {@link documents.Messages}                The world-level collection of ChatMessage documents
   *
   * @param data - Initial data provided to construct the ChatMessage document
   */
  class ChatMessage extends ClientDocumentMixin(foundry.documents.BaseChatMessage) {}
}

export {};
