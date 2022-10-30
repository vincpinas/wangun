import * as THREE from 'three';
import Entity from '../Classes/Entities/Entity';
import Player from '../Classes/Entities/Player';
import CoinEntity from '../Classes/Entities/CoinEntity';
import BasicScene from './BasicScene';
import CubeEntity from '../Classes/Entities/CubeEntity';

export default class SplashScene extends BasicScene {
  private player: Player;
  private entities: Entity[];

  constructor(camera: THREE.PerspectiveCamera) {
    super(camera);
    this.player = new Player();
    this.entities = [];
    this.init();
  }

  init() {
    this.player.add(this.camera)
    this.player.castShadow = true;

    this.add(this.player)

    this.entities = [
      new CoinEntity(),
      new CoinEntity(),
      new CubeEntity(),
    ]

    this.entities.forEach(ent => this.add(ent))
  }

  update() {
    this.player.update()
    this.entities.forEach(ent => ent.update())
  }
}