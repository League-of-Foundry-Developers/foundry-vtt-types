import type DialogV2 from "../../api/dialog.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type { BooleanField, NumberField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ShowToPlayersDialog: ShowToPlayersDialog.Any;
    }
  }
}

/**
 * A dialog for configuring options when showing content to players.
 */
declare class ShowToPlayersDialog<
  RenderContext extends ShowToPlayersDialog.RenderContext = ShowToPlayersDialog.RenderContext,
  Configuration extends ShowToPlayersDialog.Configuration = ShowToPlayersDialog.Configuration,
  RenderOptions extends ShowToPlayersDialog.RenderOptions = ShowToPlayersDialog.RenderOptions,
> extends HandlebarsApplicationMixin(DialogV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: ShowToPlayersDialog.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["show-to-players"],
   *   modal: true,
   *   buttons: [{
   *     label: "JOURNAL.ActionShow",
   *     type: "submit",
   *     icon: "fa-solid fa-check",
   *     default: true
   *   }],
   *   window: {
   *     contentTag: "form",
   *     contentClasses: ["standard-form"]
   *   },
   *   position: {
   *     width: 500
   *   },
   *   form: {
   *     handler: ShowToPlayersDialog.#onFormSubmit,
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DialogV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The Document that is being shown.
   */
  get document(): JournalEntry.Implementation | JournalEntryPage.Implementation;

  /**
   * Whether the Document that is being shown is an image-type JournalEntryPage.
   */
  get isImage(): boolean;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  static #ShowToPlayersDialog: true;
}

declare namespace ShowToPlayersDialog {
  interface Any extends AnyShowToPlayersDialog {}
  interface AnyConstructor extends Identity<typeof AnyShowToPlayersDialog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, DialogV2.RenderContext {
    buttons: DialogV2.Button[];
    isImage: boolean;
    image: {
      only: BooleanField;
      title: BooleanField;
      caption: BooleanField;
    };
    users: User.Implementation[];
    isGM: boolean;
    ownership: NumberField;
    levels: { value: CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS; label: string }[];
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, DialogV2.Configuration {
    /**
     * The Document that is being shown.
     */
    document: JournalEntry.Implementation | JournalEntryPage.Implementation;
  }

  /**
   * @remarks `document` is deliberately excluded from the `DeepPartial` applied to the rest of the
   * options, mirroring {@linkcode foundry.applications.api.DocumentSheetV2.InputOptions | DocumentSheetV2.InputOptions}.
   * Document instances are not designed to be deep-partialed (their circular structure isn't
   * bounded the way {@linkcode Node} is), so allowing that recursion to reach into `document`
   * produces incorrect and extremely expensive-to-check types.
   */
  type InputOptions<Configuration extends ShowToPlayersDialog.Configuration = ShowToPlayersDialog.Configuration> =
    DeepPartial<Omit<Configuration, "document">> & {
      document: Configuration["document"];
    };

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DialogV2.RenderOptions {}
}

declare abstract class AnyShowToPlayersDialog extends ShowToPlayersDialog<
  ShowToPlayersDialog.RenderContext,
  ShowToPlayersDialog.Configuration,
  ShowToPlayersDialog.RenderOptions
> {
  constructor(...args: never);
}

export default ShowToPlayersDialog;
