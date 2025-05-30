import Entity from './entity';
import { CubeTextureLoader, Vector3 } from 'three';

import coinModel from '../assets/models/shicoin.glb';
import px from '../assets/textures/cube/coin/px.jpg';
import nx from '../assets/textures/cube/coin/nx.jpg';
import py from '../assets/textures/cube/coin/py.jpg';
import ny from '../assets/textures/cube/coin/ny.jpg';
import pz from '../assets/textures/cube/coin/pz.jpg';
import nz from '../assets/textures/cube/coin/nz.jpg';

export default class CoinEntity extends Entity {
  public readonly initScale: number;
  public readonly initYPos: number;
  public readonly value: number = 1;

  private scaleUp: boolean;
  private scaleTiming: number;
  private rotateTiming: number;
  private moveUp: boolean;
  private moveTiming: number;

  constructor(x: number = 0, y: number = 1, z: number = 0) {
    super();

    this.position.set(x, y, z);

    this.scaleUp = true;
    this.moveUp = true;
    
    this.scaleTiming = 0.005;
    this.rotateTiming = 0.015;
    this.moveTiming = 0.005;
    
    this.scale.set(0.4, 0.4, 0.4);

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
    } else if (this.scaleUp && this.scale.x <= this.initScale * 1.5) {
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
    this.gltfloader.load(coinModel, (gltf) => {
      const model: any = gltf.scene;

      model.traverse((child: any) => {
        if (child.isMesh) {
          child.material.envMap = new CubeTextureLoader().load([px, nx, py, ny, pz, nz]);
          child.material.envMapIntensity = 1;
          child.castShadow = true;
        }
      });
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