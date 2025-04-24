import type RegionBehaviorType from "./base.d.mts";
import type { Brand } from "fvtt-types/utils";
import fields = foundry.data.fields;
import type { InvertObject } from "@common/utils/helpers.d.mts";

declare namespace DisplayScrollingTextRegionBehaviorType {
  type VISIBILITY_MODES = Brand<number, "DisplayScrollingTextRegionBehaviorType.VISIBILITY_MODES">;

  interface VisibilityModes
    extends Readonly<{
      /**
       * Display only for gamemaster users
       */
      GAMEMASTER: 0;

      /**
       * Display only for users with observer permissions on the triggering token (and for the GM)
       */
      OBSERVER: 1;

      /**
       * Display for all users
       */
      ANYONE: 2;
    }> {}

  interface Schema extends foundry.data.fields.DataSchema {
    events: RegionBehaviorType.EventsField;

    /** The text to display */
    text: fields.StringField<{ required: true }>;

    /** Optional color setting for the text */
    color: fields.ColorField<{ required: true; nullable: false; initial: string }>;

    /** Which users the scrolling text will display for (see {@link VISIBILITY_MODES}) */
    visibility: fields.NumberField<{
      required: true;
      choices: InvertObject<VisibilityModes>;
      initial: typeof DisplayScrollingTextRegionBehaviorType.VISIBILITY_MODES.GAMEMASTER;
      validationError: string;
    }>;

    /** Disable the behavior after it triggers once */
    once: fields.BooleanField;
  }
}

/** The data model for a behavior that displays scrolling text above a token when one of the subscribed events occurs. */
declare class DisplayScrollingTextRegionBehaviorType extends RegionBehaviorType<DisplayScrollingTextRegionBehaviorType.Schema> {
  #displayScrollingTextRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.displayScrollingText", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** Darkness level behavior modes. */
  static get VISIBILITY_MODES(): DisplayScrollingTextRegionBehaviorType.VisibilityModes;

  static override defineSchema(): DisplayScrollingTextRegionBehaviorType.Schema;

  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): Promise<void>;
}

export default DisplayScrollingTextRegionBehaviorType;
