/**
 * A helper class for creating tabbed containers.
 * Create one Tabs instance per tabbed navigation container in your application.
 *
 * @example
 * <!-- Example HTML -->
 * <nav class="tabs" data-group="group1">
 *  <a class="item" data-tab="tab1">Tab 1</li>
 *  <a class="item" data-tab="tab2">Tab 2</li>
 * </nav>
 *
 * <div class="tab" data-tab="tab1" data-group="group1">Content 1</div>
 * <div class="tab" data-tab="tab2" data-group="group1">Content 2</div>
 *
 * @example
 * // JavaScript Listener
 * let nav = $('.tabs[data-group="group1"]');
 * new Tabs(nav, {
 *   initial: "tab1",
 *   callback: t => console.log("Tab ${t} was clicked")
 * });
 *
 * @param tabs {HTMLElement|JQuery} An HTML element or JQuery object representing the tab navigation container.
 */
declare class Tabs {
	/** The collection of tabs */
	tabs: JQuery;

	/** The callback function to trigger when a Tab is activated */
	callback: Function;

	/** The container element within which both the tab navigation and the tab content exists */
	container: JQuery | HTMLElement;

	/** The currently active tab */
	active: JQuery;

	constructor(tabs: JQuery|HTMLElement, { initial, callback, container });

	/**
	 * The named tab group
	 * Retrieved as a property since the composition of the DOM may change over time
	 */
	get group(): JQuery;

	/**
	 * Activate a tab by it's name. This gets called automatically when a tab in the navigation is clicked,
	 * however you may also call this function directly.
	 */
	activateTab(tab: JQuery);
}