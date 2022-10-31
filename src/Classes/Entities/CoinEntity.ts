import Entity from './Entity';
import { Color, MeshStandardMaterial, CubeTextureLoader } from 'three';

export default class CoinEntity extends Entity {
  private scaleUp: boolean;
  private scaleTiming: number;
  private rotateTiming: number;
  private moveUp: boolean;
  private moveTiming: number;
  private readonly initScale: number;
  private readonly initYPos: number;

  constructor() {
    super();
    this.scaleUp = true;
    this.scaleTiming = 0.005;
    this.rotateTiming = 0.025;
    this.moveUp = true;
    this.moveTiming = 0.005;
    this.initScale = this.scale.x;
    this.initYPos = this.position.y;
    this.init();
  }

  init() {
    // Scaling interval
    setTimeout(() => {
      setInterval(() => {
        if (!this.scaleUp) {
          this.scaleUp = true;
        } else {
          this.scaleUp = false;
        }
      }, 1200)
    }, Math.floor(Math.random() * 20) * 90)
    // Y axis move interval
    setTimeout(() => {
      setInterval(() => {
        if (!this.moveUp) {
          this.moveUp = true;
        } else {
          this.moveUp = false;
        }
      }, 650)
    }, Math.floor(Math.random() * 20) * 90)

    this.loadModel(this)
  }

  scaleEnt() {
    if (!this.scaleUp && this.scale.x >= this.initScale) {
      this.scale.x = this.scale.x -= this.scaleTiming
      this.scale.y = this.scale.y -= this.scaleTiming
      this.scale.z = this.scale.z -= this.scaleTiming
    } else if (this.scaleUp && this.scale.x <= this.initScale + 0.5) {
      this.scale.x = this.scale.x += this.scaleTiming
      this.scale.y = this.scale.y += this.scaleTiming
      this.scale.z = this.scale.z += this.scaleTiming
    }
  }

  rotateEnt() {
    this.rotation.y = this.rotation.y += this.rotateTiming
  }

  YAxisMoveEnt() {
    if (!this.moveUp && this.position.y >= this.initYPos) {
      this.position.y = this.position.y -= this.moveTiming
    } else if (this.moveUp && this.position.y <= this.initYPos + 0.25) {
      this.position.y = this.position.y += this.moveTiming
    }
    this.rotation.y = this.rotation.y += this.rotateTiming
  }

  loadModel(coin: CoinEntity) {
    const path = './assets/textures/cube/coin/';
    const reflectionCube = new CubeTextureLoader().load([
      path + 'px' + '.jpg', path + 'nx' + '.jpg',
      path + 'py' + '.jpg', path + 'ny' + '.jpg',
      path + 'pz' + '.jpg', path + 'nz' + '.jpg'
    ])

    this.gltfloader.load('./assets/glb/low_poly_coin.glb', (gltf) => {
      const model: any = gltf.scene;

      model.children[0].castShadow = true;
      for (let i = 0; i < model.children.length; i++) {
        model.children[i].material = new MeshStandardMaterial({
          color: new Color().setHex(0xffc800),
          roughness: .35,
          metalness: .8,
          envMap: reflectionCube,
          envMapIntensity: 1,
        })
      }
      coin.add(model);
    }, undefined, (e) => {
      console.error(e);
    });
  }

  update() {
    this.rotateEnt();
    this.scaleEnt();
    this.YAxisMoveEnt();
  }
}