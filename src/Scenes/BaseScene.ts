import * as THREE from "three";
import { FogExp2 } from "three";
import DLightShadow from "../environment/DLightShadow";
import Player from "../entities/player";
import Entity from "../entities/entity";
import BaseUI from "../ui/BaseUI";

export default class BaseScene extends THREE.Scene {
	protected camera: THREE.PerspectiveCamera;
	protected light: DLightShadow;
	protected ambient: THREE.AmbientLight;

	public name: string;
	
	public player: Player;
	public envs: any[] = [];
	public entities: Entity[] = [];
	public uiElements: HTMLElement[] = [];

	protected uiClassRefs: BaseUI[] = [];

	constructor(
		camera: THREE.PerspectiveCamera,
		player: Player,
		sceneName: string
	) {
		super();
		this.name = sceneName;
		this.player = player;
		this.camera = camera;
		this.light = new DLightShadow(50, 0.15);
		this.ambient = new THREE.AmbientLight(0xffffff, 0.25);

		this.initBaseScene();
	}

	initBaseScene() {
		this.player.castShadow = true;

		this.add(this.player);

		this.background = new THREE.Color(0xbfe3dd);
		this.fog = new FogExp2(0xefd1b5, 0.005);

		// Direction camera with shadow casting enabled.
		this.light.position.set(-500, 1500, -1500);

		this.add(this.light);
		this.add(this.ambient);
	}

	removeEntity(entity: Entity) {
		const index = this.entities.indexOf(entity);
		if (index > -1) {
			this.entities.splice(index, 1);
		}
	}

	/**
	 * Cleans up the scene by removing all children, disposing geometries, materials, and textures.
	 * Also clears the entities and envs arrays.
	 */
	cleanUp() {
		// Remove all children from the scene
		while (this.children.length > 0) {
			const child = this.children[0];
			this.remove(child);

			// Dispose geometries, materials, and textures if possible
			if ((child as any).geometry) {
				(child as any).geometry.dispose?.();
			}
			if ((child as any).material) {
				// Some objects have an array of materials
				if (Array.isArray((child as any).material)) {
					(child as any).material.forEach((mat: any) => mat.dispose?.());
				} else {
					(child as any).material.dispose?.();
				}
			}
			// Dispose textures if present
			if ((child as any).material && (child as any).material.map) {
				(child as any).material.map.dispose?.();
			}
		}

		this.uiElements.forEach((element) => {
			document.body.removeChild(element);
		});

		// Clear entities and envs arrays
		this.entities.length = 0;
		this.envs.length = 0;
		this.uiElements.length = 0;

		this.afterCleanUp();
	}

	afterCleanUp() {}

	/**
	 * Destroys the scene, cleaning up all resources and dereferencing key properties for GC.
	 */
	destroy() {
		this.cleanUp();

		// Remove references to player, camera, light, ambient for GC
		(this.player as any) = null;
		(this.camera as any) = null;
		(this.light as any) = null;
		(this.ambient as any) = null;
		this.name = "";
		this.envs = [];
		this.entities = [];
	}

	update(_time: number) {}
}
