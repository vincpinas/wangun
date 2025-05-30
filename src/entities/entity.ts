import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


export default class Entity extends Object3D {
  public gltfloader: GLTFLoader;
  
  constructor() {
    super();
    this.gltfloader = new GLTFLoader();
    this.initEnt();
  }

  initEnt() {
    this.castShadow = true;
    this.receiveShadow = true;
    this.position.y = this.scale.y - 0.2;
    this.castShadow = true;
    this.receiveShadow = false;
  }

  update() {}
}