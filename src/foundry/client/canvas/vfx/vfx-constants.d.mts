/**
 * The duration of time allocated for "pre-impact" lead in animations or sounds.
 */
export const PRE_IMPACT_MS: 500;

/**
 * An enumeration of animation sound alignment positions.
 */
export const SOUND_ALIGNMENT: Readonly<{
  // Align the end of the sound to the start of the animation
  END_START: 0;
  START: 1;
  MIDDLE: 2;
  END: 3;
  // Align the start of the sound to the end of the animation
  START_END: 4;
}>;
