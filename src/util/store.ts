interface IState {
    user_id: string|null;
    displayName: string|null;
}

class Store {
    public state: IState = {
        user_id: null,
        displayName: null,
    };

    public get defaultHomeserver() {
        return 'https://matrix.org';
    }

    public set userId(userId: string|null) {
        this.state.user_id = userId;
    }

    public get userId(): string|null {
        return this.state.user_id;
    }

    public set displayName(displayName: string|null) {
        this.state.displayName = displayName;
    }

    public get displayName(): string|null {
        return this.state.displayName;
    }
}

export default new Store();
