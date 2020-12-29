/**
 * A helper class to provide common functionality for working with HTML5 audio and Howler instances
 * A singleton instance of this class is available as ``game.audio``
 *
 * Audio playback in Foundry VTT is managed by Howler.js (https://howlerjs.com/). Several methods and
 * attributes in this API return :class:`Howl` instances. See the Howler documentation for details
 * and example usage of the Howl API.
 */
declare class AudioHelper {
	/** The set of Howl instances which have been created for different audio paths */
	sounds: any;

	/**
	 * A user gesture must be registered before audio can be played.
	 * This Array contains the Howl instances which are requested for playback prior to a gesture.
	 * Once a gesture is observed, we begin playing all elements of this Array.
	 */
	pending: howler.Howl[];

	/**
	 * A flag for whether video playback is currently locked by awaiting a user gesture
	 */
	locked: boolean;

	/**
	 * The Native interval for the AudioHelper to analyse audio levels from streams
	 * Any interval passed to startLevelReports() would need to be a multiple of this value.
	 * Defaults to 50ms.
	 */
	levelAnalyserNativeInterval: 50;

	constructor();

	/**
	 * Register client-level settings for global volume overrides
	 */
	static registerSettings(): void;

	/**
	 * Create a Howl instance for a given audio source URL
	 */
	create({
		src,
		preload,
		autoplay,
		html5,
		volume,
		loop
	}: {
		src: string,
		preload: boolean,
		autoplay: boolean,
		html5: boolean
		volume: number,
		loop: boolean
	}): howler.Howl;

	/**
	 * Test whether a source file has a supported audio extension type
	 * @param src      A requested audio source path
	 * @return Does the filename end with a valid audio extension?
	 */
	static hasAudioExtension(src: string): boolean;

	/**
	 * Play a single audio effect by it's source path and Howl ID
	 */
	play(src: string, id: number): void;

	/**
	 * Register an event listener to await the first mousemove gesture and begin playback once observed
	 */
	awaitFirstGesture(): void;

	/**
	* Handle the first observed user gesture
	* @param event   The mouse-move event which enables playback
	*/
	_onFirstGesture(event: Event): void;

	preload(data: any): void;
	
	/**
	 * Play a one-off sound effect which is not part of a Playlist
	 *
	 * @param data 			An object configuring the audio data to play
	 * @param data.src		The audio source file path, either a public URL or a local path relative to the public directory
	 * @param data.volume	The volume level at which to play the audio, between 0 and 1.
	 * @param data.autoplay	Begin playback of the audio effect immediately once it is loaded.
	 * @param data.loop		Loop the audio effect and continue playing it until it is manually stopped.
	 * @param push			Push the audio sound effect to other connected clients?
	 *
	 * @return				A Howl instance which controls audio playback.
	 *
	 * @example
	 * // Play the sound of a locked door for all players
	 * Audio.play({src: "sounds/lock.wav", volume: 0.8, autoplay: true, loop: false}, true);
	 */
	static play(
		data: {
			src: string,
			volume: number,
			autoplay: boolean,
			loop: boolean
		},
		push: boolean
	): howler.Howl;

	/**
	 * Create a Howl object and load it to be ready for later playback
	 * @param data	The audio data to preload
	 */
	static preload(data: any): void;

	/**
	 * Returns the volume value based on a range input volume control's position.
	 * This is using an exponential approximation of the logarithmic nature of audio level perception
	 * @param value   Value between [0, 1] of the range input
	 * @param order          [optional] the exponent of the curve (default: 1.5)
	 */
	static inputToVolume(control: number | string, order: number): number;

	/**
	 * Counterpart to inputToVolume()
	 * Returns the input range value based on a volume
	 * @param volume     Value between [0, 1] of the volume level
	 * @param order      [optional] the exponent of the curve (default: 1.5)
	 */
	static volumeToInput(volume: number, order: number): number;

	/**
	 * Returns a singleton AudioContext if one can be created.
	 * An audio context may not be available due to limited resources or browser compatibility
	 * in which case null will be returned
	 *
	 * @return A singleton AudioContext or null if one is not available
	 */
	getAudioContext(): AudioContext | null

	/**
	 * Registers a stream for periodic reports of audio levels.
	 * Once added, the callback will be called with the maximum decibel level of
	 * the audio tracks in that stream since the last time the event was fired.
	 * The interval needs to be a multiple of AudioHelper.levelAnalyserNativeInterval which defaults at 50ms
	 *
	 * @param id             An id to assign to this report. Can be used to stop reports
	 * @param stream         The MediaStream instance to report activity on.
	 * @param callback       The callback function to call with the decibel level. `callback(dbLevel)`
	 * @param interval       (optional) The interval at which to produce reports.
	 * @param smoothing      (optional) The smoothingTimeConstant to set on the audio analyser. Refer to AudioAnalyser API docs.
	 * @return Returns whether or not listening to the stream was successful
	 */
	startLevelReports(
		id: string,
		stream: MediaStream,
		callback: (maxDecibel: number, fftArray: Float32Array) => void,
		interval: 50,
		smoothing: 0.1
	): boolean;

	/**
	 * Stop sending audio level reports
	 * This stops listening to a stream and stops sending reports.
	 * If we aren't listening to any more streams, cancel the global analyser timer.
	 * @param id      The id of the reports that passed to startLevelReports.
	 */
	stopLevelReports(id: string): void;
}
