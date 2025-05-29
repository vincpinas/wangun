declare module '*.glb';
declare module '*.fbx';

interface ConfigOptions {
    fov?: number;
    displayFPS: boolean;
}

type UIPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface UIItem {
    type: "button" | "input" | "text";
    content: string;
}

interface UIOptions {
    position: UIPosition;
    height?: number;
    width?: number;
    items: UIItem[];
}