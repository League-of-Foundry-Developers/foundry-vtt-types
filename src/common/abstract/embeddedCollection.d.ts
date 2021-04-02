declare namespace foundry {
  namespace abstract {
    interface EmbeddedCollection<T> extends Omit<foundry.utils.Collection<T>, 'set' | 'delete'> {
      /** {@inheritdoc} */
      set(key: string, value: T, { modifySource }: { modifySource?: boolean }): this;

      /** {@inheritdoc} */
      delete(key: string, { modifySource }: { modifySource?: boolean }): boolean;
    }
  }
}
