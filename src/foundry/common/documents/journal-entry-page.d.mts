import type Document from "../abstract/document.d.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST } from "../module.d.mts";
import type { BaseUser } from "./user.d.mts";

declare namespace BaseJournalEntryPage {
  type Title = {
    show: fields.BooleanField;
    level: fields.NumberField;
  };

  type Text = {
    content: fields.HTMLField;
    markdown: fields.StringField;
    format: fields.NumberField;
  };

  type Video = {
    controls: fields.BooleanField;
    loop: fields.BooleanField;
    autoplay: fields.BooleanField;
    volume: fields.AlphaField;
    timestamp: fields.NumberField;
    width: fields.NumberField;
    height: fields.NumberField;
  };

  type Schema = {
    _id: fields.DocumentIdField;
    name: fields.StringField;
    type: fields.StringField;
    title: fields.SchemaField<Title>;
    image: fields.SchemaField<{ caption: fields.StringField }>;
    text: fields.SchemaField<Text>;
    video: fields.SchemaField<Video>;
    src: fields.StringField;
    system: fields.TypeDataField;
    sort: fields.IntegerSortField;
    ownership: fields.DocumentOwnershipField;
    flags: fields.ObjectField;
    _stats: fields.DocumentStatsField;
  };
}

export default class BaseJournalEntryPage extends Document {
  static override defineSchema(): BaseJournalEntryPage.Schema;

  /**
   * The allowed set of JournalEntryPageData types which may exist.
   */
  // TODO: Figure out if there's a good way to derive/link this
  static get TYPES(): Array<string>;

  override getUserLevel(user?: BaseUser): CONST.DOCUMENT_OWNERSHIP_LEVELS;
}
