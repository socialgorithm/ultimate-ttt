export interface Options {
    version?: boolean;
    verbose?: boolean;
    port?: string;
    gui?: boolean;
    local?: boolean;
    host?: string;
    a?: string;
    b?: string;
    games?: string;
    timeout?: string;
    help?: number;
}
export default function parseInput(): Options;
