interface IState {
    user_id: string|null;
    displayName: string|null;
    accessToken?: string;
    homeserver?: string;
    pageName: string|null;
}

class Store {

    public state: IState = {
        user_id: null,
        displayName: null,
        pageName: null,
    };

    constructor() {
        // Read from storage
        this.userId = localStorage.getItem("matrix-presents.user_id");
        this.homeserver = localStorage.getItem("matrix-presents.homeserver") || undefined;
        this.accessToken = localStorage.getItem("matrix-presents.access_token") || undefined;
    }

    public get defaultHomeserver() {
        return 'https://matrix.org';
    }

    public set userId(userId: string|null) {
        this.state.user_id = userId;
        if (userId) {
            localStorage.setItem("matrix-presents.user_id", userId);
        }
    }

    public get userId(): string|null {
        return this.state.user_id;
    }

    public set pageName(name) {
        this.state.pageName = name;
    }

    public get pageName(): string|null {
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

    public get accessToken() {
        return this.state.accessToken;
    }

    public set homeserver(homeserver: string|undefined) {
        this.state.homeserver = homeserver;
        if (homeserver) {
            localStorage.setItem("matrix-presents.homeserver", homeserver);
        }
    }

    public get homeserver() {
        return this.state.homeserver;
    }

    public vapeLogin() {
        localStorage.removeItem("matrix-presents.access_token");
        localStorage.removeItem("matrix-presents.user_id");
        localStorage.removeItem("matrix-presents.homeserver");
        this.accessToken = undefined;
        this.userId = null;
        this.homeserver = undefined;
    }
}

export default new Store();
