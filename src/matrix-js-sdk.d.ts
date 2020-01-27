/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "matrix-js-sdk" {

    export function createClient(opts: {
        accessToken?: string,
        baseUrl: string,
        userId?: string,
        deviceId?: string,
        store?: IndexedDBStore,
    }): MatrixClient;

    export interface LoginData {
        identifier: {
          type: "m.id.user";
          user: string;
        };
        password: string;
        initial_device_display_name?: string;
    }

    export class MatrixEvent {
        constructor(evData: unknown);
        getId(): string;
        getSender(): RoomMember;
        getType(): string;
        getRoomId(): string;
        getTs(): number;
        getContent(): any;
        getStateKey(): string|undefined;
        isState(): boolean;
    }

    export class MatrixClient {
        public store: {
            deleteAllData(): Promise<void>;
        };
        public login(loginType: string, data: LoginData): Promise<{user_id: string, access_token: string, device_id: string}>;
        public logout(): Promise<void>;
        public getProfileInfo(userId: string): Promise<{displayname: string|null, avatar_url: string|null}|null>;
        public getOrCreateFilter(filterName: string, filter: Filter): Promise<string>;
        public stopClient(): void;
        public getRooms(): Room[];
        public getRoom(roomId: string): Room;
        public joinRoom(roomIdOrAlias: string): Promise<{room_id: string}>;
        public getRoomIdForAlias(alias: string): Promise<{room_id: string}>;
        public on(event: string, listener: (...params: []) => any): MatrixClient;
        public on(event: "sync", listener: (state: string, prevState: string, data: any) => void): MatrixClient;
        public on(event: "event", listener: (event: MatrixEvent) => void): MatrixClient;
        public on(event: "Room.name", listener: (room: Room) => void): MatrixClient;
        public once(event: "Room", listener: (room: Room) => void): MatrixClient;
        public once(event: string, listener: (...params: []) => any): MatrixClient;
        public removeListener(event: string, listener: any): MatrixClient;
        public getSyncState(): string|null;
        public getHomeserverUrl(): string;
        public mxcUrlToHttp(url: string): string;
        public sendStateEvent(roomId: string, eventType: string, content: any, stateKey: string|""): Promise<string>;
        public getUserId(): string;
        public fetchRoomEvent(roomId: string, eventId: string): Promise<MatrixEvent>;
        public registerGuest(): Promise<any>;
        public startClient(): void;
        public setGuest(isGuest: boolean): void;
    }
    export class AutoDiscovery {
        public static findClientConfig(domain: string): Promise<DiscoveredClientConfig>;
    }

    export class DiscoveredClientConfig {
        public "m.homeserver": {
            state: AutoDiscoveryState,
            error: AutoDiscoveryError|false,
            url: string,
        };
        public "m.identity_server": {
            state: AutoDiscoveryState,
            url: string,
        };
        constructor();
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
        SUCCESS = "SUCCESS",
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
        public setDefinition(def: any): void;
    }

    export class IndexedDBStore {
        constructor(opts: {
            indexedDB: IDBFactory
        });
        startup(): Promise<void>;
    }

    export class RoomMember {
        public readonly rawDisplayName: string;
        public getAvatarUrl(baseUrl: string, width: number, height: number, resizeMethod: "crop"|"scale"): string;
    }

    export class RoomState {
        maySendEvent(eventType: string, userId: string): boolean;
        maySendStateEvent(eventType: string, userId: string): boolean;
        getStateEvents(eventType: string, stateKey: string): MatrixEvent | MatrixEvent[];
    }

    export class Room {
        public readonly roomId: string;
        public readonly name: string;
        public readonly _client: MatrixClient;
        public readonly myUserId: string;
        public readonly currentState: RoomState;
        public findEventById(eventId: string): string;
        public getLiveTimeline(): any;
        public getMember(userId: string): RoomMember;
        public getMembersWithMembership(membership: string): RoomMember[];
    }
}
