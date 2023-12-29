"use strict";

var globalID;
var globalID2;

function playSound() {
	var audio = new Audio('audio/swish.mp3');
	audio.play();
  }

var Score = function (){
    this.playerScore = 0;
	this.playerShot = 0;
	this.playerShotMax = 0;
};

Score.prototype.draw = function (ctx) {
	ctx.font = "22px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("您的關鍵一投 (空白鍵 or 滑鼠左鍵)，攸關台灣未來。", 35, 765);
	ctx.font = "22px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Score = " + this.playerScore, 370, 550);
	ctx.font = "20px Arial";
    ctx.fillStyle = '#ffff66';
	let percentage = Number(this.playerScore/this.playerShot*100).toFixed(2);
	if (this.playerShot == 0) {
		percentage = "--";
	}
	ctx.fillText(`FG = ${this.playerScore} / ${this.playerShot} = ${percentage}%`, 550, 550);
    if (this.playerScore == 3) {
    	ctx.font = "24px Arial";
    	ctx.fillStyle = 'yellow';
    	ctx.fillText("YOU'RE ON FIRE！", 850, 660);
		globalID = requestAnimationFrame(drawFlames);
	} 
	else if (this.playerScore == 10) {
    	ctx.font = "24px Arial";
    	ctx.fillStyle = 'yellow';
    	ctx.fillText("Excellent Shooter！", 850, 660);
	} 
	else {
		cancelAnimationFrame(drawFlames);
	}
};

var AngleClass = function (x, y){
	this.x = 200;
	this.y = 550;
	this.direction = -1; // Starts out moving left
};

AngleClass.prototype.draw = function(ctx){
	//start
	ctx.beginPath();
	ctx.strokeStyle = 'aqua';
	ctx.lineWidth = 2.5;
	ctx.moveTo(140, 610);
	ctx.lineTo(this.x, this.y);
	ctx.stroke();
	ctx.closePath();
};

AngleClass.prototype.change = function(newX, newY){
	// this.x -= newX
	this.x += newX * this.direction;
	this.y += newY * this.direction;

	// console.log(this.x, this.direction);
	if (this.x < 175) {
		// this.x += newX/2
		this.direction = 1;
	} else if(this.y > 560) {
		this.direction = -1;
	}
};

var Ball = function(x,y,radius){
	this.x = x;
	this.y = y;
	this.radius = 0;
	this.startAngle = 0;
	this.endAngle = Math.PI*2;
	this.xVel = 0;
	this.yVel = 0;
	this.made = false;
};

Ball.prototype.draw = function (ctx){
	//ball
	ctx.beginPath();
	ctx.arc(this.x,this.y,37.5,0,Math.PI*2,true);
	ctx.fillStyle = "orange";
	ctx.strokeStyle = "black";
	ctx.fill();
	ctx.closePath();

	// lines on ball
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(this.x - 37, this.y);
	ctx.lineTo(this.x + 37, this.y);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(this.x, this.y - 37);
	ctx.lineTo(this.x, this.y + 37);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(this.x - 18, this.y - 30);
	ctx.lineTo(this.x - 18, this.y + 30);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.moveTo(this.x + 18, this.y - 30);
	ctx.lineTo(this.x + 18, this.y + 30);
	ctx.stroke();
	ctx.closePath();
};

Ball.prototype.shot = function (xVelocity,yVelocity){
	var self = this;
	this.xVel = xVelocity;
	this.yVel = yVelocity;

	var timer = setInterval(function () {
		self.move(timer,newScore);

	},1000/60);
};

Ball.prototype.move = function(timeVar,score) {
	if (score.playerShot > score.playerShotMax && score.playerShotMax > 0) {
		score.playerScore = 0;
		score.playerShot = 1;
		score.playerShotMax = 0;
	}
	if (score.playerScore == 10) {
		score.playerShotMax = score.playerShot;
	}
	if (this.x == 100) {
		score.playerShot ++;
	}
    if(!this.collide(newHoop)){ //doesn't collide with any object
		this.x+=this.xVel;
	    this.y+=this.yVel;
	    this.yVel+= 1; //gravity is 1
	    if(this.x > 1270 || this.y > 800) {
	    	if(!this.made){
	    		//score.playerScore = 0;
	    	}
	    	this.reset(timeVar);
	    }
    } else if (this.collide(newHoop) == 1){
		score.playerScore ++;
    	this.hoopAnimation();
		playSound();
    } else if (this.collide(newHoop) == 2){
    	this.xVel = this.xVel * -1;
    	this.x += this.xVel-3;
		this.y += this.yVel;
		if(this.x + this.radius <= Hoop.hoopX - 90 && this.x + this.radius >= Hoop.hoopX - 160 && this.y + this.radius >= Hoop.hoopY + 125 && this.y + this.radius <= Hoop.hoopY + 140) {
			this.made = true;
			return 1;
		}
    } else if (this.collide(newHoop) == 3){
    	this.xVel = this.xVel * -1;
    	this.yVel = this.yVel * -1;
    	this.x += this.xVel;
		this.y += this.yVel;
	}
};

Ball.prototype.collide = function(hoop) {
	
	if(this.x + this.radius <= hoop.hoopX - 90 && this.x + this.radius >= hoop.hoopX - 160 && this.y + this.radius >= hoop.hoopY + 125 && this.y + this.radius <= hoop.hoopY + 140) {
		this.made = true;
		return 1;
	
	} else if (this.x + this.radius >= hoop.hoopX - 60 && this.x + this.radius >= hoop.hoopX - 40 && this.y >= hoop.hoopY - 20 && this.y <= hoop.hoopY + 150) {
		return 2;
	
	} else if (this.x + this.radius >= hoop.hoopX - 195 && this.x + this.radius <= hoop.hoopX - 160 && this.y + this.radius >= hoop.hoopY + 125 && this.y + this.radius <= hoop.hoopY + 155){
		return 2;
	//back rim collision
	} else if (this.x + this.radius >= hoop.hoopX - 90 && this.x + this.radius <= hoop.hoopX - 40 && this.y + this.radius >= hoop.hoopY + 125 && this.y + this.radius <= hoop.hoopY + 150) {
		return 3;
	}
};

Ball.prototype.hoopAnimation = function(timeVar){
	this.xVel = 0;
	this.y += this.yVel;
    if(this.y > 550) {
		this.reset(timeVar);
    }
};

Ball.prototype.reset = function(timeVar){
	this.x = 100;
	this.y = 650;
	this.made = false;
	
	clearInterval(timeVar);
};


var Hoop = function (hoopX,hoopY,hoopEndX,hoopEndY) {
	this.hoopX = hoopX;
	this.hoopY = hoopY;
	this.hoopEndX = hoopEndX;
	this.hoopEndY = hoopEndY;
};

Hoop.prototype.draw = function (ctx) {
	
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.hoopX, this.hoopY);
	ctx.lineTo(this.hoopEndX, this.hoopEndY);
	ctx.stroke();
	ctx.closePath();
	//support beam one
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 5.5;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.hoopX, this.hoopY + 20);
	ctx.lineTo(this.hoopX - 50, this.hoopY + 50);
	ctx.stroke();
	ctx.closePath();
	//support beam two
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 5.5;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.hoopX, this.hoopY + 100);
	ctx.lineTo(this.hoopX - 50, this.hoopY + 50);
	ctx.stroke();
	ctx.closePath();
	//backboard
	ctx.strokeStyle = 'gray';
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.hoopX - 50, this.hoopY);
	ctx.lineTo(this.hoopX - 50, this.hoopY + 150);
	ctx.stroke();
	ctx.closePath();
	//net
	let startX = this.hoopX - 190;
	let startY = this.hoopY + 130;
	let endX = this.hoopX - 176;
	let endY = this.hoopY + 210;
	for (let i = 0; i < 12; i++){
		ctx.strokeStyle = 'white';
		ctx.lineWidth = '3';
		ctx.lineCap = 'round';
		if(i % 2 === 0){
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.closePath();
			startX += 10;
			startY += 80;
			endX += 10;
			endY -= 80;
		} else {
			ctx.beginPath();
			ctx.moveTo(startX, startY);
			ctx.lineTo(endX, endY);
			ctx.stroke();
			ctx.closePath();
			startX += 10;
			startY -= 80;
			endX += 10;
			endY += 80;
			}
		}
	
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 8;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(this.hoopX - 50, this.hoopY + 130);
	ctx.lineTo(this.hoopX - 190, this.hoopY + 130);
	ctx.stroke();
	ctx.closePath();
	//base
	ctx.beginPath();
	ctx.fillStyle = 'brown';
	ctx.fillRect(this.hoopEndX - 50, this.hoopEndY - 175, 100, 180);
	ctx.closePath();
};


