export class BaseIcon {
    private _backgroundColor: string;
    private _baseBackgroundColor: string;
    private _baseColor: string;
    private _color: string;
    private _defaults = {
        size: 30,
        color: '#222',
        backgroundColor: '#fff',
        invert: false,
    };
    private _invert: boolean;
    private _size: number;

    constructor(sizeInPixels?: number, color?: string, invert?: boolean) {
        this._baseBackgroundColor = (this._backgroundColor || this._defaults.backgroundColor);
        this._baseColor = (color || this._defaults.color);

        this._color = invert === true ? (this._backgroundColor || this._defaults.backgroundColor) : (color || this._defaults.color);
        this._invert = typeof(invert) === 'boolean' ? invert : this._defaults.invert;
        this._size = sizeInPixels || this._defaults.size;
    }

    public get backgroundColor() {
        if (this._invert) {
            return this._baseColor;
        }

        return this._baseBackgroundColor;
    }

    public get color() {
        return this._color;
    }

    public get invert() {
        return this._invert;
    }

    public get size() {
        return this._size;
    }
}
