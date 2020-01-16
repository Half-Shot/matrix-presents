export const PositionEventType = "uk.half-shot.presents.position";

export interface PositionEvent {
    type: "uk.half-shot.presents.position";
    getContent: () => {
        event_id: string,
    };
}
