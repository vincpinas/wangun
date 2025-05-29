import {
	Object3D,
	Vector3,
	BoxGeometry,
	MeshStandardMaterial,
	Mesh,
} from "three";

import Grass from "./Grass";
import TexturedPlane from "./TexturedPlane";

import GrassTexture from "../assets/textures/grass.jpg";


export default class Island extends Object3D {
	size: Vector3;
	position: Vector3;

	plane: TexturedPlane | null = null;
	grass: Grass | null = null;

	constructor(size: Vector3, position: Vector3) {
		super();

		this.size = size;
		this.position = position;

		this.init();
	}

	init() {
		const plane = new TexturedPlane(this.size.x, this.size.y, GrassTexture);
		const grass = new Grass((this.size.x * this.size.y) * 12, 0.12, 0.2, this.size.x * 2, this.size.y * 2);

		const islandGeometry = new BoxGeometry(this.size.x, this.size.z, this.size.y);
		const islandMaterial = new MeshStandardMaterial({ color: 0x4e2b16 });
		const island = new Mesh(islandGeometry, islandMaterial);
		island.position.set(0, -1.5099, 0);

		this.grass = grass;
		this.plane = plane;

        this.add(plane, grass, island)
	}

	update() {
		if(this.grass) this.grass.update();
	}
}
