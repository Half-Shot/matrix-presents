declare module 'matrix-js-sdk' {

    export function createClient(url: string|{accessToken: string, baseUrl: string, userId: string}): MatrixClient;

    export interface LoginData {
        identifier: {
          type: "m.id.user";
          user: string;
        },
        password: string;
        initial_device_display_name?: string;
    }

    export class MatrixClient{
        login(loginType: string, data: LoginData): Promise<{user_id: string, access_token: string, device_id: string}>;
        logout(): Promise<void>;
        getProfileInfo(userId: string): Promise<{displayname: string|null, avatar_url: string|null}|null>;
        getOrCreateFilter(filterName: string, filter: Filter): Promise<string>;
        stopClient(): void;
        getRooms(): Room[];
        getRoom(roomId: string): Room;
        on(event: string, listener: (...params:[]) => any): MatrixClient;
        on(event: "sync", listener: (state: string, prevState: string, data: any) => void): MatrixClient;
        once(event: string, listener: (...params:[]) => any): MatrixClient;
        removeListener(event: string, listener: any): MatrixClient;
        getSyncState(): string|null;
    }
    export class AutoDiscovery {
        static findClientConfig(domain: string): Promise<DiscoveredClientConfig>;
    }

    export class DiscoveredClientConfig {
        constructor();
        "m.homeserver": {
            state: AutoDiscoveryState,
            error: AutoDiscoveryError|false,
            url: string,
        };
        "m.identity_server": {
            state: AutoDiscoveryState,
            url: string,
        };
    }

    export enum AutoDiscoveryState {
        /**
         * The auto discovery failed. The client is expected to communicate
         * the error to the user and refuse logging in.
         */
        FAIL_ERROR = "FAIL_ERROR",

        /**
         * The auto discovery failed, however the client may still recover
         * from the problem. The client is recommended to that the same
         * action it would for PROMPT while also warning the user about
         * what went wrong. The client may also treat this the same as
         * a FAIL_ERROR state.
         */
        FAIL_PROMPT = "FAIL_PROMPT",
        /**
         * The auto discovery didn't fail but did not find anything of
         * interest. The client is expected to prompt the user for more
         * information, or fail if it prefers.
         */
        PROMPT = "PROMPT",
        /**
         * The auto discovery was successful.
         */
        SUCCESS = "SUCCESS"
    }

    export enum AutoDiscoveryError {
        ERROR_INVALID = "Invalid homeserver discovery response",
        ERROR_GENERIC_FAILURE = "Failed to get autodiscovery configuration from server",
        ERROR_INVALID_HS_BASE_URL = "Invalid base_url for m.homeserver",
        ERROR_INVALID_HOMESERVER = "Homeserver URL does not appear to be a valid Matrix homeserver",
        ERROR_INVALID_IS_BASE_URL = "Invalid base_url for m.identity_server",
        ERROR_INVALID_IDENTITY_SERVER = "Identity server URL does not appear to be a valid identity server",
        ERROR_INVALID_IS = "Invalid identity server discovery response",
        ERROR_MISSING_WELLKNOWN = "No .well-known JSON file found",
        ERROR_INVALID_JSON = "Invalid JSON",
    }

    export class Filter {
        constructor(userId: string, filterId: string);
        setDefinition(def: any): void;
    }

    export class IndexedDBStore {
        constructor();
    }

    export class Room {
        findEventById(eventId: string): string;
        getLiveTimeline(): any;
    }
}
