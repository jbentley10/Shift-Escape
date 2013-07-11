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

var shiftMode = false; 

var robotPosition = null;

var highlightPosition = null;

var cubeLight = null;

var Highlight = null;

var numShifts = 10; 

var board_to_world = function(position) {
    // Convert board position into world position
    // This controls where the board is on the screen
    return {x: 100 * position.x, y: 100 * position.y, z: 0};
};

var robot_to_world = function(position) {
    // Converts robot position to world position
    // Controls where the robot is on screen
    return {x: 100 * position.x, y: 100 * position.y, z: 0};
};

var highlight_to_world = function(position) {
    // Converts highlighted cube position to world position
    return {x: 100 * position.x, y: 100 * position.y, z: 100};
};

var Barrier = function(position) {
    // A Barrier is a game object
    // Default position if unspecified is at square 0, 0
    this.boardPosition = position || {x: -400, y: 400};
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
    this.boardPosition = position || {x: -400, y: 400};
    this.type = 'robot';
    this.geometry = new THREE.SphereGeometry(45, 20, 20);
    // Geometry should always be around origin
    // Make it blue
    this.material = new THREE.MeshPhongMaterial({color: 0x0000ff});
    this.object = new THREE.Mesh(this.geometry, this.material);
    // A mesh is an Object3D, change its position to move
    this.object.position = robot_to_world(this.boardPosition);
};

var Highlight = function(position){
    // Display spotlight on highlighted cube to shift
    // Use color code 0x45e1f5
    this.geometry = new THREE.CubeGeometry(90, 90, 10);
    this.boardPosition = position || {x: -400, y: 400};
    this.type = 'highlight';
    this.material = new THREE.MeshPhongMaterial({color: 0x45e1f5});
    this.object = new THREE.Mesh(this.geometry, this.material);
    this.object.position = highlight_to_world(this.boardPosition);
};

Robot.prototype.updateBoardPosition = function() {
    this.object.position = robot_to_world(this.boardPosition);
};

Robot.prototype.moveTo = function(position) {
    this.boardPosition = position;
    position = robotPosition;
    this.updateBoardPosition();
    return robotPosition; 
};

Highlight.prototype.updateBoardPosition = function() {
    this.object.position = highlight_to_world(this.boardPosition);
};

Highlight.prototype.moveTo = function(position) {
    this.boardPosition = position;
    position = highlightPosition;
    this.updateBoardPosition();
    return highlightPosition;
};

// A Game object is the highest level object representing entire game
var Game = function() {
};

Game.prototype.init = function() {
    var that = this;
    this.barriers = [];
    
    for(var i = -3; i < 5; i++) {
        this.barriers.push(new Barrier({x: i, y: 1}));
        this.barriers.push(new Barrier({x: i, y: 2}));
        var topRow = this.barriers.push(new Barrier({x: i, y: 3}));      // top row
        this.barriers.push(new Barrier({x: i, y: 0}));
        this.barriers.push(new Barrier({x: i, y: -1}));
        this.barriers.push(new Barrier({x: i, y: -2}));
        this.barriers.push(new Barrier({x: i, y: -3}));
        var bottomRow = this.barriers.push(new Barrier({x: i, y: -4}));     // bottom row
    }
    
    var barrier1 = this.barriers.pop[0];
    var barrier2 = this.barriers.pop[1];
    var barrier3 = this.barriers.pop[2];
    var barrier4 = this.barriers.pop[3];
    var barrier5 = this.barriers.pop[4];
    var barrier6 = this.barriers.pop[5];
    var barrier7 = this.barriers.pop[6];
    var barrier8 = this.barriers.pop[7];
    var barrier9 = this.barriers.pop[8];
    var barrier10 = this.barriers.pop[9];
    var barrier11 = this.barriers.pop[10];
    var barrier12 = this.barriers.pop[11];
    var barrier13 = this.barriers.pop[12];
    var barrier14 = this.barriers.pop[13];
    var barrier15 = this.barriers.pop[14];
    var barrier16 = this.barriers.pop[15];
    
    // Initialize the robot 
    this.robot = new Robot({x: -1, y: 4});
    
    // Initialize the highlight
    this.highlight = new Highlight({x: -1, y: 4});
    
    // Create and position the camera 
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.z = 600;
    
    this.scene = new THREE.Scene();
    // Add all barriers to scene
    _.each(this.barriers, function(element, index) {
           that.scene.add(element.object);
           });
    this.scene.add(this.robot.object);
    this.scene.add(this.highlight.object);
    
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
    this.camera.position.x = 0; // 700
    this.camera.position.y = -300; // 400
    this.camera.position.z = 850; //500
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
};

// Set up the light that acts as a cursor, following the robot
Game.prototype.cubeLight = function() {
    this.type = 'light';
    cubeLight = new THREE.SpotLight(0x5DF57B);
    this.position = (robotPosition);
    
    this.castShadow = true;
    this.target = robotPosition;
    this.scene.add(cubeLight);
};

Game.prototype.legalMove = function(position) {
    if (position.x < -3 || position.x > 4) {
        return false;
    }
    if (position.y < -5 || position.y > 4) {
        return false;
    }
    return true;
};

Game.prototype.shiftRow = function(position) {
    var rowToShift = [];
    if(this.position.y === 3) {
        topRow--;
    }
    
}

Game.prototype.shiftCol = function(position) {
    var colToShift = [];
    //if (this.position.x === 3)
}

Game.prototype.handleInput = function() {
    // Robot move left
    if (this.keys[65] === true) {
        this.keys[65] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x - 1,
            y: this.robot.boardPosition.y};
        if (this.legalMove(newPosition) && this.barriers != newPosition) {
            this.robot.moveTo(newPosition);
        }
    }
    // Robot move right
    if (this.keys[68] === true) {
        this.keys[68] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x + 1,
            y: this.robot.boardPosition.y};
        if (this.legalMove(newPosition) && this.barriers != newPosition) {
            this.robot.moveTo(newPosition);
        }
    }
    // Robot move up
    if (this.keys[87] === true) {
        this.keys[87] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y + 1};
        if (this.legalMove(newPosition) && this.barriers != newPosition) {
            this.robot.moveTo(newPosition);
        }
    }
    // Robot move down
    if (this.keys[83] === true) {
        this.keys[83] = 'triggered';
        var newPosition = {x: this.robot.boardPosition.x,
            y: this.robot.boardPosition.y - 1};
        if (newPosition == this.barriers.position.y)
            console.log("You can't move here");
        if (this.legalMove(newPosition) && this.barriers != newPosition) {
            this.robot.moveTo(newPosition);
        }
    }
    // Highlight cube left
    if (this.keys[37] === true) {
        this.keys[37] = 'triggered';
        if (shiftMode === false) {  
          var newPosition = {x: this.highlight.boardPosition.x - 1, y: this.highlight.boardPosition.y};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
        }
      }
    // Highlight cube right
    if (this.keys[39] === true) {
        this.keys[39] = 'triggered';
        if (shiftMode === false) {
          var newPosition = {x: this.highlight.boardPosition.x + 1, y: this.highlight.boardPosition.y};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
        }
    }
    // Highlight cube up
    if (this.keys[38] === true) {
        this.keys[38] = 'triggered';
        if (shiftMode === false) {
          var newPosition = {x: this.highlight.boardPosition.x, y: this.highlight.boardPosition.y + 1};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
        }
    }
    // Highlight cube down
    if (this.keys[40] === true) {
        this.keys[40] = 'triggered';
        if (shiftMode === false) {
          var newPosition = {x: this.highlight.boardPosition.x, y: this.highlight.boardPosition.y - 1};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
        }
    }
    // Row shift left
    if (this.keys[16] === true && this.keys[37] === true) {
        this.keys[16] = 'triggered';
        this.keys[37] = 'triggered';
        shiftMode = true;
        console.log("shift engaged");
        this.shiftRow(highlightPosition);
        numShifts--;
    }
    
    // Row shift right
    if (this.keys[16] === true && this.keys[39] === true) {
        this.keys[16] = 'triggered';
        this.keys[39] = 'triggered';
        shiftMode = true;
        this.shiftRow(highlightPosition);
        numShifts--;
    }
    
    // Column shift up
    if (this.keys[16] === true && this.keys[38] === true) {
        this.keys[16] = 'triggered';
        this.keys[38] = 'triggered';
        shiftMode = true;
        this.shiftCol(highlightPosition);
        numShifts--;
    }
    
    // Column shift down
    if (this.keys[16] === true && this.keys[40] === true) {
        this.keys[16] = 'triggered';
        this.keys[40] = 'triggered';
        shiftMode = true;
        this.shiftCol(highlightPosition);
        numShifts--;
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
        // Initialize the spotlight
        that.cubeLight();
        // Loop
        requestAnimationFrame(loop, that.renderer.domElement);
    };
    loop();  
};

Game.prototype.won = function(position) {
    if (this.robot.position.y == 5){
        console.log("you won!");
    }
}

$(function() {
  
  var game = new Game();
  game.init();
  game.start();
  
});
