export default class BaseUI {
	public element: HTMLDivElement = document.createElement("div");

	constructor(display: boolean) {
		if (display) {
			this.initializeDisplay();
		}
	}

	private initializeDisplay() {
		this.element.style.position = "absolute";
		this.element.style.color = "white";
		this.element.style.fontSize = "1.5rem";
		this.element.style.padding = "0.2rem 0.5rem";
		this.element.style.borderRadius = "20px";
		this.element.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

		document.body.appendChild(this.element);
	}

	update() {}
}
