interface State {
    userId: string|null;
    displayName: string|null;
    accessToken?: string;
    homeserver?: string;
    pageName: string|null;
    isGuest: boolean;
}

class Store {

    public state: State = {
        userId: null,
        displayName: null,
        pageName: null,
        isGuest: false,
    };

    constructor() {
        // Read from storage
        this.userId = localStorage.getItem("matrix-presents.user_id");
        this.homeserver = localStorage.getItem("matrix-presents.homeserver") || undefined;
        this.accessToken = localStorage.getItem("matrix-presents.access_token") || undefined;
        this.isGuest = localStorage.getItem("matrix-presents.is_guest") === "true" || false;
    }

    public get defaultHomeserver(): string {
        return "https://matrix.org";
    }

    public set userId(userId: string|null) {
        this.state.userId = userId;
        if (userId) {
            localStorage.setItem("matrix-presents.user_id", userId);
        }
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

    public set displayName(displayName: string|null) {
        this.state.displayName = displayName;
    }

    public get displayName(): string|null {
        return this.state.displayName;
    }

    public set accessToken(accessToken: string|undefined) {
        this.state.accessToken = accessToken;
        if (accessToken) {
            localStorage.setItem("matrix-presents.access_token", accessToken);
        }
    }

    public get accessToken(): string|undefined {
        return this.state.accessToken;
    }

    public set homeserver(homeserver: string|undefined) {
        this.state.homeserver = homeserver;
        if (homeserver) {
            localStorage.setItem("matrix-presents.homeserver", homeserver);
        }
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
        localStorage.removeItem("matrix-presents.access_token");
        localStorage.removeItem("matrix-presents.user_id");
        localStorage.removeItem("matrix-presents.homeserver");
        this.accessToken = undefined;
        this.userId = null;
        this.homeserver = undefined;
    }
}

export default new Store();
