import { EffectComposer, RenderPass } from "postprocessing";
import { PerspectiveCamera, WebGLRenderer, Scene } from "three";

class RenderManager {
	private static _instance: RenderManager | null = null;
	public composer!: EffectComposer;
	public renderPass!: RenderPass;

	private constructor() {}

	static getInstance(): RenderManager {
		if (!RenderManager._instance) {
			RenderManager._instance = new RenderManager();
		}
		return RenderManager._instance;
	}

	init(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
		this.composer = new EffectComposer(renderer);
		this.renderPass = new RenderPass(scene, camera);
		this.composer.addPass(this.renderPass);
	}

	setScene(scene: Scene) {
		if (this.renderPass) {
			this.renderPass.mainScene = scene;
		}
	}
}

export default RenderManager;
