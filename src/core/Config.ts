export default class Config {
  public fov: number;
  public readonly pixelRatio: number;
  public renderDistance: number;
  public displayFPS: boolean;

  private static _instance: Config | null = null;
  
  private constructor(configOptions?: ConfigOptions) {
    this.pixelRatio = 0;
    this.renderDistance = 100;
    this.fov = configOptions?.fov || 90;
    this.displayFPS = configOptions?.displayFPS || false;
  }

  static getInstance(configOptions?: ConfigOptions): Config {
    if (!Config._instance) {
      Config._instance = new Config(configOptions);
    }
    return Config._instance;
  }

  set(option: keyof ConfigOptions, value: unknown) {
    this[option] = value as never;
  }
}