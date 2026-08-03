declare class RobotMonitor {
  constructor(options?: object);
  
  highlightElement: Array<any>;
  isPaused: boolean;
  pauseResolve: Function | null;
  delayState: {
    isDelaying: boolean;
    startTime: number;
    totalTime: number;
    elapsedTime: number;
    resolve: Function | null;
  };
  delayTimer: number | null;
  API_URL: string;
  audioPlayerObj: {
    blob: Blob | null;
    url: string | null;
    audioPlayer: HTMLAudioElement | null;
    isover: boolean;
  };

  loadAndPlayAudio(id: string, msgJSON: object): Promise<void>;
  setPause(paused: boolean): void;
  checkPause(): Promise<void>;
  handleLightEle(item: object, element: HTMLElement | null): void;
  readonly init: {
    initDarkEle: () => void;
  };
  controlModelFn(res: object): Promise<void>;
  delayWithPause(ms: number): Promise<void>;
  startDelay(): void;
  freezeDelay(): void;
  resumeDelay(): void;
  finishDelay(): void;
  performAction(item: object): Promise<void>;
  delay(ms: number): Promise<void>;
  stopAllActions(): void;
}

export default RobotMonitor;