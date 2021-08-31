export default class UTTTError extends Error {

    constructor(message: string, private code: number) {
        super(message);
        this.code = code;
    }

}