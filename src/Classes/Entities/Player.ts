import { BoxGeometry, Mesh, MeshPhongMaterial, Color } from 'three';

export default class Player extends Mesh {
  private readonly keyDown = new Set<string>();
  private readonly speedmod: number;

  constructor() {
    super();
    this.speedmod = 0.25;
    this.geometry = new BoxGeometry(1,1,1);
    this.material = new MeshPhongMaterial( { color: new Color().setHex(0xffe342), shininess: 1000 } )
    this.init();
  }

  init() {
    this.position.y = 1 / 2;
    this.castShadow = true;
    this.receiveShadow = true;

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  private updateInput() {
    if(this.keyDown.has('keyw') || this.keyDown.has('arrowup')) {
      this.position.z = this.position.z - this.speedmod
    }
    if(this.keyDown.has('keya') || this.keyDown.has('arrowleft')) {
      this.position.x = this.position.x - this.speedmod
    }
    if(this.keyDown.has('keys') || this.keyDown.has('arrowdown')) {
      this.position.z = this.position.z + this.speedmod
    }
    if(this.keyDown.has('keyd') || this.keyDown.has('arrowright')) {
      this.position.x = this.position.x + this.speedmod
    }
    if(this.keyDown.has('space')) {
      this.position.y = this.position.y + this.speedmod
    }
    if(this.keyDown.has('shiftleft')) {
      this.position.y = this.position.y - this.speedmod
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keyDown.add(e.code.toLowerCase())
  }
  private handleKeyUp = (e: KeyboardEvent) => {
    this.keyDown.delete(e.code.toLowerCase())
  }

  update() {
    this.updateInput()
  }
}