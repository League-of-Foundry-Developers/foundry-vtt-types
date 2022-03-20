import type { PrototypeTokenDataConstructorData } from '../../common/data/data.mjs/prototypeTokenData';

declare global {
  /**
   * An extended Document definition used specifically
   * This ensures that the PrototypeTokenData schema is used instead of the standard TokenData.
   * This exists specifically for prototype Token configuration in the TokenConfig app and should not be used otherwise.
   * @internal
   * @remarks The types for this are incorrect, in particular everything related to the data should use
   * {@link foundry.data.PrototypeTokenData} instead of {@link foundry.data.TokenData}. However, with the current approach
   * to type documents, we don't see a way to do this. This class is just added for reference. As the documentation above
   * says, don't use it (there really shouldn't be a need to do so).
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  class PrototypeTokenDocument extends TokenDocument {
    static get schema(): typeof foundry.data.PrototypeTokenData;

    /** @override */
    update(
      data?: DeepPartial<PrototypeTokenDataConstructorData> | undefined,
      context?: (DocumentModificationContext & foundry.utils.MergeObjectOptions) | undefined
    ): Promise<this | undefined>;
  }
}
