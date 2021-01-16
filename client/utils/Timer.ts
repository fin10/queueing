import { Logger } from './Logger';

export interface TimeListener {
  onTime(): void;
}

export class Timer {
  private static readonly INTERVAL = 1000;

  private static id: NodeJS.Timeout | undefined;
  private static readonly listeners = new Set<TimeListener>();

  static addListener(listener: TimeListener): void {
    this.listeners.add(listener);

    if (this.listeners.size === 1) {
      this.start(this.INTERVAL);
    }
  }

  static removeListener(listener: TimeListener): void {
    this.listeners.delete(listener);

    if (this.listeners.size === 0) {
      this.stop();
    }
  }

  private static start(interval: number) {
    if (this.id) this.stop();

    this.id = setInterval(() => {
      this.listeners.forEach(async (listener) => listener.onTime());
    }, interval);

    Logger.debug(`Starting timer: id=${this.id}`);
  }

  private static stop() {
    if (this.id) {
      Logger.debug(`Stopped timer: id=${this.id}`);
      clearInterval(this.id);
      this.id = undefined;
    }
  }
}
