export const createElement = (type: string = "div", elementOptions = {}) => {
    const element: any = document.createElement(type);

    for (const [key, value] of Object.entries(elementOptions)) {
        if (key === "style" && typeof value === "object" && value !== null) {
            Object.assign(element.style, value);
        } else {
            element[key] = value;
        }
    }

    return element;
}
