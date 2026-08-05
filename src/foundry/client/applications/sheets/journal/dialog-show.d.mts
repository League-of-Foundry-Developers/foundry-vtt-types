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

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * @remarks Toggles and disables the individual player checkboxes to follow the "all players" checkbox.
   */
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  static #ShowToPlayersDialog: true;
}

declare namespace ShowToPlayersDialog {
  interface Any extends AnyShowToPlayersDialog {}
  interface AnyConstructor extends Identity<typeof AnyShowToPlayersDialog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, DialogV2.RenderContext {
    buttons: DialogV2.Button[];

    isImage: boolean;

    image: ImageFields;

    /** @remarks Every User other than the one showing the content. */
    users: User.Implementation[];

    isGM: boolean;

    ownership: NumberField<{ label: "OWNERSHIP.Configure"; blank: false; required: true }>;

    levels: OwnershipChoice[];
  }

  /** @remarks The checkboxes offered for an image-type JournalEntryPage. */
  interface ImageFields {
    only: BooleanField<{ label: "JOURNALENTRYPAGE.ShowImageOnly" }>;

    title: BooleanField<{ label: "JOURNALENTRYPAGE.ShowImageTitle" }>;

    caption: BooleanField<{ label: "JOURNALENTRYPAGE.ShowImageCaption" }>;
  }

  /**
   * An entry of {@linkcode RenderContext.levels}.
   * @remarks The `INHERIT` level is omitted for embedded Documents.
   */
  interface OwnershipChoice {
    value: CONST.DOCUMENT_META_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;

    label: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, DialogV2.Configuration {
    /**
     * The Document to show to players.
     */
    document: JournalEntry.Implementation | JournalEntryPage.Implementation;
  }

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
