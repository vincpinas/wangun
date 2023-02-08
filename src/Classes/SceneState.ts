import { Scene } from "three";

export default class SceneStateMachine {
  public state: Scene;

  constructor(initialState: Scene) {
    this.state = initialState;
  }

  transition(duration: number) {
    const transPanel = document.createElement('div');
    transPanel.style.background = "black"
    transPanel.style.width = "100%";
    transPanel.style.height = "100%";
    transPanel.style.position = "absolute";
    transPanel.style.animation = `fade-out ${duration} ease-out forwards`;
    document.body.appendChild(transPanel);

    setTimeout(() => {
      document.body.removeChild(transPanel);
    }, duration);
  }

  push(scene: Scene, duration: number = 0.25) {
    this.transition(duration);
    setTimeout(() => {
      this.state = scene;
    }, duration / 1.5);
  }
}