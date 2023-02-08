import { BoxGeometry, Mesh, Color, MeshStandardMaterial, CubeTextureLoader, Object3D } from 'three';
import px from '../../assets/textures/cube/coin/px.jpg';
import nx from '../../assets/textures/cube/coin/nx.jpg';
import py from '../../assets/textures/cube/coin/py.jpg';
import ny from '../../assets/textures/cube/coin/ny.jpg';
import pz from '../../assets/textures/cube/coin/pz.jpg';
import nz from '../../assets/textures/cube/coin/nz.jpg';

export default class Player extends Object3D {
  private readonly keyDown = new Set<string>();
  private readonly speedmod: number;

  constructor() {
    super();
    this.speedmod = 0.25;
    this.init();
  }

  init() {
    // Adding a player model
    this.add(new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({
        color: new Color().setHex(0xd6d6d6),
        roughness: .35,
        metalness: .65,
        envMap: new CubeTextureLoader().load([px, nx, py, ny, pz, nz]),
        envMapIntensity: 1,
        transparent: true,
        opacity: .9,
      })
    ))

    // Initial position above the ground in the scene.
    this.position.y = 1 / 2;
    this.castShadow = true;
    this.receiveShadow = true;

    // Checking current pressed keys
    addEventListener('keydown', (e) => this.handleKeyDown(e));
    addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  // Handle key presses and player actions.
  private updateInput() {
    if (this.keyDown.has('w') || this.keyDown.has('arrowup')) {
      this.position.z = this.position.z - this.speedmod
    }
    if (this.keyDown.has('a') || this.keyDown.has('arrowleft')) {
      this.position.x = this.position.x - this.speedmod
    }
    if (this.keyDown.has('s') || this.keyDown.has('arrowdown')) {
      this.position.z = this.position.z + this.speedmod
    }
    if (this.keyDown.has('d') || this.keyDown.has('arrowright')) {
      this.position.x = this.position.x + this.speedmod
    }
    if (this.keyDown.has(' ')) {
      this.position.y = this.position.y + this.speedmod
    }
    if (this.keyDown.has('shift')) {
      this.position.y = this.position.y - this.speedmod
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keyDown.add(e.key.toLowerCase())
  }
  private handleKeyUp = (e: KeyboardEvent) => {
    this.keyDown.delete(e.key.toLowerCase())
  }

  update() {
    this.updateInput()
  }
}