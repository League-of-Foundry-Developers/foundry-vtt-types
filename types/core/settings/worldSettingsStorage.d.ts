/**
 * A simple interface for World settings storage which imitates the API provided
 * by localStorage
 */
declare class WorldSettingsStorage extends Map {
  constructor (settings: Record<string, string>)

  getItem (key: string): string | null

  setItem (key: string, value: string): void
}
