import { PerspectiveCamera, WebGLRenderer } from "three";
import SplashScene from "../Scenes/SplashScene";
import BasicScene from "../Scenes/BasicScene";
import Config from "./Config";
import FPSCounter from "./FPSCounter";
import Player from "./Entities/Player";

export default class Game {
  public config: Config;
  public scene: BasicScene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;
  public readonly fps: FPSCounter;
  private running: boolean;

  constructor() {
    this.config = new Config({ displayFPS: true });
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
      antialias: true,
    });
    this.running = true;
    this.fps = new FPSCounter(this.config.displayFPS);
    this.camera = new PerspectiveCamera(this.config.fov, window.innerWidth / window.innerHeight, 1, this.config.renderDistance);
    this.scene = new SplashScene(this.camera, new Player());
    this.initGame()
  }

  initGame() {
    // Setting initial values for renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true;

    // Events to freeze or resume the game loop.
    addEventListener('freeze', () => this.running = false);
    addEventListener('resume', () => this.running = true);
  }

  update() {
    if (this.running) {
      this.scene.update();
    }
  }
}