import Inventory from "../core/Inventory";
import coinIcon from "../assets/icons/coin.png";
import BaseUI from "./BaseUI";

class CoinCounter extends BaseUI {
	private inventory: Inventory = Inventory.getInstance();
	private icon: HTMLImageElement = document.createElement("img");

	constructor(display: boolean = false) {
		super(display);

		this.init();
	}

	init() {
		this.element.style.display = "flex";
		this.element.style.alignItems = "center";
		this.element.style.justifyContent = "center";

		this.icon.src = coinIcon;
		this.icon.style.height = "1.5rem";

		this.element.style.top = "1rem";
		this.element.style.right = "1rem";

		this.element.appendChild(this.icon);
	}

	public update() {
		this.element.innerHTML = `${this.inventory.getCoins()}`;
		this.element.appendChild(this.icon);
	}
}

export default CoinCounter;
