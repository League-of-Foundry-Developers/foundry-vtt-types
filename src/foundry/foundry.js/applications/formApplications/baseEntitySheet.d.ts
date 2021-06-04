/**
 * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Entity instances.
 * See the FormApplication documentation for more complete description of this interface.
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Entity which should be managed by this form sheet
 * @deprecated since 0.8.0
 */
declare class BaseEntitySheet<
  P extends DocumentSheet.Options = DocumentSheet.Options,
  D extends object = DocumentSheet.Data<Entity>,
  O extends Entity<any, any> = D extends DocumentSheet.Data<infer T> ? T : Entity
> extends DocumentSheet<P, D, O> {}
