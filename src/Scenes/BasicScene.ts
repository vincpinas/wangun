import * as THREE from 'three';
import { FogExp2 } from 'three';
import DLightShadow from '../Classes/Environment/DLightShadow';
import TexturedPlane from '../Classes/Environment/TexturedPlane';

export default class BasicScene extends THREE.Scene {
  public camera: THREE.PerspectiveCamera;
  public light: DLightShadow;

  constructor(camera: THREE.PerspectiveCamera) {
    super();
    this.camera = camera;
    this.light = new DLightShadow(50, .5, true);
    this.initBScene();
  }

  initBScene() {
    this.background = new THREE.Color(0xbfe3dd);
    this.fog = new FogExp2(0xefd1b5, 0.01);

    const ambient = new THREE.AmbientLight(0xffffff, .63);
    this.add(ambient);

    // Direction camera with shadow casting enabled.
    this.light.position.set(-500, 1500, -1500);
    this.add(this.light);

    // Textured plane with shadow receiving and a MeshPhongMaterial on by default.
    const plane = new TexturedPlane(50, 50, "./assets/textures/checkerboard.png")
    this.add(plane);

    this.camera.position.z = 6.5
    this.camera.position.y = this.camera.position.z / 2
    this.camera.rotation.x = -0.4
  }

  update() {
    
  }
}