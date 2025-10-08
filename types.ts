
export enum AppStatus {
    IDLE = 'IDLE',
    FILE_SELECTED = 'FILE_SELECTED',
    LOADING = 'LOADING',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
}

export type IdleState = { status: AppStatus.IDLE };
export type FileSelectedState = { status: AppStatus.FILE_SELECTED; file: File; originalVideoUrl: string };
export type LoadingState = { status: AppStatus.LOADING; file: File; originalVideoUrl: string; };
export type CompletedState = { status: AppStatus.COMPLETED; file: File; originalVideoUrl: string; generatedVideoUrl: string };
export type ErrorState = { status: AppStatus.ERROR; file: File; originalVideoUrl: string; error: string };

export type AppState = IdleState | FileSelectedState | LoadingState | CompletedState | ErrorState;

export interface FrameData {
    base64: string;
    mimeType: string;
}
