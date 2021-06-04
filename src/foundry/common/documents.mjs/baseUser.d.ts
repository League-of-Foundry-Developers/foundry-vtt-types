import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The base User Entity which is extended by both the server and client.
 * This base User provides shared functionality which is consistent for both sides of the application.
 * Each client who connects to a Foundry Virtual Tabletop session assumes the identity of one (and only one) User.
 */
export declare class BaseUser extends Document<any, null> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'User';
      collection: 'users';
      label: 'DOCUMENT.User';
      isPrimary: true;
    }
  >;
}
