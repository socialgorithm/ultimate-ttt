export const PLAYER_CONNECT = 'PLAYER_CONNECT';
export const PLAYER_DISCONNECT = 'PLAYER_DISCONNECT';

export const LOBBY_CREATE = 'LOBBY_CREATE';

export const LOBBY_JOIN = 'LOBBY_JOIN';

export const TOURNAMENT_START = 'TOURNAMENT_START';

export const UPDATE_STATS = 'UPDATE_STATS';
export const LOG = 'LOG';

export const MATCH_START = 'MATCH_START';
export const MATCH_END = 'MATCH_END';

export const GAME_START = 'GAME_START';
export const GAME_END = 'GAME_END';

export const success = (event: string): string => `${event}_SUCCESS`;
export const pending = (event: string): string => `${event}_PENDING`;
export const failure = (event: string): string => `${event}_FAILURE`;