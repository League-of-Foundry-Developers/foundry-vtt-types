/**
 * An interface for options for the `ImageHelper.createThumbnail()` and
 * `ImageHelper.compositeCanvasTexture()` methods.
 */
declare interface CompositeOptions {
	/**
	 * The desired width of the output texture
	 */
	width?: number,

	/**
	 * The desired height of the output texture
	 */
	height?: number,

	/**
	 * A horizontal translation to apply to the object
	 */
	tx?: number,

	/**
	 * A vertical translation to apply to the object
	 */
	ty?: number,

	/**
	 * Center the texture in the rendered frame?
	 * @defaultValue `true`
	 */
	center?: boolean
}

/**
 * An interface for return values of the `ImageHelper.createThumbnail()` method.
 */
declare interface ThumbnailReturn {
	/**
	 * The originally passed `string` URL or `PIXI.DisplayObject`
	 */
	src: string | PIXI.DisplayObject,

	/**
	 * The `PIXI.Texture,` returned from `compositeCanvasTexture()`, with `destroy(true)` already called on it.
	 */
	texture: PIXI.Texture,

	/**
	 * The base64 encoded image data, returned from `textureToImage()`
	 */
	thumb: string,

	/**
	 * The width of the `PIXI.Sprite`, created by `createThumbnail()`
	 */
	width: number,

	/**
	 * The height of the `PIXI.Sprite`, created by `createThumbnail()`
	 */
	height: number
}

/**
 * A helper class to provide common functionality for working with Image objects
 */
declare class ImageHelper {
	/**
	 * Create thumbnail preview for a provided image path.
	 * @param src The string URL or `PIXI.DisplayObject` of the texture to render to a thumbnail
	 * @param options Additional named options passed to the `compositeCanvasTexture()` method; defaults to `{}`
	 * @return The parsed and converted thumbnail data
	 */
	static createThumbnail(src: string | PIXI.DisplayObject, options?: CompositeOptions): Promise<ThumbnailReturn>;

	/**
	 * Composite a canvas object by rendering it to a single texture
	 *
	 * @param object The `PIXI.DisplayObject` to render to a texture
	 * @param options Additional named options; defaults to `{}`
	 * @return The composite Texture object
	 */
	static compositeCanvasTexture(object: PIXI.DisplayObject, options?: CompositeOptions): PIXI.Texture;

	/**
	 * Extract a texture to a base64 PNG string
	 * @param texture The PIXI.Texture object to extract
	 * @return A base64 png string of the texture
	 */
	static textureToImage(texture: PIXI.Texture): string;
}
