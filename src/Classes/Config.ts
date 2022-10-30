export default class Config {
  public fov: number;
  public readonly pixelRatio: number;
  public readonly renderDistance: number;

  constructor(options?: any) {
    this.fov = options?.fov || 90;

    this.pixelRatio = 2.3;

    this.renderDistance = 1000
    
  }
}