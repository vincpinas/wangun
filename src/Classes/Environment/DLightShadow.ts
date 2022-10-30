import { DirectionalLight, CameraHelper } from "three";

export default class DLightShadow extends DirectionalLight {
  constructor(mSize: number = 10, i: number = .2, debug?: boolean) {
    super(0xffffff, i);
    this.castShadow = true;
    this.shadow.camera.near = 1200;
    this.shadow.camera.far = 2500;
    this.shadow.bias = 0.0001;
    this.shadow.camera.top += mSize
    this.shadow.camera.bottom -= mSize
    this.shadow.camera.left -= mSize
    this.shadow.camera.right += mSize
    this.shadow.mapSize.width = 2048;
    this.shadow.mapSize.height = 1024;

    if (debug) {
      setTimeout(() => {
        this.parent?.add(
          new CameraHelper(this.shadow.camera)
        )
      })
    }
  }
}