import { Vector3 } from "three";
import { Easing, Tween } from "@tweenjs/tween.js";

import { createElement } from "../helpers";

import SceneManager from "../core/SceneManager";

import Player from "../entities/player";
import CoinEntity from "../entities/coin";

import Island from "../environment/Island";

import BaseScene from "./BaseScene";
import LevelOne from "./LevelOne";

export default class SplashScene extends BaseScene {
	private titleOpacity: number;
	private titleTween: Tween<any> | null = null;
	private hasFallen: boolean = false;

	constructor(camera: THREE.PerspectiveCamera, player: Player) {
		super(camera, player, "splash");

		this.titleOpacity = 0;

		this.init();
	}

	init() {
		this.player.isPlayable = false;

		this.player.position.y = 55;

		this.createUI();

		this.envs = [
			new Island(new Vector3(5, 5, 3), new Vector3(0, -1, 0)),
		];
		this.add(...this.envs);

		this.camera.position.y = 38
		this.camera.position.z = 7
		this.camera.rotation.x = -0.5

		const follow = setInterval(() => {
			this.camera.lookAt(this.player.position)
		})

		setTimeout(() => {				
			this.player.action(7, 1, 0)
		}, 100)

		const title = document.getElementById("title")

		title!.style.opacity = `${this.titleOpacity}`;

		setTimeout(() => {
			clearInterval(follow)

			this.titleTween = new Tween(this)
				.delay(500)
				.to({ titleOpacity: 1 }, 1600)
				.easing(Easing.Quadratic.InOut)
				.onUpdate(object => {
					title!.style.opacity = `${object.titleOpacity}`
				})
				.start();

			this.camera.position.y = 2;
			this.camera.position.z = 5;
			this.camera.rotation.x = -0.4;
		}, 2000)
	}

	createUI() {
		this.uiElements = [
			createElement('h1', {
				innerHTML: "Dungston",
				id: "title"
			}),
			createElement('button', {
				innerHTML: "Start",
				className: "splash-button",
				id: "start-button"
			}),
			createElement('button', {
				innerHTML: "Settings",
				className: "splash-button",
				id: "settings-button"
			}),
		];

		this.uiElements.forEach((element) => {
			element.addEventListener("click", this.handleUIChange.bind(this));
			document.body.prepend(element);
		});		
	}

	handleUIChange(event: Event) {
		const target = event.target as HTMLButtonElement;
		const buttonId = target.id;

		if (buttonId === "start-button") {
			SceneManager.getInstance().push(new LevelOne(this.camera, this.player));
		}
	}

	update(time: number) {
		const coinEntities = this.entities.filter(
			(entity) => entity instanceof CoinEntity
		) as CoinEntity[];

		this.titleTween?.update(time)

		this.player.update(time, coinEntities, this);

		// After player has fallen animate the impact and 
		if(this.player.position.y <= -1 && !this.hasFallen) {
			this.hasFallen = true;

			this.player.hasGravity = false;

			this.player.action(4, 0.8, false);
			
			setTimeout(() => {
				this.player.action(1, 0.75, true)
			}, 2000)
		}

		this.envs.forEach((env) => env.update(time));
	}

	override afterCleanUp(): void {
		this.player.hasGravity = true;
		this.player.camera = this.camera;
	}
}
