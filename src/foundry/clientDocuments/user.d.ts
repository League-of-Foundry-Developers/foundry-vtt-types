// TODO
declare global {
  /**
   * The client-side User document which extends the common BaseUser abstraction.
   * Each User document contains UserData which defines its data schema.
   *
   * @see {@link data.UserData}               The User data schema
   * @see {@link documents.Users}             The world-level collection of User documents
   * @see {@link applications.UserConfig}     The User configuration application
   *
   * @param data - Initial data provided to construct the User document
   */
  class User extends ClientDocumentMixin(foundry.documents.BaseItem) {}
}

export {};
