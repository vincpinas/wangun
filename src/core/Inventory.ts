class Inventory {
    private static _instance: Inventory | null = null;
    private items: { [key: string]: number };
    private coins: number;

    private constructor() {
        this.items = {};
        this.coins = 0;
    }

    public static getInstance(): Inventory {
        if (!Inventory._instance) {
            Inventory._instance = new Inventory();
        }
        return Inventory._instance;
    }

    public addItem(item: string, quantity: number) {
        if (this.items[item]) {
            this.items[item] += quantity;
        } else {
            this.items[item] = quantity;
        }
    }

    public setCoins(amount: number) {
        this.coins = amount;
    }

    public addCoins(amount: number) {
        this.coins += amount;
    }

    public removeCoins(amount: number) {
        this.coins -= amount;
    }

    public removeItem(item: string, quantity: number) {
        if (this.items[item]) {
            this.items[item] -= quantity;
            if (this.items[item] <= 0) {
                delete this.items[item];
            }
        }
    }

    public getInventory() {
        return this.items;
    }

    public getCoins() {
        return this.coins;
    }
}

export default Inventory;