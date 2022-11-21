export default class Config {
  public fov: number;
  public readonly pixelRatio: number;
  public readonly renderDistance: number;
  public displayFPS: boolean;

  constructor(options?: any) {
    this.fov = options?.fov || 90;

    this.pixelRatio = 3;

    this.renderDistance = 1000

    this.displayFPS = options?.displayFPS || false;
    
  }
}