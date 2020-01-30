import { AutoDiscovery, createClient, MatrixClient, IndexedDBStore, MatrixEvent } from "matrix-js-sdk";
import Store from "./store";

let matrixClient: MatrixClient|undefined;

export async function discoverHomeserver(domain: string) {
    return (await AutoDiscovery.findClientConfig(domain))["m.homeserver"];
}

export async function loginToMatrix(homeserver: string, username: string, password: string) {
    return createClient({ baseUrl: homeserver }).login("m.login.password", {
        identifier: {
            type: "m.id.user",
            user: username,
        },
        password,
    });
}

export async function registerGuestIfNotLoggedIn(suggestedHs: string|null) {
    // Create a guest
    if (Store.accessToken) {
        return;
    }
    if (suggestedHs && !suggestedHs.startsWith("http")) {
        suggestedHs = `https://${suggestedHs}`;
    }
    const baseUrl = suggestedHs || Store.homeserver || Store.defaultHomeserver;
    console.log(`Creating a guest account on ${baseUrl}`);
    const res = await createClient({
        baseUrl,
    }).registerGuest();
    Store.accessToken = res.access_token;
    Store.userId = res.user_id;
    Store.homeserver = baseUrl;
    Store.isGuest = true;
}

export function createGlobalClient() {
    if (!Store.homeserver) {
        throw Error("Tried to createGlobalClient, but Store.homeserver is not set");
    }
    const store = new IndexedDBStore({
        indexedDB: window.indexedDB,
    });
    store.startup();
    matrixClient = createClient({
        baseUrl: Store.homeserver,
        accessToken: Store.accessToken,
        userId: Store.userId || undefined,
        deviceId: Store.deviceId,
        store,
        unstableClientRelationAggregation: true,
        timelineSupport: true,
    });

    // XXX: Super naughty aggregations api.
    matrixClient._mpAggregations = async function (roomId: string, eventId: string) {
        return this._http.authedRequest(
            undefined,
            "GET",
            `/rooms/${encodeURIComponent(roomId)}/aggregations/${encodeURIComponent(eventId)}/m.annotation/m.reaction`,
            undefined,
            undefined,
            { prefix: "/_matrix/client/unstable" },
        );
    };
    matrixClient._mpRelation = async function (roomId: string, eventId: string, emoji: string) {
        return this._http.authedRequest(
            undefined,
            "POST",
            `/rooms/${encodeURIComponent(roomId)}/send_relation/${encodeURIComponent(eventId)}/m.annotation/m.reaction?key=${emoji}`,
            undefined,
            {},
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).mxClient = matrixClient;

    matrixClient.setGuest(Store.isGuest);
    return matrixClient;
}

export function getClient() {
    return matrixClient ? matrixClient : createGlobalClient();
}

const eventCache: Map<string, MatrixEvent> = new Map();

export async function getMatrixEvent(roomId: string, eventId: string) {
    const key = `${roomId} ${eventId}`;
    const existing = eventCache.get(key);
    if (existing) {
        console.log(`Got cached event ${key}`);
        return existing;
    }
    const client = getClient();
    const ev = new MatrixEvent(await client.fetchRoomEvent(
        roomId,
        eventId,
    ));
    console.log(`Got non-cached event ${key}`);
    eventCache.set(key, ev);
    return ev;
}


export async function logoutClient() {
    try {
        Store.vapeLogin();
        const existingClient = getClient();
        if (existingClient) {
            existingClient.stopClient();
            await existingClient.store.deleteAllData();
            existingClient.logout().catch((ex) => {
                console.log("Could not logout:", ex);
            });
            console.log("Destroyed existing client");
        }
    } catch (ex) {
        console.log("Failed to /logout", ex);
    }
    matrixClient = undefined;
}