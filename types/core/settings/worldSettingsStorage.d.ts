/**
 * A simple interface for World settings storage which imitates the API provided by localStorage
 */
declare class WorldSettingsStorage extends Map {
  constructor (settings: WorldSettingsStorage.Setting[])

  getItem (key: string): string | null

  setItem (key: string, value: string): void
}

declare namespace WorldSettingsStorage {
  interface Setting {
    key: string
    value: string
  }
}
