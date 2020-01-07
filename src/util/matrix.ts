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
    })
}

export function createGlobalClient() {
    // TODO: Guard this.
    return matrixClient = createClient({
        baseUrl: Store.homeserver!,
        accessToken: Store.accessToken!,
        userId: Store.userId!,
    });
}

export function getClient() {
    return matrixClient ? matrixClient : createGlobalClient();
}