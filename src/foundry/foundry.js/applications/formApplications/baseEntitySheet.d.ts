import { Document } from '../../../common/abstract/module.mjs';

declare global {
  /**
   * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Entity instances.
   * See the FormApplication documentation for more complete description of this interface.
   * @typeParam P - the type of the options object
   * @typeParam D - The data structure used to render the handlebars template.
   * @typeParam O - the type of the Entity which should be managed by this form sheet
   * @deprecated since 0.8.0
   */
  class BaseEntitySheet<
    P extends DocumentSheet.Options = DocumentSheet.Options,
    D extends DocumentSheet.Data = DocumentSheet.Data,
    O extends Document<any, any> = D extends DocumentSheet.Data<infer T> ? T : Document<any, any>
  > extends DocumentSheet<P, D, O> {}
}
