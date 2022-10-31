export default class FPSCounter {
  private fps: number;
  private lastLoop: number;

  constructor(display: boolean) {
    this.fps = 0;
    this.lastLoop = Date.now();

    if(display) {
      let display = document.createElement('div');
      display.style.position = 'absolute';
      display.style.top = '1rem';
      display.style.left = '1rem';
      display.style.color = 'white'

      document.querySelector('body')?.appendChild(display)

      setInterval(() => {
        this.updateFPS();
        display.innerHTML = `${this.fps} FPS`
      });
    }
  }

  updateFPS() {
    let now = Date.now();
    this.fps = Math.round(100 / (now - this.lastLoop));
    this.lastLoop = now;
  }
}