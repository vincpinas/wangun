import {
	Object3D,
	Raycaster,
	Vector3,
	Camera,
	AnimationMixer,
	Clock,
	AnimationAction,
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Easing, Tween } from "@tweenjs/tween.js";

import playerModel from "../assets/models/henry.fbx";

import CoinEntity from "./coin";
import Inventory from "../core/Inventory";
import BaseScene from "../scenes/BaseScene";

export default class Player extends Object3D {
	private readonly keyDown = new Set<string>();
	private readonly pickupDistance: number;

	public camera: Camera | null;
	public cameraMode: "sticky" | "follow";

	// State
	public isPlayable: boolean;
	public hasGravity: boolean;
	private inventory: Inventory;

	// Physics
	private raycaster: Raycaster;
	private speedmod: number;
	private isJumping: boolean;
	private jumpDuration: number;
	private jumpHeight: number;
	private jumpCount: number = 0;
	private maxJumps: number = 2; // 2 for double jump

	// Animation
	public model: any;
	public mixer: AnimationMixer | null = null;
	private clock: Clock = new Clock();
	private currentTween: Tween<any> | null = null;
	private clips: AnimationAction[] = [];
	private lastClip: AnimationAction | null = null;
	public interpolationTime: number = 0.2;
	private animationInProgress: boolean = false;

	constructor(camera: Camera | null = null) {
		super();

		this.camera = camera;
		this.cameraMode = "follow";

		this.speedmod = 0.095;
		this.pickupDistance = 1.5;
		this.raycaster = new Raycaster();
		this.hasGravity = true;
		this.isPlayable = true;

		this.init();

		this.isJumping = false;
		this.jumpDuration = 600;
		this.jumpHeight = 5.5;

		this.inventory = Inventory.getInstance();
	}

	init() {
		// Load the player model from falling.fbx with its animation
		const loader = new FBXLoader();

		loader.load(
			playerModel,
			(object) => {
				this.model = object;
				this.model.traverse((child: any) => {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
				});
				this.model.position.y = 0;
				this.model.scale.set(0.005, 0.005, 0.005);

				// Set up animation mixer if animations exist
				if (object.animations && object.animations.length > 1) {
					this.mixer = new AnimationMixer(this.model);
					this.clips = this.model.animations.map((animation: any) => {
						return this.mixer?.clipAction(animation);
					});
				}

				this.add(this.model);
			},
			undefined,
			(error) => {
				console.error("Error loading player model:", error);
			}
		);

		this.castShadow = true;
		this.receiveShadow = true;

		// Checking current pressed keys
		addEventListener("keydown", this.handleKeyDown);
		addEventListener("keyup", this.handleKeyUp);
		addEventListener("mousemove", this.handleMouseMove);
	}

	private handleKeyDown = (e: KeyboardEvent) =>
		this.keyDown.add(e.key.toLowerCase());
	private handleKeyUp = (e: KeyboardEvent) =>
		this.keyDown.delete(e.key.toLowerCase());
	private handleMouseMove = () => {};

	private hasKey(
		key: string | string[],
		ifCallback: Function,
		elseCallback?: Function
	) {
		if (typeof key === "string") {
			if (this.keyDown.has(key)) ifCallback();
			else if (elseCallback) elseCallback();
		} else {
			key.forEach((key) => {
				if (this.keyDown.has(key)) ifCallback();
				else if (elseCallback) elseCallback();
			});
		}
	}

	// Handle key presses and player actions.
	private updateInput() {
		if (!this.isPlayable) return;

		if (this.position.y <= -20) {
			this.respawn();
		}

		this.hasKey(
			"shift",
			() => {
				// this.speedmod = 0.14;
				this.speedmod = 0.12;
			},
			() => {
				this.speedmod = 0.095;
			}
		);

		let moveX = 0;
		let moveZ = 0;

		this.hasKey(["w", "arrowup"], () => {
			moveZ -= 1;
		});
		this.hasKey(["a", "arrowleft"], () => {
			moveX -= 1;
		});
		this.hasKey(["s", "arrowdown"], () => {
			moveZ += 1;
		});
		this.hasKey(["d", "arrowright"], () => {
			moveX += 1;
		});

		// Normalize movement direction to prevent faster diagonal movement
		if (moveX !== 0 || moveZ !== 0) {
			const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
			moveX /= length;
			moveZ /= length;

			this.position.x += moveX * this.speedmod;
			this.position.z += moveZ * this.speedmod;

			// Calculate the target angle in radians for smooth 360-degree rotation
			const targetAngle = Math.atan2(moveX, moveZ);

			// Smoothly interpolate the player's rotation towards the target angle
			const currentY = this.rotation.y;
			let delta = targetAngle - currentY;
			// Ensure shortest path for rotation
			if (delta > Math.PI) delta -= Math.PI * 2;
			if (delta < -Math.PI) delta += Math.PI * 2;
			this.rotation.y += delta * 0.18; // 0.18 is a smoothing factor, adjust as needed
		}

		this.hasKey(" ", () => {
			if (!this.isJumping && this.jumpCount < this.maxJumps) {
				this.isJumping = true;
				this.jumpCount++;
				const startY = this.position.y;
				const peakY = startY + this.jumpHeight;

				this.currentTween = new Tween(this.position)
					.to({ y: peakY }, this.jumpDuration / 2)
					.easing(Easing.Quadratic.Out)
					.onComplete(() => {
						this.currentTween = new Tween(this.position)
							.to({ y: startY }, this.jumpDuration / 2)
							.easing(Easing.Quadratic.In)
							.onComplete(() => {
								this.isJumping = false;
								this.currentTween = null;
							})
							.start();
					})
					.start();
			}
		});
	}

	private checkGrounded() {
		// Create a ray from the player's position pointing downward
		const rayOrigin = this.position.clone();
		rayOrigin.y += 0.5; // Start from the bottom of the player's mesh
		const rayDirection = new Vector3(0, -1, 0);

		this.raycaster.set(rayOrigin, rayDirection);

		// Get all objects in the scene that could be ground, excluding the player
		const objectsToCheck = (this.parent?.children || []).filter(
			(obj) => obj !== this
		);
		const intersects = this.raycaster.intersectObjects(objectsToCheck, true);

		// Check if we hit something within a small distance (0.6 units)
		if (intersects.length > 0 && intersects[0].distance < 0.6) {
			const groundY = intersects[0].point.y;
			return groundY;
		} else {
			return null;
		}
	}

	private cameraFollow() {
		if (!this.camera) return;

		const camera = this.camera;

		if(this.cameraMode === "follow") {
			const followHeight = 2.4;
			const followDistance = 4.8;
	
			// Calculate the direction from the camera to the player
			const playerPos = new Vector3(this.position.x, this.position.y, this.position.z);
	
			// Target camera position: smoothly follow the player, not just stick behind
			const desiredCamY = this.position.y + followHeight;
	
			// Instead of always being behind, let the camera smoothly follow the player's position
			const lerpFactor = 0.12; // Adjust for smoothness
	
			// Calculate the vector from camera to player
			const toPlayer = new Vector3().subVectors(playerPos, camera.position);
			const distanceToPlayer = toPlayer.length();
	
			// If too far, move closer; if too close, move away
			const targetDistance = followDistance;
			if (distanceToPlayer !== targetDistance) {
				toPlayer.normalize();
				const targetPos = new Vector3().copy(playerPos).addScaledVector(toPlayer, -targetDistance);
				camera.position.x += (targetPos.x - camera.position.x) * lerpFactor;
				camera.position.z += (targetPos.z - camera.position.z) * lerpFactor;
			}
	
			// Always smoothly follow the player's Y position
			camera.position.y += (desiredCamY - camera.position.y) * lerpFactor;
	
			// Look at the player
			const lookAtTarget = new Vector3(this.position.x, this.position.y + 0.5, this.position.z);
			camera.lookAt(lookAtTarget);
		} else if (this.cameraMode === "sticky") {
			const cameraDistance = 4.8;
			const cameraHeight = 2.4;
	
			// Calculate the desired camera position behind the player
			const camTargetAngle = this.rotation.y;
			const desiredCamX =
				this.position.x - Math.sin(camTargetAngle) * cameraDistance;
			const desiredCamZ =
				this.position.z - Math.cos(camTargetAngle) * cameraDistance;
			const desiredCamY = this.position.y + cameraHeight;
	
			// Smoothly interpolate the camera's position towards the desired position
			const lerpFactor = 0.1; // Lower is slower, higher is snappier
			camera.position.x += (desiredCamX - camera.position.x) * lerpFactor;
			camera.position.y += (desiredCamY - camera.position.y) * lerpFactor;
			camera.position.z += (desiredCamZ - camera.position.z) * lerpFactor;
	
			// Smoothly interpolate the camera's lookAt target
			const targetY = this.position.y + 0.5;
			const lookAtTarget = new Vector3(this.position.x, targetY, this.position.z);
	
			// Optionally, you can also smooth the lookAt by storing a persistent target vector
			camera.lookAt(lookAtTarget);
		}
	}

	private gravity() {
		if (!this.hasGravity) return;

		const groundY = this.checkGrounded();

		// If jumping, check for early landing
		if (this.isJumping && this.currentTween) {
			// Only check for landing if not at the peak (i.e., still moving up or down)
			if (groundY !== null) {
				// Cancel the jump tween and land on the platform
				this.currentTween.stop();
				this.currentTween = null;
				this.isJumping = false;
				this.position.y = groundY + 0.5;
				this.jumpCount = 0; // Reset jump count when grounded
				return;
			}
		}

		if (groundY === null && !this.isJumping) {
			// Apply gravity when not grounded and not jumping
			this.position.y -= 0.15;
		} else if (groundY !== null && !this.isJumping) {
			// Stand on top of the ground (plane at y=0, player is 1 unit tall)
			this.position.y = groundY;
			this.jumpCount = 0; // Reset jump count when grounded
		}
	}

	private checkCoinCollision(entities: CoinEntity[], scene: BaseScene) {
		entities.forEach((coin) => {
			const distance = this.position.distanceTo(coin.position);
			if (distance < this.pickupDistance) {
				this.collectCoin(coin, scene);
			}
		});
	}

	private respawn() {
		this.rotation.set(0, 0, 0);
		this.position.set(0, 5, 0);
	}

	private collectCoin(coin: CoinEntity, scene: BaseScene) {
		this.inventory.addCoins(coin.value); // Add coin value to inventory
		coin.parent?.remove(coin); // Remove the coin from the scene
		scene.removeEntity(coin); // Remove the coin from the entities array
	}

	onCycleFinished() {
		this.animationInProgress = false;
	}

	action(animationId: any, timeScale: any, cycleFlag: any) {
		if (!this.mixer) return;

		if (this.animationInProgress) return;

		if (cycleFlag) {
			this.mixer.addEventListener("loop", this.onCycleFinished.bind(this));
			this.animationInProgress = true;
		}

		// this.mixer.timeScale = timeScale;

		if (this.lastClip === null) {
			this.clips[animationId].reset();
		} else if (this.lastClip == animationId) return;

		this.clips[animationId].reset();
		this.clips[animationId].play();
		if (this.lastClip !== null && this.clips[this.lastClip]) {
			this.clips[this.lastClip].crossFadeTo(
				this.clips[animationId],
				this.interpolationTime,
				true
			);
		}
		this.lastClip = animationId;
	}

	update(time: number, entities?: CoinEntity[], scene?: BaseScene) {
		// Update animation mixer if available
		if (this.mixer) {
			this.mixer.update(this.clock.getDelta());
		}
		this.updateInput();
		this.gravity();
		this.cameraFollow();
		if (this.currentTween) {
			this.currentTween.update(time);
		}
		if (entities && scene) {
			this.checkCoinCollision(entities, scene);
		}
	}
}
