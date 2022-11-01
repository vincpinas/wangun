import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import Game from './Classes/Game';

// Game object, this stores all the objects the game will use apart of the post processing unit.
const game = new Game();


// Post processing/rendering unit /*
const composer = new EffectComposer(game.renderer);
// Pass renderer to composer.
composer.addPass(new RenderPass(game.scene, game.camera));
// Bloom filter.
const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.7, 0.85);
composer.addPass(bloomPass);
// Pixel filter.
const pixelPass = new ShaderPass(PixelShader);
pixelPass.uniforms['resolution'].value = new Vector2(window.innerWidth, window.innerHeight);
pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
pixelPass.uniforms['pixelSize'].value = game.config.pixelRatio;
composer.addPass(pixelPass);
// FXAA filter.
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * game.renderer.getPixelRatio());
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * game.renderer.getPixelRatio());
composer.addPass(fxaaPass);


// On window resizing.
window.onresize = () => {
  game.camera.aspect = window.innerWidth / window.innerHeight;
  game.camera.updateProjectionMatrix();

  game.renderer.setSize(window.innerWidth, window.innerHeight);
  pixelPass.uniforms['resolution'].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
}


// Rendering loop, this updates the game and then renders using the post processer each tick.
const render = () => {
  game.update()
  composer.render()
  requestAnimationFrame(render);
}
render();