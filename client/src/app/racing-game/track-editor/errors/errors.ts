

export class TrackNotFound extends Error {
    public constructor() {
        super();
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, TrackNotFound);
        }
    }

    public handleError(): void {
        // TODO ne pas traiter si trackData est vide et faire quoi.. ? popup?
    }
}

