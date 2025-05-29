import BaseScene from "../scenes/BaseScene";
import Game from "./Game";
import RenderManager from './RenderManager';

import { createElement } from "../helpers";

class SceneManager {
	public current: BaseScene;
	public gameLoop: Game;

	private static _instance: SceneManager | null = null;

	private constructor(gameLoop: Game, initialState: BaseScene) {
		this.gameLoop = gameLoop;
		this.current = initialState;
	}

	static getInstance(gameLoop?: Game, initialState?: BaseScene): SceneManager {
		if (!SceneManager._instance) {
			if(!gameLoop) {
				throw new Error("Game loop must be provided for the first instantiation.");
			}
			if (!initialState) {
				throw new Error("Initial state must be provided for the first instantiation.");
			}
			SceneManager._instance = new SceneManager(gameLoop, initialState);
		}
		return SceneManager._instance;
	}

	transition(duration: number) {
		const transPanel = createElement("div", {
			className: "transition-panel animated",
			style: {
				animation: `fade-in-out ${duration}ms forwards`
			}
		});

		document.body.prepend(transPanel);
		
		setTimeout(() => {
			document.body.removeChild(transPanel);
		}, duration);
	}
	
	push(scene: BaseScene, duration: number = 2000) {
		this.transition(duration);

		setTimeout(() => {
			// Clean up the old scene
			if (this.current) {
				this.current.destroy();
			}
			
			// Set the new scene
			this.current = scene;

			// Update the RenderPass to use the new scene
			RenderManager.getInstance().setScene(scene);
		}, duration / 1.5);
	}
}

export default SceneManager;
