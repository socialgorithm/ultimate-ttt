export interface Options {
    version?: boolean;
    verbose?: boolean;
    port?: number;
    gui?: boolean;
    host?: string;
    games?: number;
    timeout?: number;
    help?: number;
}
export declare const DEFAULT_OPTIONS: Options;
declare var _default: () => Options;
export default _default;
