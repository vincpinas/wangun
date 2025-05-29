import { DirectionalLight, CameraHelper } from "three";

/**
 * @param mSize - number, default 10. The margin size for the shadow camera frustum.
 * @param i - number, default 0.2. The intensity of the directional light.
 * @param debug - boolean, optional. If true, adds a CameraHelper for debugging the shadow camera.
 */
export default class DLightShadow extends DirectionalLight {
  constructor(
    mSize: number = 10, 
    intensity: number = 0.2, 
    debug?: boolean
  ) {
    super(0xffffff, intensity);
    this.castShadow = true;
    this.shadow.camera.near = 1200;
    this.shadow.camera.far = 2500;
    this.shadow.bias = 0.0001;
    this.shadow.camera.top += mSize;
    this.shadow.camera.bottom -= mSize;
    this.shadow.camera.left -= mSize;
    this.shadow.camera.right += mSize;
    this.shadow.mapSize.width = 2048;
    this.shadow.mapSize.height = 1024;

    if (debug) {
      setTimeout(() => {
        this.parent?.add(
          new CameraHelper(this.shadow.camera)
        );
      });
    }
  }

  update() {}
}