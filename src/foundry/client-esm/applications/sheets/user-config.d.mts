import type DocumentSheetV2 from "../api/document-sheet.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mts";

/**
 * The User configuration application.
 */
export default class UserConfig extends HandlebarsApplicationMixin(DocumentSheetV2) {}
