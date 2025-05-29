import { Mesh, MeshPhongMaterial, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, sRGBEncoding, Texture, TextureLoader } from "three";

export default class TexturedPlane extends Mesh {
  protected textureLoader: TextureLoader;
  private groundTexture: Texture | null;
  private readonly textureHref: string | null;
  private plane: PlaneGeometry;

  constructor(w: number, h: number, href?: string) {
    super();
    this.textureLoader = new TextureLoader();
    this.textureHref = href || null
    this.groundTexture = null;
    this.material = new MeshPhongMaterial({});
    this.plane = new PlaneGeometry(w, h);
    this.init();
  }

  init() {
    this.rotation.x = -Math.PI / 2
    this.receiveShadow = true;
    this.geometry = this.plane;


    if (this.textureHref) {
      this.groundTexture = this.textureLoader.load(this.textureHref)

      this.groundTexture.wrapS = this.groundTexture.wrapT = RepeatWrapping;
      this.groundTexture.repeat.set(1.4, 1.4);
      this.groundTexture.anisotropy = 15;
      this.groundTexture.encoding = sRGBEncoding;
      this.material = new MeshStandardMaterial({ map: this.groundTexture });
    }
  }

  update() {}
}