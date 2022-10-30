import { PerspectiveCamera, WebGLRenderer } from "three";
import SplashScene from "../Scenes/SplashScene";
import BasicScene from "../Scenes/BasicScene";
import Config from "./Config";

export default class Game {
  public config: Config;
  public scene: BasicScene;
  public renderer: WebGLRenderer;
  public camera: PerspectiveCamera;

  constructor() {
    this.config = new Config();
    this.renderer = new WebGLRenderer({
      canvas: document.getElementById('app') as HTMLCanvasElement,
      antialias: true,
    });
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
    this.scene.update()
  }
}