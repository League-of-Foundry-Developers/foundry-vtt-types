/**
 * A helper class which assists with localization and string translation
 */
declare class Localization {
	/**
	 * The target language for localization
	 */
	lang: string;

	/**
	 * The translation dictionary for the target language
	 */
	translations: object;

	constructor();

	/**
	 * Initialize the Localization module
	 * Discover available language translations and apply the current language setting
	 */
	initialize(): Promise<void>;

	/**
	 * Set a language as the active translation source for the session
	 * @param lang	A language string in CONFIG.supportedLanguages
	 * @return 		A Promise which resolves once the translations for the requested language are ready
	 */
	setLanguage(lang: string): Promise<void>;

	/**
	 * Localize a string by drawing a translation from the available translations dictionary, if available
	 * If a translation is not available, the original string is returned
	 * @param stringId	The string ID to translate
	 * @return			The translated string
	 */
	localize(stringId: string): string;
}