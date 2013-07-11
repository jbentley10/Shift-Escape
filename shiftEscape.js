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

var newPosition = null;

var cubeLight = null;

var Highlight = null;

var numShifts = 10;

var barrierArray = [];

var i;

var j;

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
    this.isEmpty = false; 
    this.boardPosition = position || {x: -400, y: 400};
    this.type = 'barrier';
    this.geometry = new THREE.CubeGeometry(90, 90, 90);
    // Geometry should always be around origin
    this.material = new THREE.MeshLambertMaterial({color: 0x0033CC});
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
    this.material = new THREE.MeshPhongMaterial({color: 0x0099CC});
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
    this.material = new THREE.MeshPhongMaterial({color: 0x00CC99});
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
    //this.barriers = [];
    
    // Create a new 2D array to hold the position of the barriers
    this.virtualBoard = new Array(8);
    for (var i = 0; i < 8; i++){
        this.virtualBoard[i] = new Array(8);
    }
    
    for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
            this.virtualBoard[x][y] = new Barrier({x: x-3, y: y-3});
        }
    }
    
    // Initialize the robot 
    this.robot = new Robot({x: -1, y: 5});
    
    // Initialize the highlight
    this.highlight = new Highlight({x: -2, y: 5});
    
    // Create and position the camera 
    this.camera = new THREE.PerspectiveCamera(75, 4.0/3.0, 1, 10000);
    this.camera.position.z = 600;
    
    this.scene = new THREE.Scene();
    
    // Add the barriers to the scene
    for(var x = 0; x < 8; x++){
      for(var y = 0; y < 8; y++){
        that.scene.add(this.virtualBoard[x][y].object);
      }
    }
    
    this.scene.add(this.robot.object);
    this.scene.add(this.highlight.object);
    
    // Spotlight
    var spotlight = new THREE.PointLight(0xffffff, 1, 1000);
    spotlight.position.set(0, -100, 300);
    this.scene.add(spotlight);
    // Ambient light
    var ambient_light = new THREE.AmbientLight(0x202020);
    this.scene.add(ambient_light);
    // Add a Background plane to hold the game board
    var bgplane = new THREE.Mesh(new THREE.PlaneGeometry(1300, 1300),
                                 new THREE.MeshBasicMaterial({color: 0x7094FF}));
    bgplane.translateZ(-100);
    bgplane.translateY(200);
    bgplane.translateX(75);
    this.scene.add(bgplane);
    
    // Add a simple background
    var background = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshBasicMaterial({color: 0x00F5B8}));
    background.translateZ(-200);
    this.scene.add(background);
    
    // Add some 3D text to display remaining shifts
    
    
    // Skybox stuff
    // Adding the texture images
    var urlPrefix = "images/";
    var urls = [ urlPrefix + "xpos.jpg", urlPrefix + "xneg.jpg",
                urlPrefix + "ypos.jpg", urlPrefix + "yneg.jpg",
                urlPrefix + "zpos.jpg", urlPrefix + "zneg.jpg" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    var shader = THREE.ShaderLib[ "cube" ];      // Naming and adding the shader
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );    // Importing the texture images
    uniforms['tCube'].value= textureCube;
    var material = new THREE.ShaderMaterial( {
                                            
                                            fragmentShader: shader.fragmentShader,
                                            vertexShader: shader.vertexShader,
                                            uniforms: shader.uniforms
                                            
                                            } ),
    
    skyMesh = new THREE.Mesh( new THREE.CubeGeometry( 100000, 100000, 100000 ), material );
    skyMesh.flipSided = true;
    this.scene.add(skyMesh);
    
    // Render the skybox
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

/* Below is my initial attempt to shift rows and columns
Game.prototype.shiftRow = function(position) {
    barrierArray[i] = barrierArray[i++];
}

Game.prototype.shiftCol = function(position) {
    barrierArray[j] = barrierArray[j++];
    //if (this.position.x === 3)
}
*/

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
        //if (newPosition == this.barriers.position.y)
        //    console.log("You can't move here");
        if (this.legalMove(newPosition) && this.barriers != newPosition) {
            this.robot.moveTo(newPosition);
        }
    }
    // Highlight cube left
    if (this.keys[37] === true && shiftMode === false) {
        this.keys[37] = 'triggered';
          var newPosition = {x: this.highlight.boardPosition.x - 1, y: this.highlight.boardPosition.y};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
      }
    // Highlight cube right
    if (this.keys[39] === true && shiftMode === false) {
        this.keys[39] = 'triggered';
          var newPosition = {x: this.highlight.boardPosition.x + 1, y: this.highlight.boardPosition.y};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
    }
    // Highlight cube up
    if (this.keys[38] === true && shiftMode === false) {
        this.keys[38] = 'triggered';
        var newPosition = {x: this.highlight.boardPosition.x, y: this.highlight.boardPosition.y + 1};
        if (this.legalMove(newPosition)) {
            this.highlight.moveTo(newPosition);
        }
    }
    // Highlight cube down
    if (this.keys[40] === true && shiftMode === false) {
        this.keys[40] = 'triggered';
          var newPosition = {x: this.highlight.boardPosition.x, y: this.highlight.boardPosition.y - 1};
          if (this.legalMove(newPosition)) {
              this.highlight.moveTo(newPosition);
          }
    }
    
    // Enable shift mode
    if (this.keys[16] == true){
        shiftMode = true;
    }
    else {
        shiftmode = false;
    }
    
    // Row shift right
    if (this.keys[39] === true && shiftMode === true) {
        this.keys[39] = 'triggered';
        var b = this.virtualBoard[6][newPosition.y + 3];
        for (var i = 0; i < 7; i++){
            if (i == 0){
                this.virtualBoard[i][newPosition.y + 3] = b;
                                     continue;
            }
            this.virtualBoard[i][newPosition.y + 3] = this.virtualBoard[i - 1][newPosition.y + 3];
        }
        // Update object position (equal to array index)
        for (var i = 0; i < 7; i++){
          var oldPosition = this.virtualBoard[i][newPosition.y + 3].boardPosition;
          oldPosition.x = i - 3;
          this.virtualBoard[i][newPosition.y + 3].moveTo(oldPosition);
        }
        numShifts--;
    }
    
    // Column shift
    if (this.keys[13] === true) {
        this.keys[13] = 'triggered';
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
        alert("you won!");
    }
}

$(function() {
  
  var game = new Game();
  game.init();
  game.start();
  
});
