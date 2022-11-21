import { EffectComposer, RenderPass, EffectPass, BloomEffect, PixelationEffect, FXAAEffect } from 'postprocessing';
import Game from './Classes/Game';

// Game object, this stores all the objects the game will use apart of the post processing unit.
const game = new Game();

// Post processing/rendering unit /*
const composer = new EffectComposer(game.renderer);
// Pass renderer to composer.
composer.addPass(new RenderPass(game.scene, game.camera));
// Post processing effects.
composer.addPass(new EffectPass(game.camera, new BloomEffect()))
composer.addPass(new EffectPass(game.camera, new PixelationEffect(game.config.pixelRatio)))
composer.addPass(new EffectPass(game.camera, new FXAAEffect()))


// On window resizing.
window.onresize = () => {
  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();

  game.renderer.setSize(window.innerWidth, window.innerHeight);
}


// Rendering loop, this updates the game and then renders using the post processer each tick.
const render = () => {
  game.update()
  composer.render()
  requestAnimationFrame(render);
}
render();