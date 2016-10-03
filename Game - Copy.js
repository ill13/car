var game = new Phaser.Game(640, 480, Phaser.AUTO, 'ill13-trailer', { preload: preload, create: create, render: render, update: update });
var left=false,right=false,fire=false,jump=false,bAccel=false,bBrake=false;

var data01;
var data02;
var debug=false;
var car;
var ghost;
var vehicle;

var maxSpeed=5;
var brakingAbility=15;
var engineForce=0;
var maxSteer = Math.PI / 12;
var tireGrip=160; //sideFriction


var bmd;
var path=[];
var pi=0;
var dx=0
var dy=0;
var angleTest;
var newTmp=0;


function preload() {
	game.load.image('car', 'assets/images/car01.png');
	game.load.image('ghost', 'assets/images/car01.png');
}


function create() {
	this.stage.disableVisibilityChange = true;//diasble apuse on lost focus
	game.physics.startSystem(Phaser.Physics.P2JS);

	cursors = game.input.keyboard.createCursorKeys();
	wasd = {
		accelerate: game.input.keyboard.addKey(Phaser.Keyboard.W),
		brake:game.input.keyboard.addKey(Phaser.Keyboard.E),
		left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		right: game.input.keyboard.addKey(Phaser.Keyboard.D),
		reverse: game.input.keyboard.addKey(Phaser.Keyboard.S),
	};


	car = game.add.sprite(32,100, 'car', 0);
	game.physics.p2.enable( car,debug);
	vehicle = new p2.TopDownVehicle(car.body.data);// Create the vehicle
	playerfrontWheel = vehicle.addWheel({localPosition: [0, 0.5] });
	playerbackWheel = vehicle.addWheel({localPosition: [0, -0.5]});
	playerfrontWheel.setSideFriction(tireGrip);
	playerbackWheel.setSideFriction(tireGrip/2);
	vehicle.addToWorld(game.physics.p2.world);
	playerfrontWheel.steerValue =0;// Math.PI / 16;
	playerbackWheel.engineForce = 0;// Engine force forward
	playerbackWheel.setBrakeForce(0);

	ghost = game.add.sprite(46,275, 'ghost', 0);
	game.physics.p2.enable( ghost,debug);
	ghostvehicle = new p2.TopDownVehicle(ghost.body.data);// Create the vehicle
	ghostfrontWheel = ghostvehicle.addWheel({localPosition: [0, 0.5] });
	ghostbackWheel = ghostvehicle.addWheel({localPosition: [0, -0.5]});
	ghostfrontWheel.setSideFriction(tireGrip);
	ghostbackWheel.setSideFriction(tireGrip/2);
	ghostvehicle.addToWorld(game.physics.p2.world);
	ghostfrontWheel.steerValue =0;// Math.PI / 16;
	ghostbackWheel.engineForce = 0;// Engine force forward
	ghostbackWheel.setBrakeForce(0);
	//ghost.anchor.setTo(1, 1);
	//ghost.anchor.set(0.5);

	bmd = game.add.bitmapData(game.width, game.height);
    bmd.addToWorld();
	points = {
		"x":[46,100,500,550,100,46],
		"y":[275,100,100,350,400,275]
	};

    var py = points.y;

    plot();

}

function plot() {
	bmd.clear();
	path = [];
	var ix = 0;
	var x = 1 / game.width;
	for (var i = 0; i <= 1; i += x) {
		// var px = Phaser.Math.linearInterpolation(points.x, i);
		// var py = Phaser.Math.linearInterpolation(points.y, i);
		// var px = Phaser.Math.bezierInterpolation(points.x, i);
		// var py = Phaser.Math.bezierInterpolation(points.y, i);
		var px = Phaser.Math.catmullRomInterpolation(points.x, i);
		var py = Phaser.Math.catmullRomInterpolation(points.y, i);
		//path.push( { x: px, y: py });

		var node = { x: px, y: py, angle: ix };

		if (ix > 0){
		    node.angle =Phaser.Math.angleBetweenPoints(path[ix-1], node);
		//	node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
			//carRotation= Math.atan2(px, py);
			//tmp = carRotation + game.math.degToRad(77);
			//var angle = (tmp + (Math.PI / 16));
		}
		path.push(node);
		ix++;


		bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
	}

	for (var p = 0; p < points.x.length; p++) {
		bmd.rect(points.x[p]-3, points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
	}

}
var test=true;
var ghostmaxPower=2;

function fmod(a,b) {
	return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
 };

function update() {
	playerControl();
/*
	//follow player01
	var dx = Math.floor(car.position.x - ghost.position.x);
	var dy = Math.floor(car.position.y -  ghost.position.y);
	bulletRotation= Math.atan2(dy, dx);
	ghost.rotation = bulletRotation + game.math.degToRad(90);
	var angle = (ghost.rotation + (Math.PI / 16));
	ghost.body.data.angle=angle;
//*/

//*
	//follow path01
	dx = (path[pi].x - ghost.position.x);
	dy = (path[pi].y -  ghost.position.y);
	carRotation= Math.atan2(dy, dx); //angle in radians
//	carRotation=carRotation*(180/Math.PI);//    angle in degrees = radians * (180 / Pi)
	//Math.fmod = function (a,b) { return Number((a - (Math.floor(a / b) * b)).toPrecision(8)); };
	//carRotation = fmod(carRotation + 360, 360);
	tmp = carRotation + 1.3439035240356338;//game.math.degToRad(77);
	angleTest= (tmp + maxSteer);
//*/
	//follow path02
	//angleTest=path[pi].angle+(Math.PI / 32);//+game.math.degToRad(77);
	ghost.body.data.angle=angleTest;
	ghostbackWheel.engineForce=ghostmaxPower;

	wpDistance=Phaser.Math.distance(ghost.position.x,ghost.position.y, path[pi].x,path[pi].y);
	console.log(wpDistance);

	if(wpDistance<2){
		pi++;
	}

	if ((dx<10 && dx>2) && (dy<10 && dy>2)){
	//	ghostbackWheel.setBrakeForce(5);

	//	ghostbackWheel.engineForce=0.5;
 	}else{
		ghostbackWheel.engineForce=ghostmaxPower;
		ghostbackWheel.setBrakeForce(0);
	}

	if ((dx<2) && (dy<2)){
		//pi++;
		ghostbackWheel.engineForce=ghostmaxPower;
	}


	if (pi >= path.length){
		pi = 0;
	}

	//console.log("path: " +newTmp+" manual: "+angleTest);

	if (test){
	//	console.log(path);
	// console.log(path[1].angle,angleTest);
	// console.log(path[2].angle,angleTest);
console.log( game.math.degToRad(77));
		test=false;
	}
	//console.log(newTmp);

	data01= Math.round(ghostbackWheel.getSpeed());
	//*/
}

function render() {
	game.debug.text(data01, 4, 16);
	game.debug.text(data02, 4, 32);
	game.debug.text(Math.floor(game.input.mousePointer.x),4,48);
	game.debug.text(Math.floor(game.input.mousePointer.y),64,48);
}



function playerControl(){
	playerbackWheel.setBrakeForce(0);
	playerbackWheel.engineForce=0;
	 playerfrontWheel.steerValue = maxSteer * (((wasd.right.isDown) || (cursors.right.isDown) || right ) - ((wasd.left.isDown) || (cursors.left.isDown)|| left ));// Steer value zero means

   if((wasd.reverse.isDown) || (bBrake)){
		 playerbackWheel.setBrakeForce(0);
		 playerbackWheel.engineForce = -(1 * maxSpeed);// Moving backwards - reverse the engine force
   }

   if((wasd.accelerate.isDown) || (cursors.up.isDown) || (bAccel)){
		 playerbackWheel.engineForce =  1.5 * maxSpeed;
   }

   if ((cursors.down.isDown) || (wasd.brake.isDown)){
	   if(   playerbackWheel.getSpeed() > 0.1){
			 playerbackWheel.setBrakeForce(brakingAbility);// Moving forward - add some brake force to slow down (needed or no reverse?)
	   }else{
	   }
   }

}
