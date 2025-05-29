import BaseUI from "./BaseUI";

export default class FPSCounter extends BaseUI {
  public fps: number;  
  private lastLoop: number;
  
  constructor(display: boolean) {
    super(display)

    this.fps = 0;
    this.lastLoop = Date.now();

    this.init();
  }

  init() {
		this.element.style.top = "1rem";
		this.element.style.left = "1rem";
	}
  
  update() {
    let now = Date.now();
    this.fps = Math.round(1000 / (now - this.lastLoop));
    this.lastLoop = now;
    this.element.innerHTML = `${this.fps} FPS`
  }
}