import { AutoDiscovery, createClient, MatrixClient } from "matrix-js-sdk";
import Store from "./store";

let matrixClient: MatrixClient;

export async function discoverHomeserver(domain: string) {
    return (await AutoDiscovery.findClientConfig(domain))["m.homeserver"];
}

export async function loginToMatrix(homeserver: string, username: string, password: string) {
    return createClient(homeserver).login("m.login.password", {
        identifier: {
            type: "m.id.user",
            user: username,
        },
        password,
    });
}

export async function registerGuestIfNotLoggedIn(suggestedHs?: string) {
    // Create a guest
    if (Store.accessToken) {
        return;
    }
    console.log("Creating a guest account");
    const baseUrl = Store.homeserver || suggestedHs || Store.defaultHomeserver;
    const res = await createClient({
        baseUrl,
    }).registerGuest();
    Store.accessToken = res.access_token;
    Store.userId = res.user_id;
    Store.homeserver = baseUrl;
    Store.isGuest = true;
}

export function createGlobalClient() {
    matrixClient = createClient({
        baseUrl: Store.homeserver!,
        accessToken: Store.accessToken!,
        userId: Store.userId!,
    });
    window.mxClient = matrixClient;
    matrixClient.setGuest(Store.isGuest);
    console.log(Store.isGuest);
    return matrixClient;
}

export function getClient() {
    return matrixClient ? matrixClient : createGlobalClient();
}
