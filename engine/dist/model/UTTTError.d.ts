export default class UTTTError extends Error {
    private code;
    constructor(message: string, code: number);
}
