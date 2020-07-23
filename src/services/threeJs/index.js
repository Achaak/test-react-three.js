import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import randomColor from 'randomcolor'

const NB_BALLS = 200
const MAP_SIZE = 1000

class World {
  constructor() {
    this.balls = []

    this.scene = new THREE.Scene();
    var path = process.env.PUBLIC_URL+"/images/dark-s_";
    var format = '.jpg';
    var urls = [
      path + 'px' + format, path + 'nx' + format,
      path + 'py' + format, path + 'ny' + format,
      path + 'pz' + format, path + 'nz' + format
    ];
    var textureCube = new THREE.CubeTextureLoader().load( urls );
    this.scene.background = textureCube;
    
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 1;

    var pointLight = new THREE.PointLight("#ffffff", 1, MAP_SIZE*0.9);
    pointLight.position.set(0, 0, 1);
    pointLight.castShadow = true;
    pointLight.shadow.bias = -0.0002;
    pointLight.shadow.camera.far = 1000;
    pointLight.shadow.camera.near = 750;
    pointLight.shadow.camera.fov = 10;
    this.scene.add(pointLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.xr.enabled = true
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setAnimationLoop( function () {
      this.update()
    }.bind(this) );
    
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    
    this.initBalls()
    //this.startLoop();
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.camera.aspect = window.innerWidth/window.innerHeight
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  initBalls() {
    for (let i = 0; i < NB_BALLS; i++) {
      var color = randomColor()
      var geometry = new THREE.SphereGeometry( 10, 32, 32 );
      var material = new THREE.MeshPhongMaterial( {
        color: color,
        specular: color,
        shininess: 100,
      } );
      var ball = new THREE.Mesh( geometry, material );
      this.scene.add( ball );

      ball.position.x = this.randomInRange(MAP_SIZE*-1, MAP_SIZE)
      ball.position.y = this.randomInRange(MAP_SIZE*-1, MAP_SIZE)
      ball.position.z = this.randomInRange(MAP_SIZE*-1, MAP_SIZE)
      ball.speed = this.randomInRange(5, 10)
      ball.vectorX = this.randomInRange(-1, 1)
      ball.castShadow = true;
      ball.receiveShadow = true;
      ball.vectorY = this.randomInRange(-1, 1)
      ball.vectorZ = this.randomInRange(-1, 1)
      
      this.balls.push(ball)
    }
  }

  updateBallsPositions() {
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];

      if(ball.position.x > MAP_SIZE || ball.position.x < MAP_SIZE*-1) ball.vectorX = ball.vectorX * -1
      if(ball.position.y > MAP_SIZE || ball.position.y < MAP_SIZE*-1) ball.vectorY = ball.vectorY * -1
      if(ball.position.z > MAP_SIZE || ball.position.z < MAP_SIZE*-1) ball.vectorZ = ball.vectorZ * -1
      
      ball.position.x += ball.speed*ball.vectorX
      ball.position.y += ball.speed*ball.vectorY
      ball.position.z += ball.speed*ball.vectorZ
    }
  }

  update() {
    this.updateBallsPositions()
    
    this.renderer.render( this.scene, this.camera );
  }

  getRenderDomElement() {
    return this.renderer.domElement
  }

  getRenderer() {
    return this.renderer
  }

  randomInRange(min, max) {
    return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
  }
}

export default World