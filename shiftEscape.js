/*
*  Shift Escape Prototype
*  A game developed using the Three.js library. 
*
*  By John Bentley
*
*  Base code provided by Nathan Whitehead
*  http://nathansuniversity.com/index10.html
*/

/*
* ToDo
* - Camera
* - SkyBox
* - stuff
*/

var board_to_world = function(position) {
    // Convert board position into world position
    return {x: 100 * position.x, y: 100 * position.y, z: 0};
};

var Barrier = function(position) {
    //// A Barrier is a game object
    // Default position if unspecified is at square 0, 0
    this.boardPosition = position || {x: 0, y: 0};
    this.type = 'barrier';
    this.geometry = new THREE.CubeGeometry(90, 90, 90);
    // Geometry should always be around origin
    this.material = new THREE.MeshLambertMaterial({color: 0xff0000});
    this.object = new THREE.Mesh(this.geometry, this.material);
    // A mesh is an Object3D, change its position to move
    this.object.position = board_to_world(this.boardPosition);
};

var Robot = function(position) {
    //// A Robot is a game object
    // Default position if unspecified is at square 0, 0
    this.boardPosition = position || {x: 0, y: 0};
    this.type = 'robot';
    this.geometry = new THREE.SphereGeometry(45, 20, 20);
    // Geometry should always be around origin
    // Make it blue
    this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    this.object = new THREE.Mesh(this.geometry, this.material);
    // A mesh is an Object3D, change its position to move
    this.object.position = board_to_world(this.boardPosition);
};

Robot.prototype.updateBoardPosition = function() {
    this.object.position = board_to_world(this.boardPosition);
};

Robot.prototype.moveTo = function(position) {
    this.boardPosition = position;
    this.updateBoardPosition();
};

var Game = function() {
    // A Game object is the highest level object representing entire game
};

Game.prototype.init = function() {
    var that = this;
    this.barriers = [];
    this.barriers.push(new Barrier({x: 2, y: 1}));
    this.barriers.push(new Barrier({x: 1, y: 1}));
    this.barriers.push(new Barrier({x: 2, y: 2}));
    this.robot = new Robot({x: 0, y: 0});
    
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.z = 500;
    
    this.scene = new THREE.Scene();
    // Add all barriers to scene
    _.each(this.barriers, function(element, index) {
           that.scene.add(element.object);
           });
    this.scene.add(this.robot.object);
    
    // Spotlight
    var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
    spotlight.position.set(0, -100, 300);
    this.scene.add(spotlight);
    // Ambient light
    var ambient_light = new THREE.AmbientLight(0x202020);
    this.scene.add(ambient_light);
    // Background plane
    var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800),
                                 new THREE.MeshLambertMaterial());
    bgplane.translateZ(-100);
    this.scene.add(bgplane);
    
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(800, 600);
    this.renderer.setClearColor(0xeeeeee, 1.0);
    document.body.appendChild(this.renderer.domElement);
    
    // Setup keyboard events
    this.keys = {};
    $('body').keydown(function(e) {
                      console.log('keydown ' + e.which);
                      if (e.which) {
                      if (that.keys[e.which] !== 'triggered') {
                      that.keys[e.which] = true;
                      }
                      }
                      console.log(that.keys);
                      });
    $('body').keyup(function(e) {
                    console.log('keyup ' + e.which);
                    if (e.which) {
                    that.keys[e.which] = false;
                    }
                    console.log(that.keys);
                    });
};

Game.prototype.render = function(t) {
    // Bob the camera a bit
    this.camera.position.x = Math.sin(t / 1000.0) * 60;
    this.camera.position.y = -500 + Math.sin(t / 700.0) * 40;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
};

Game.prototype.legalRobotMove = function(position) {
    if (position.x < 0 || position.x > 7) {
        return false;
    }
    if (position.y < 0 || position.y > 7) {
        return false;
    }
    return true;
};

Game.prototype.handleInput = function() {
    // Left
    if (this.keys[65] === true) {
        this.keys[65] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x - 1,
            y: this.robot.boardPosition.y};
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Right
    if (this.keys[68] === true) {
        this.keys[68] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x + 1,
            y: this.robot.boardPosition.y};
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Up
    if (this.keys[87] === true) {
        this.keys[87] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y + 1};
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
    // Down
    if (this.keys[83] === true) {
        this.keys[83] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y - 1};
        if (this.legalRobotMove(newPosition)) {
            this.robot.moveTo(newPosition);
        }
    }
};

Game.prototype.start = function() {
    var that = this;
    var time0 = new Date().getTime(); // milliseconds since 1970
    var loop = function() {
        var time = new Date().getTime();
        // Render visual frame
        that.render(time - time0);
        // Respond to user input
        that.handleInput();
        // Loop
        requestAnimationFrame(loop, that.renderer.domElement);
    };
    loop();  
};

//// 

$(function() {
  
  var game = new Game();
  game.init();
  game.start();
  
  });
