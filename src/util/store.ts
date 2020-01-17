interface State {
    userId: string|null;
    displayName?: string;
    accessToken?: string;
    homeserver?: string;
    deviceId?: string;
    pageName: string|null;
    isGuest: boolean;
}

class Store {

    public state: State = {
        userId: null,
        pageName: null,
        isGuest: false,
    };

    constructor() {
        // Read from storage
        this.displayName = sessionStorage.getItem("matrix-presents.displayname") || undefined;
        this.userId = localStorage.getItem("matrix-presents.user_id");
        this.homeserver = localStorage.getItem("matrix-presents.homeserver") || undefined;
        this.accessToken = localStorage.getItem("matrix-presents.access_token") || undefined;
        this.deviceId = localStorage.getItem("matrix-presents.device_id") || undefined;
        this.isGuest = localStorage.getItem("matrix-presents.is_guest") === "true" || false;
    }

    public get defaultHomeserver(): string {
        return "https://matrix.org";
    }

    public set userId(userId: string|null) {
        this.state.userId = userId;
        if (userId) {
            localStorage.setItem("matrix-presents.user_id", userId);
            return;
        }
        localStorage.removeItem("matrix-presents.user_id");
    }

    public get userId(): string|null {
        return this.state.userId;
    }

    public set pageName(name) {
        document.title = this.state.pageName || "matrix-presents";
        this.state.pageName = name;
    }

    public get pageName(): string|null {
        // TODO: maybe not a great place to hook it
        return this.state.pageName;
    }

    public set displayName(displayName: string|undefined) {
        this.state.displayName = displayName;
        if (displayName) {
            sessionStorage.setItem("matrix-presents.displayname", displayName);
            return;
        }
        sessionStorage.removeItem("matrix-presents.displayname");
    }

    public get displayName(): string|undefined {
        return this.state.displayName;
    }

    public set accessToken(accessToken: string|undefined) {
        this.state.accessToken = accessToken;
        if (accessToken) {
            localStorage.setItem("matrix-presents.access_token", accessToken);
            return;
        }
        localStorage.removeItem("matrix-presents.device_id");
    }

    public get accessToken(): string|undefined {
        return this.state.accessToken;
    }

    public set deviceId(deviceId: string|undefined) {
        this.state.deviceId = deviceId;
        if (deviceId) {
            localStorage.setItem("matrix-presents.device_id", deviceId);
            return;
        }
        localStorage.removeItem("matrix-presents.device_id");
    }

    public get deviceId(): string|undefined {
        return this.state.deviceId;
    }

    public set homeserver(homeserver: string|undefined) {
        this.state.homeserver = homeserver;
        if (homeserver) {
            localStorage.setItem("matrix-presents.homeserver", homeserver);
            return;
        }
        localStorage.removeItem("matrix-presents.homeserver");
    }

    public get homeserver(): string|undefined {
        return this.state.homeserver;
    }

    public set isGuest(isGuest: boolean) {
        this.state.isGuest = isGuest;
        localStorage.setItem("matrix-presents.is_guest", isGuest.toString());
    }

    public get isGuest(): boolean {
        return this.state.isGuest;
    }

    public vapeLogin(): void {
        this.accessToken = undefined;
        this.userId = null;
        this.homeserver = undefined;
        this.isGuest = true; // Sort of wrong.
        this.deviceId = undefined;
        this.displayName = undefined;
    }
}

export default new Store();
