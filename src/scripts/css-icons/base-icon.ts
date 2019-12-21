export class BaseIcon {
    private _backgroundColor: string;
    private _color: string;
    private _defaults = {
        size: 30,
        color: '#222',
        backgroundColor: '#fff',
    };
    private _size: number;

    constructor(sizeInPixels?: number, color?: string, backgroundColor?: string) {
        this._backgroundColor = backgroundColor || this._defaults.backgroundColor;
        this._color = color || this._defaults.color;
        this._size = sizeInPixels || this._defaults.size;
    }

    public get backgroundColor() {
        return this._backgroundColor;
    }

    public get color() {
        return this._color;
    }

    public get size() {
        return this._size;
    }
}
