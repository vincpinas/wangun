import {
	ACESFilmicToneMapping,
	sRGBEncoding,
	PerspectiveCamera,
	WebGLRenderer,
} from "three";

import Config from "./Config";
import SceneManager from "./SceneManager";

import SplashScene from "../scenes/SplashScene";

import Player from "../entities/player";

export default class Game {
	public config: Config;
	public renderer: WebGLRenderer;
	public camera: PerspectiveCamera;
	public sceneManager: SceneManager;

	private running: boolean;

	constructor() {
		this.config = Config.getInstance({ displayFPS: false })
		this.renderer = new WebGLRenderer({
			canvas: document.getElementById("app") as HTMLCanvasElement,
			antialias: true,
		});

		this.running = true;

		this.camera = new PerspectiveCamera(
			this.config.fov,
			window.innerWidth / window.innerHeight,
			1,
			this.config.renderDistance
		);

		const initialScene = new SplashScene(this.camera, new Player());
		this.sceneManager = SceneManager.getInstance(this, initialScene);


		this.initGame();
	}

	initGame() {
		// Setting initial values for renderer
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.shadowMap.enabled = true;

		this.renderer.toneMapping = ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.0;

		// Events to freeze or resume the game loop.
		addEventListener("freeze", () => (this.running = false));
		addEventListener("resume", () => (this.running = true));

		this.renderer.outputEncoding = sRGBEncoding;
	}

	update(time: number) {
		if (this.running) {
			this.sceneManager.current.update(time);
		}
	}
}
