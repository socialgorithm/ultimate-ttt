export default class UTTTError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}