/**
 * The Compendium class provides an interface for interacting with compendium packs which are 
 * collections of similar Entities which are stored outside of the world database but able to
 * be easily imported into an active session.
 * 
 * When the game session is initialized, each available compendium pack is constructed and 
 * added to the ``game.packs``.
 *
 * Each Compendium is distinctly referenced using its canonical "collection" name which is a 
 * unique string that contains the package name which provides the compendium as well as the
 * name of the pack within that package. For example, in the D&D5e system, the compendium pack
 * which provides the spells available within the SRD has the collection name "dnd5e.spells".
 *
 * @param metadata	The compendium metadata, an object provided by game.data
 * @param options	Application rendering options
 *
 * @example
 * // Let's learn the collection names of all the compendium packs available within a game
 * game.packs.map(p => p.collection);
 *
 * // Suppose we are working with a particular pack named "dnd5e.spells"
 * const pack = game.packs.find(p => p.collection === "dnd5e.spells");
 * 
 * // We can load the index of the pack which contains all entity IDs, names, and image icons
 * pack.getIndex().then(index => console.log(index));
 * 
 * // We can find a specific entry in the compendium by its name
 * let entry = pack.index.find(e => e.name === "Acid Splash");
 * 
 * // Given the entity ID of "Acid Splash" we can load the full Entity from the compendium
 * pack.getEntity(entry.id).then(spell => console.log(spell));
 * 
 * @example
 * // We often may want to programmatically create new Compendium content
 * // Let's start by creating a custom spell as an Item instance
 * let itemData = {name: "Custom Death Ray", type: "Spell"};
 * let item = new Item(itemData);
 * 
 * // Once we have an entity for our new Compendium entry we can import it, if the pack is unlocked
 * pack.importEntity(item);
 * 
 * // When the entity is imported into the compendium it will be assigned a new ID, so let's find it
 * pack.getIndex().then(index => {
 *   let entry = index.find(e => e.name === itemData.name));
 *   console.log(entry);
 * });
 *
 * // If we decide to remove an entry from the compendium we can do that by the entry ID
 * pack.removeEntry(entry.id);
 */
declare class Compendium extends Application {

}