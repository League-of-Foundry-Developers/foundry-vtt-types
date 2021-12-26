import type { PropertiesToSource } from '../../../../types/helperTypes.js';
import type DocumentData from '../../abstract/data.mjs';
import { AnyDocumentData } from '../../abstract/data.mjs';
import * as fields from '../fields.mjs';
import type { ActorData } from './actorData.js';
import type { CardsData } from './cardsData.js';
import type { CombatData } from './combatData.js';
import type { FolderData } from './folderData.js';
import type { ItemData } from './itemData.js';
import type { JournalEntryData } from './journalEntryData.js';
import type { MacroData } from './macroData.js';
import type { PlaylistData } from './playlistData.js';
import type { RollTableData } from './rollTableData.js';
import type { SceneData } from './sceneData.js';

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
  actors?: ActorData[] | null | undefined;

  /** @defaultValue `[]` */
  combats?: CombatData[] | null | undefined;

  /** @defaultValue `[]` */
  items?: ItemData[] | null | undefined;

  /** @defaultValue `[]` */
  scenes?: SceneData[] | null | undefined;

  /** @defaultValue `[]` */
  journal?: JournalEntryData[] | null | undefined;

  /** @defaultValue `[]` */
  tables?: RollTableData[] | null | undefined;

  /** @defaultValue `[]` */
  macros?: MacroData[] | null | undefined;

  /** @defaultValue `[]` */
  cards?: CardsData[] | null | undefined;

  /** @defaultValue `[]` */
  playlists?: PlaylistData[] | null | undefined;

  /** @defaultValue `[]` */
  folders?: FolderData[] | null | undefined;

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
 * Constructor type: `D[] | null | undefined`
 * Default: `[]`
 */
type AdventureDocumentsField<D extends ConstructorOf<AnyDocumentData>> = DocumentField<D> & {
  type: [D];
  required: true;
  default: [];
};
