import {
	InstancedMesh,
	ShaderMaterial,
	DoubleSide,
	Object3D,
	PlaneGeometry,
    Clock,
} from "three";

////////////
// MATERIAL
////////////

const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 0.95 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.08 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.15, 0.5, 0.15 );
    float clarity = ( vUv.y * 0.5 ) + 0.01;
    gl_FragColor = vec4( baseColor * clarity, 0.9 );
  }
`;

const uniforms = {
	time: {
		value: 0,
	},
};

const leavesMaterial = new ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	side: DoubleSide,
});

/////////
// MESH
/////////

class Grass extends InstancedMesh {
	private instanceNumber: number;
	protected dummy: Object3D = new Object3D();
    protected clock: Clock = new Clock();

	protected readonly patchWidth;
	protected readonly patchHeight;

	constructor(instanceNumber: number, thickness: number, height: number, patchWidth: number, patchHeight: number) {
		super(
			new PlaneGeometry(thickness, height, patchWidth, patchHeight),
			leavesMaterial,
			instanceNumber
		);

		this.patchWidth = patchWidth;
		this.patchHeight = patchHeight;

		this.geometry.translate(0, 0.2, 0); // move grass blade geometry lowest point at 0.
		this.instanceNumber = instanceNumber;

		this.init();
	}

	init() {
		// Position and scale the grass blade instances randomly.
		for (let i = 0; i < this.instanceNumber; i++) {
			this.dummy.position.set(
				(Math.random() - 0.5) * (this.patchWidth / 2),
				0,
				(Math.random() - 0.5) * (this.patchHeight / 2)
			);

			this.dummy.scale.setScalar(0.5 + Math.random() * 0.5);

			this.dummy.rotation.y = Math.random() * Math.PI;

			this.dummy.updateMatrix();
			this.setMatrixAt(i, this.dummy.matrix);
		}
	}

	update() {
        leavesMaterial.uniforms.time.value = this.clock.getElapsedTime();
        leavesMaterial.uniformsNeedUpdate = true;
	}
}

export default Grass;
