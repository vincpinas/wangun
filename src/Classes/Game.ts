import { PerspectiveCamera, WebGLRenderer } from "three";
import SplashScene from "../Scenes/SplashScene";
import BasicScene from "../Scenes/BasicScene";
import Config from "./Config";
import FPSCounter from "./FPSCounter";

export default class Game {
  public config: Config;
  public scene: BasicScene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;
  public readonly fps: FPSCounter;

  constructor() {
    this.config = new Config();
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
      antialias: true,
    });
    this.fps = new FPSCounter(this.config.displayFPS);
    this.camera = new PerspectiveCamera(this.config.fov, window.innerWidth / window.innerHeight, 1, this.config.renderDistance);
    this.scene = new SplashScene(this.camera);
    this.initGame()
  }

  initGame() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true;
  }

  update() {
    this.scene.update();
  }
}