import * as THREE from "three";
import BaseScene from "./BaseScene";

import FPSCounter from "../ui/Fps";
import CoinCounter from "../ui/Coins";

import Island from "../environment/Island";

import Player from "../entities/player";
import CoinEntity from "../entities/coin";
import Config from "../core/Config";

class LevelOne extends BaseScene {
	constructor(camera: THREE.PerspectiveCamera, player: Player) {
		super(camera, player, "level-one");

		this.init();

		this.createUI();
	}

	init() {
		this.player.hasGravity = true;
		this.player.camera = this.camera;
		this.player.isPlayable = true;
		this.player.position.y = 10;

		this.envs = [
			new Island(new THREE.Vector3(20, 20, 3), new THREE.Vector3(0, 0, 0)),
			new Island(new THREE.Vector3(5, 20, 3), new THREE.Vector3(5, -5, -24)),
			new Island(new THREE.Vector3(13, 15, 3), new THREE.Vector3(-10, 0.5, -50)),
			new Island(new THREE.Vector3(13, 8, 3), new THREE.Vector3(5, -12, -70)),
			new Island(new THREE.Vector3(13, 8, 3), new THREE.Vector3(-5, -8, -85)),
			new Island(new THREE.Vector3(13, 8, 3), new THREE.Vector3(5, -10, -89)),
			new Island(new THREE.Vector3(6, 6, 3), new THREE.Vector3(-12, -5, -99)),
			new Island(
				new THREE.Vector3(2.5, 20, 3),
				new THREE.Vector3(-12, -2, -108)
			),
			new Island(new THREE.Vector3(10, 10, 3), new THREE.Vector3(-12, -6, -125)),
			new Island(new THREE.Vector3(10, 10, 3), new THREE.Vector3(-12, 1, -125)),
			new Island(new THREE.Vector3(8, 8, 3), new THREE.Vector3(-12, 1, -150)),
		];
		this.add(...this.envs);

		this.entities = [
			// First island
			new CoinEntity(5, 1, -5),
			new CoinEntity(-5, 1, 5),
			// Last island
			new CoinEntity(-12, -5, -125),
			// new CoinEntity(),
		];
		this.add(...this.entities);
	}

	createUI() {
		const config = Config.getInstance();

		this.uiClassRefs = [
			new FPSCounter(config.displayFPS),
			new CoinCounter(true),
		];
		this.uiElements = this.uiClassRefs.map((ref: any) => {
			return ref.element;
		});
	}

	update(time: number) {
		const coinEntities = this.entities.filter(
			(entity) => entity instanceof CoinEntity
		) as CoinEntity[];

		this.uiClassRefs.forEach((ref: any) => ref.update(time));
		this.player.update(time, coinEntities, this);
		this.entities.forEach((ent) => ent.update());
		this.envs.forEach((env) => {
			env.update(time);
		});
	}
}

export default LevelOne;