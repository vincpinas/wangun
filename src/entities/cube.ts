import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';
import Entity from './entity';

export default class CubeEntity extends Entity {
  private scaleUp: boolean;
  private scaleTiming: number;
  private rotateUp: boolean;
  private rotateTiming: number;

  constructor() {
    super();
    this.init();
    this.scaleUp = true;
    this.rotateUp = true;
    this.scaleTiming = 0.01;
    this.rotateTiming = 0.025;
  }

  init() {
    setTimeout(() => {
      setInterval(() => {
        if (!this.scaleUp) {
          this.scaleUp = true;
        } else {
          this.scaleUp = false;
        }
      }, 1000)
    }, Math.floor(Math.random() * 20) * 90)

    setTimeout(() => {
      setInterval(() => {
        if (!this.rotateUp) {
          this.rotateUp = true;
        } else {
          this.rotateUp = false;
        }
      }, 4000)
    }, Math.floor(Math.random() * 20) * 90)

    const cube = new Mesh(
      new BoxGeometry(1, 1),
      new MeshPhongMaterial({ shininess: 200, })
    )
    cube.castShadow = true;

    this.add(cube)
  }

  scaleEnt() {
    if (!this.scaleUp && this.scale.x >= 1) {
      this.scale.x = this.scale.x -= this.scaleTiming
      this.scale.y = this.scale.y -= this.scaleTiming
      this.scale.z = this.scale.z -= this.scaleTiming
    } else if (this.scaleUp && this.scale.x <= 1.5 && this.scale.y <= 1.5) {
      this.scale.x = this.scale.x += this.scaleTiming
      this.scale.y = this.scale.y += this.scaleTiming
      this.scale.z = this.scale.z += this.scaleTiming
    }
  }

  rotateEnt() {
    if (this.rotateUp) {
      this.rotation.x = this.rotation.x += this.rotateTiming
      this.rotation.y = this.rotation.y += this.rotateTiming
    } else {
      this.rotation.x = this.rotation.x -= this.rotateTiming
      this.rotation.y = this.rotation.y -= this.rotateTiming
    }
  }

  update() {
    this.rotateEnt();
    this.scaleEnt();
  }
}