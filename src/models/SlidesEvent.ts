export const SlidesEventType = "uk.half-shot.presents.slides";

export interface SlidesEvent {
    type: "uk.half-shot.presents.slides";
    getContent: () => {
        slides: [],
    };
}
