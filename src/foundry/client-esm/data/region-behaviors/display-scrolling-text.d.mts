import type RegionBehaviorType from "./base.d.mts";
import type { ValueOf } from "../../../../utils/index.d.mts";
import fields = foundry.data.fields;

/** The data model for a behavior that displays scrolling text above a token when one of the subscribed events occurs. */
declare namespace DisplayScrollingTextRegionBehaviorType {
  const _VISIBILITY_MODES: Readonly<{
    /**
     * Display only for gamemaster users
     */
    GAMEMASTER: 0,

    /**
     * Display only for users with observer permissions on the triggering token (and for the GM)
     */
    OBSERVER: 1,

    /**
     * Display for all users
     */
    ANYONE: 2,
  }>
  type VISIBILITY_MODES = ValueOf<typeof _VISIBILITY_MODES>;

  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;
    /** The text to display */
    text: fields.StringField<{required: true}>;
    /** Optional color setting for the text */
    color: fields.ColorField<{required: true, nullable: false, initial: string}>;
    /** Which users the scrolling text will display for (see {@link VISIBILITY_MODES}) */
    visibility: fields.NumberField<{required: true, choices: Record<VISIBILITY_MODES, string>, initial: typeof _VISIBILITY_MODES.GAMEMASTER, validationError: string}>;
    /** Disable the behavior after it triggers once */
    once: fields.BooleanField;
  }
}

/** The data model for a behavior that displays scrolling text above a token when one of the subscribed events occurs. */
declare class DisplayScrollingTextRegionBehaviorType extends RegionBehaviorType<DisplayScrollingTextRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.displayScrollingText", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** Darkness level behavior modes. */
  static get VISIBILITY_MODES(): typeof DisplayScrollingTextRegionBehaviorType._VISIBILITY_MODES;
  static #VISIBILITY_MODES: typeof DisplayScrollingTextRegionBehaviorType._VISIBILITY_MODES;

  static override defineSchema(): DisplayScrollingTextRegionBehaviorType.Schema;

  /**
   * Display the scrolling text to the current User?
   * @param event     - The Region event.
   * @returns         - Display the scrolling text to the current User?
   */
  #canView(event: RegionDocument.RegionEvent): boolean;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default DisplayScrollingTextRegionBehaviorType;