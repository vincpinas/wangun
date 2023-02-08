import * as THREE from 'three';
import Entity from '../Classes/Entities/Entity';
import Player from '../Classes/Entities/Player';
import CoinEntity from '../Classes/Entities/CoinEntity';
import BasicScene from './BasicScene';
import CubeEntity from '../Classes/Entities/CubeEntity';

export default class SplashScene extends BasicScene {
  private entities: Entity[];

  constructor(camera: THREE.PerspectiveCamera, player: Player) {
    super(camera, player, 'splash');
    this.entities = [];
    this.init();
  }

  init() {
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