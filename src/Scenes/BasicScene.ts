import * as THREE from 'three';
import { FogExp2 } from 'three';
import DLightShadow from '../Classes/Environment/DLightShadow';
import TexturedPlane from '../Classes/Environment/TexturedPlane';
import checkerboard from '../assets/textures/checkerboard.png'
import Player from '../Classes/Entities/Player';

export default class BasicScene extends THREE.Scene {
  protected camera: THREE.PerspectiveCamera;
  protected light: DLightShadow;
  protected player: Player;
  public name: string;

  constructor(camera: THREE.PerspectiveCamera,  player: Player, sceneName: string) {
    super();
    this.name = sceneName;
    this.player = player;
    this.camera = camera;
    this.light = new DLightShadow(50, .5, true);
    this.initBScene();
  }

  initBScene() {
    this.player.add(this.camera)
    this.player.castShadow = true;

    this.add(this.player)

    this.background = new THREE.Color(0xbfe3dd);
    this.fog = new FogExp2(0xefd1b5, 0.01);

    const ambient = new THREE.AmbientLight(0xffffff, .63);
    this.add(ambient);

    // Direction camera with shadow casting enabled.
    this.light.position.set(-500, 1500, -1500);
    this.add(this.light);

    // Textured plane with shadow receiving and a MeshPhongMaterial on by default.
    const plane = new TexturedPlane(50, 50, checkerboard)
    this.add(plane);

    this.camera.position.z = 5
    this.camera.position.y = 2
    this.camera.rotation.x = -0.4
  }

  update() {
    
  }
}