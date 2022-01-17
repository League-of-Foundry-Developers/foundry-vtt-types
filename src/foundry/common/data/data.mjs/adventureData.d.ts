import type { PropertiesToSource } from '../../../../types/helperTypes.js';
import type DocumentData from '../../abstract/data.mjs';
import { AnyDocumentData } from '../../abstract/data.mjs';
import * as fields from '../fields.mjs';
import type { ActorData, ActorDataConstructorData } from './actorData.js';
import type { CardsData, CardsDataConstructorData } from './cardsData.js';
import type { CombatData, CombatDataConstructorData } from './combatData.js';
import type { FolderData, FolderDataConstructorData } from './folderData.js';
import type { ItemData, ItemDataConstructorData } from './itemData.js';
import type { JournalEntryData, JournalEntryDataConstructorData } from './journalEntryData.js';
import type { MacroData, MacroDataConstructorData } from './macroData.js';
import type { PlaylistData, PlaylistDataConstructorData } from './playlistData.js';
import type { RollTableData, RollTableDataConstructorData } from './rollTableData.js';
import type { SceneData, SceneDataConstructorData } from './sceneData.js';

interface AdventureDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  img: fields.ImageField;
  description: fields.BlankString;
  actors: AdventureDocumentsField<typeof ActorData>;
  combats: AdventureDocumentsField<typeof CombatData>;
  items: AdventureDocumentsField<typeof ItemData>;
  scenes: AdventureDocumentsField<typeof SceneData>;
  journal: AdventureDocumentsField<typeof JournalEntryData>;
  tables: AdventureDocumentsField<typeof RollTableData>;
  macros: AdventureDocumentsField<typeof MacroData>;
  cards: AdventureDocumentsField<typeof CardsData>;
  playlists: AdventureDocumentsField<typeof PlaylistData>;
  folders: AdventureDocumentsField<typeof FolderData>;
  sort: fields.IntegerSortField;
  flags: fields.ObjectField;
}

interface AdventureDataProperties {
  /** @defaultValue `null` */
  _id: string | null;

  name: string;

  img: string | null | undefined;

  /** @defaultValue `""` */
  description: string;

  /** @defaultValue `[]` */
  actors: ActorData[];

  /** @defaultValue `[]` */
  combats: CombatData[];

  /** @defaultValue `[]` */
  items: ItemData[];

  /** @defaultValue `[]` */
  scenes: SceneData[];

  /** @defaultValue `[]` */
  journal: JournalEntryData[];

  /** @defaultValue `[]` */
  tables: RollTableData[];

  /** @defaultValue `[]` */
  macros: MacroData[];

  /** @defaultValue `[]` */
  cards: CardsData[];

  /** @defaultValue `[]` */
  playlists: PlaylistData[];

  /** @defaultValue `[]` */
  folders: FolderData[];

  /** @defaultValue `0` */
  sort: number;

  /** @defaultValue `{}` */
  flags: Record<string, unknown>;
}

interface AdventureDataConstructorData {
  /** @defaultValue `null` */
  _id?: string | null | undefined;

  name: string;

  img?: string | null | undefined;

  /** @defaultValue `""` */
  description?: string | null | undefined;

  /** @defaultValue `[]` */
  actors?: ActorDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  combats?: CombatDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  items?: ItemDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  scenes?: SceneDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  journal?: JournalEntryDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  tables?: RollTableDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  macros?: MacroDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  cards?: CardsDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  playlists?: PlaylistDataConstructorData[] | null | undefined;

  /** @defaultValue `[]` */
  folders?: FolderDataConstructorData[] | null | undefined;

  /** @defaultValue `0` */
  sort?: number | null | undefined;

  /** @defaultValue `{}` */
  flags?: Record<string, unknown> | null | undefined;
}

/**
 * A data schema which encompasses a collection of base Documents which comprise an adventure module.
 *
 * WARNING: This data schema is an early prototype which will be fully implemented in V10.
 * Until then it is for internal use only. Use this at your own risk.
 * @internal
 *
 * @see BaseAdventure
 */
export class AdventureData extends DocumentData<
  AdventureDataSchema,
  AdventureDataProperties,
  PropertiesToSource<AdventureDataProperties>,
  AdventureDataConstructorData
> {
  /** @override */
  static defineSchema(): AdventureDataSchema;

  /**
   * A type of data field which stores a collection of document data objects
   * @typeParam D - the type of the DocumentData constructor
   */
  static ADVENTURE_DOCUMENTS_FIELD<D extends ConstructorOf<AnyDocumentData>>(dataCls: D): AdventureDocumentsField<D>;
}

/**
 * Property type: `D[]`
 * Constructor type: `ConstructorDataType<D>[] | null | undefined`
 * Default: `[]`
 */
type AdventureDocumentsField<D extends ConstructorOf<AnyDocumentData>> = DocumentField<D> & {
  type: [D];
  required: true;
  default: [];
};
