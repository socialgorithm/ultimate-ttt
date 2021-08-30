export default function (error: any, data?: any): UTTTError;
declare class UTTTError extends Error {
    private code;
    constructor(message: string, code: number);
}
export {};
