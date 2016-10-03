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
var maxSteer = Math.PI / 9;
var tireGrip=160; //sideFriction

var bmd;
var path=[];
var points = {
	"x":[82,560,560,82,82],
	"y":[82,82,400,400,82]
};
// var points = {
// 	"x":[100,560,576,100,100],
// 	"y":[100,100,400,400,100]
// };

var at=0;
var currentNode=0;
var playerDistance=0;
var wpDistance=0;
var ghostPosition=0;
var curNodePosition=0;
var pathDirection=0;

var sliderBounds;
var sliderBG;
var slider;
var sliderVal;


function preload() {
	game.load.image('car', 'assets/images/car01.png');
	game.load.image('ghost', 'assets/images/car01.png');
	game.load.image('track', 'assets/images/track01.png');
	game.load.image('slider', 'assets/controls/brick1.png');
}

function create() {

	this.stage.disableVisibilityChange = true;//diasble apuse on lost focus
	game.add.image(0, 0, 'track');



	addSlider();

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

    var py = points.y;

    plot();

	nodeTimer=0;
	pathTimer=0;
	tmpTimer=0;



}

function addSlider(){
	sliderBounds= new Phaser.Rectangle(600,100,632, 216);
	sliderBG=game.add.graphics(sliderBounds.x,sliderBounds.y);
	sliderBG.beginFill(0x000044);
	sliderBG.drawRect(0,0,32,216);
	slider = game.add.sprite(616, 108, 'slider');
	slider.y=120;
    slider.inputEnabled = true;
	slider.anchor.set(0.5);
    slider.input.enableDrag();
    slider.input.allowHorizontalDrag = false;
	slider.input.boundsRect=sliderBounds;
}

function plot() {
	bmd.clear();
	path = [];
	var ix = 0;
	var x = 1 / game.width;
	for (var i = 0; i <= 1; i += x) {
		var px = Phaser.Math.linearInterpolation(points.x, i);
		var py = Phaser.Math.linearInterpolation(points.y, i);

		// var px = Phaser.Math.bezierInterpolation(points.x, i);
		// var py = Phaser.Math.bezierInterpolation(points.y, i);

		// var px = Phaser.Math.catmullRomInterpolation(points.x, i);
		// var py = Phaser.Math.catmullRomInterpolation(points.y, i);
		//path.push( { x: px, y: py });

	//	var node = { x: px, y: py, angle: ix };
		var node = { x: px, y: py};
		path.push(node);

		if (ix > 0){
		//    node.angle =Phaser.Math.angleBetweenPoints(path[ix-1], node);
		}
		//path.push(node);
		ix++;


		bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
	}

	for (var p = 0; p < points.x.length; p++) {
		bmd.rect(points.x[p]-3, points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
	}

}

function update() {
	nodeTimer += this.time.elapsed;
	pathTimer += this.time.elapsed;
	tmpTimer += this.time.elapsed;

	if(wpDistance<12){
	//	at=(Phaser.Math.angleBetweenPoints(ghostPosition,curNodePosition)+ game.math.degToRad(77)+maxSteer);
	ghostbackWheel.engineForce=0;
		if(pathTimer > 2000) {
			pathTimer=0;
			currentNode++;
			pathDirection++;
			console.log(currentNode,wpDistance);
		}
	}

	if(wpDistance>16){
	//	at=(Phaser.Math.angleBetweenPoints(ghostPosition,curNodePosition)+ game.math.degToRad(77)+maxSteer);
		ghostbackWheel.engineForce=2;
		if(tmpTimer >250) {
			tmpTimer=0;
		//	ghostbackWheel.setBrakeForce(80);
		//	console.log('braking');
		}
	//	ghostbackWheel.setBrakeForce(0);
	}


	if (currentNode>3) {
		currentNode=0;
		pathDirection=0;
	}
	//pathDirection++;

	playerControl();

	//wpDistance=Phaser.Math.distance(ghost.position.x,ghost.position.y, path[currentNode].x,path[currentNode].y);

	wpDistance=Phaser.Math.distance(ghost.position.x,ghost.position.y, points.x[currentNode]-3, points.y[currentNode]-3);

	ghostPosition = {x: ghost.position.x, y: ghost.position.y};
	carPosition = {x: car.position.x, y: car.position.y};
	curPathDirection = {x: path[pathDirection].x, y: path[pathDirection].y};
	curNodePosition = {x: points.x[currentNode]+1, y:  points.y[currentNode]+1};

	playerDistance=Phaser.Math.distance(ghostPosition, carPosition);

	//      var px = Phaser.math.catmullRomInterpolation(this.points.x, i);
	//      var px = Phaser.math.catmullRomInterpolation(this.points.y, i);


	//folow player
	//	at=(Phaser.Math.angleBetweenPoints(ghostPosition,carPosition)+ game.math.degToRad(77)+maxSteer);



	sliderVal=((slider.y-108)/2)*0.001;
	//console.log(sliderVal);

	if(nodeTimer >125) {
		nodeTimer=0;
		//folow waypoints
		at=(Phaser.Math.angleBetweenPoints(ghostPosition,curNodePosition)+ game.math.degToRad(77)+0.055);//sliderVal);
	//	at=(Phaser.Math.angleBetweenPoints(ghostPosition,curPathDirection)+ game.math.degToRad(77)+maxSteer);
	}

	ghost.body.data.angle=at;
	//ghostbackWheel.engineForce=2;
	// console.log((slider.y-108)/2);



	//	wpDistance=Phaser.Math.distance(ghostPosition, curNodePosition);
	//	playerDistance=Phaser.Math.distance(ghost.position.x,ghost.position.y, car.position.x,car.position.y);
	//console.log(Math.floor(wpDistance), ghostPosition);
	//console.log("CN: ",currentNode," CNX ",path[currentNode].x," + ",Math.floor(wpDistance));


}

function render() {
	game.debug.text(Math.floor(wpDistance), 4, 16);
	game.debug.text((sliderVal), 40, 16);
	// game.debug.text(wpDistance, 4, 32);
	game.debug.text(Math.floor(game.input.mousePointer.x),4,48);
	game.debug.text(Math.floor(game.input.mousePointer.y),64,48);
	// 	game.debug.text(Math.floor(dx),4,48);
	// 	game.debug.text(Math.floor(dy),64,48);
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




/*


	//follow player01
	var dx = Math.floor(car.position.x - ghost.position.x);
	var dy = Math.floor(car.position.y -  ghost.position.y);
	Math.atan2(dy, dx);
	at=(Phaser.Math.angleBetweenPoints(ghostPosition,carPosition)+ game.math.degToRad(77)+maxSteer);
	ghost.rotation = carRotation + game.math.degToRad(77);
	at = (ghost.rotation + (Math.PI / 16));
	at = (carRotation+ (Math.PI / 16));
	ghost.body.data.angle=angle;


	at=(at+(Math.sin(Phaser.Math.angleBetweenPoints(ghostPosition,curNodePosition))-at))*100;
	at=(at+(Math.cos(Phaser.Math.angleBetweenPoints(ghostPosition,carPosition))-at))*200;

	wpDistance=Phaser.Math.distance(ghostPosition, curNodePosition);



*/
