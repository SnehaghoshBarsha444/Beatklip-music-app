
declare namespace YT {
  class Player {
    constructor(
      container: HTMLElement | string,
      options: {
        videoId?: string;
        width?: number | string;
        height?: number | string;
        playerVars?: {
          autoplay?: 0 | 1;
          cc_load_policy?: 0 | 1;
          color?: 'red' | 'white';
          controls?: 0 | 1 | 2;
          disablekb?: 0 | 1;
          enablejsapi?: 0 | 1;
          end?: number;
          fs?: 0 | 1;
          hl?: string;
          iv_load_policy?: 1 | 3;
          list?: string;
          listType?: 'playlist' | 'search' | 'user_uploads';
          loop?: 0 | 1;
          modestbranding?: 0 | 1;
          origin?: string;
          playlist?: string;
          playsinline?: 0 | 1;
          rel?: 0 | 1;
          start?: number;
          widget_referrer?: string;
        };
        events?: {
          onReady?: (event: { target: Player }) => void;
          onStateChange?: (event: { target: Player; data: number }) => void;
          onPlaybackQualityChange?: (event: { target: Player; data: string }) => void;
          onPlaybackRateChange?: (event: { target: Player; data: number }) => void;
          onError?: (event: { target: Player; data: number }) => void;
          onApiChange?: (event: { target: Player }) => void;
        };
      }
    );

    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    clearVideo(): void;
    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    setSize(width: number, height: number): void;
    getVideoLoadedFraction(): number;
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
    getPlaylist(): string[];
    getPlaylistIndex(): number;
    addEventListener(event: string, listener: (event: any) => void): void;
    removeEventListener(event: string, listener: (event: any) => void): void;
    getIframe(): HTMLIFrameElement;
    destroy(): void;
  }

  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
