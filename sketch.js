var trex, trex_running, trex_collided, restartImage, GameOverImage, restart, Gameover ;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImage = loadImage("restart.png");
  GameOverImage = loadImage("gameOver.png"); 
}

function setup() {
  createCanvas(displayWidth, displayHeight - 200);
  
  trex = createSprite(camera.position.x ,displayHeight - 250 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation('collided',trex_collided);
  trex.scale = 0.5;
  trex.velocityX = 4;
  trexInitialPos = trex.x;
  
  restart = createSprite(300,140);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  gameOver = createSprite(300,100);
  gameOver.addImage(GameOverImage);
  gameOver.scale = 0.75;
  ground = createSprite(displayWidth/2 ,displayHeight - 250,displayWidth, 20);
  ground.addImage("ground",groundImage);
  // ground.x = ground.width /2;
  // ground.velocityX = -4;
  
  // invisibleGround = createSprite(200,190,400,10);
  // invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
//set background to white
  background(255,255,255);
  //display score
  camera.position.x = trex.x;
  text('Score:'+ score, trex.x + 250, displayHeight/4);
  // console.log(trex.y);
  
  if(gameState === PLAY){
    //move the ground
    trex.velocityX = (6 + 3*score/100);
    //scoring
    score = score + Math.round(World.frameRate/60);
    
    // if (score>0 && score%100 === 0){
    //   playSound("checkPoint.mp3");
    // }
    
    var trexPosB4 = trex.x

    if (trex.x + 500 > (3*ground.width)/4){
      trex.x = trexInitialPos;
      console.log('Trex Position After' + trex.x)
      console.log(trexPosB4);
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y > 400){
      trex.velocityY = -12 ;
      }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
          }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(ground);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + (width/2), trex.y - 200, 40,10);
    cloud.y = Math.round(random(trex.y - 100, trex.y - 250));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 90 === 0) {
    var obstacle = createSprite(trex.x + (width/2),displayHeight - 280,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}