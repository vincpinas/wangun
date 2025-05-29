import { EffectPass, BloomEffect, PixelationEffect, FXAAEffect } from 'postprocessing';
import Game from './core/Game';
import { Group } from '@tweenjs/tween.js';
import RenderManager from './core/RenderManager';

// Create a group to manage all tweens
const tweenGroup = new Group();

// Game object, this stores all the objects the game will use apart of the post processing unit.
const game = new Game();

const renderManager = RenderManager.getInstance();
renderManager.init(game.renderer, game.sceneManager.current, game.camera);

// Post processing/rendering unit /*
renderManager.composer.addPass(new EffectPass(game.camera, new BloomEffect()));
renderManager.composer.addPass(new EffectPass(game.camera, new PixelationEffect(game.config.pixelRatio)));
renderManager.composer.addPass(new EffectPass(game.camera, new FXAAEffect()));

// On window resizing.
window.onresize = () => {
  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();

  game.renderer.setSize(window.innerWidth, window.innerHeight);
}

// Rendering loop, this updates the game and then renders using the post processer each tick.
const render = (time: number) => {
  game.update(time)
  tweenGroup.update() // Update all active tweens in the group
  renderManager.composer.render()
  requestAnimationFrame(render);
}
requestAnimationFrame(render);