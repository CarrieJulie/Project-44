var bow, bowImg;
var extraImg;
var arrowGroup, arrowImg;
var birdGroup, bird1, bird2;
var bubble1, bubble2, bubble3, bubbleGroup;
var bgImg;
var gameState = "start";
var left, right, ground, shootArea;
var start, startImg;
var reset, resetImg;
var score = 0;
var lives = 3;
var popSound;

function preload()
{
	bowImg = loadImage("bow.png");
	arrowImg = loadImage("arrow-1.png");
	bubble1 = loadImage("bubble1.png");
	bubble2 = loadImage("bubble2.png");
	bubble3 = loadImage("bubble3.png");
	bgImg = loadImage("back.jpg");
	extraImg = loadImage("bubblebg.jpg");
	startImg = loadImage("start.png");
	resetImg = loadImage("restart.png");

	bird1 = loadAnimation("bird11.png", "bird12.png", "bird13.png", "bird14.png", "bird15.png");
	bird2 = loadAnimation("bird21.png", "bird22.png", "bird23.png", "bird24.png", "bird25.png");

	birdGroup = new Group();
	arrowGroup = new Group();
	bubbleGroup = new Group();

	popSound = loadSound("sfx-pop.mp3");
}

function setup()
{
	createCanvas(800, 600);

	left = createSprite(0, 300, 25, 600);
	left.visible = false;

	right = createSprite(800, 300, 25, 600);
	right.visible = false;

	ground = createSprite(400, 600, 800, 10);
	ground.visible = false;

	shootArea = createSprite(400, 500, 800, 200);

	start = createSprite(400, 350, 10, 10);
	start.addImage(startImg);
	start.scale = 0.5;

	reset = createSprite(400, 350, 10, 10);
	reset.addImage(resetImg);
	reset.scale = 0.05;
	reset.visible = false;

	bow = createSprite(400, 530, 10, 10);
	bow.addImage(bowImg);
	bow.scale = 0.9;

}

function draw()
{

	if (gameState === "start")
	{
		startingGame();
	}

	if (gameState === "waiting")
	{
		start.visible = false;
		bow.x = 400;
		bow.y = 530;
		gameState = "play";
		shootArea.visible = false;
	}

	if (gameState === "play")
	{
		playingGame();
	}

	if (gameState === "lost")
	{
		lostGame();
	}

	if (gameState === "win")
	{
		wonGame();
	}
	drawSprites();
}

function startingGame()
{
	background("#0a1172");

	textSize(20);
	fill("#ffffc2")
	text("Pop the Bubbles", 325, 150);
	text("Move the bow with your Mouse", 250, 180);
	text("Click mouse over the Grey area to shoot Arrows", 190, 210);
	text("Watch out for Birds from the sides!", 240, 240);

	bow.x = mouseX;

	if (mousePressedOver(start))
	{
		gameState = "waiting";
	}

	if (mousePressedOver(shootArea))
	{
		shootArrows();
	}

	bow.collide(left);
	bow.collide(right);
}

function playingGame()
{
	background(bgImg);
	textSize(25);
	fill("white");
	stroke("black");
	text("Score: " + score, 50, 50);
	text("Lives: " + lives, 660, 50);

	bow.x = mouseX;

	if (mousePressedOver(shootArea))
	{
		shootArrows();
	}

	if (bubbleGroup.collide(ground))
	{
		reduceLife();
		bubbleGroup.destroyEach();
	}

	if (frameCount % 600 === 0)
	{
		spawnBirds();
	}

	if (arrowGroup.isTouching(birdGroup))
	{
		reduceLife();
		birdGroup.destroyEach();
		arrowGroup.destroyEach();
	}

	if (score == 25)
	{
		gameState = "win";
	}

	spawnBubbles();
	checkBubbleCollision();
	bow.collide(left);
	bow.collide(right);
}

function lostGame()
{
	background(extraImg);

	textSize(25);
	fill("white");
	stroke("black");
	text("You Lost The Game!!", 280, 250);
	reset.visible = true;

	if (mousePressedOver(reset))
	{
		location.reload();
	}
}

function spawnBubbles()
{
	if (frameCount % 140 === 0)
	{
		var rand = Math.round(random(1,3));
		var bubble = createSprite(400, -50, 10, 10);
		bubble.x = random(50, 750);
		if (rand == 1)
		{
			bubble.addImage(bubble1);
			bubble.velocityY = 6;
			bubble.scale = 0.03;
		} else 
		if(rand == 2)
		{
			bubble.addImage(bubble2);
			bubble.velocityY = 5;
			bubble.scale = 0.1;
		} else {
			bubble.addImage(bubble3);
			bubble.velocityY = 5;
			bubble.scale = 0.08;
		}

		bubbleGroup.add(bubble);
		bubble.lifetime = 1000;
	}
}

function shootArrows()
{
	var arrow = createSprite(400, 300, 10, 10);
	arrow.x = bow.x;
	arrow.y = bow.y;
	arrow.addImage(arrowImg);
	arrow.velocityY = -6;
	arrow.scale = 0.5;
	arrow.lifetime = 1000;
	arrowGroup.add(arrow);
}

function checkBubbleCollision()
{
	if (arrowGroup.isTouching(bubbleGroup))
	{
		arrowGroup.destroyEach();
		bubbleGroup.destroyEach();
		popSound.play();
		score = score + 1;
	}
}

function reduceLife()
{
	lives = lives - 1;

	if (lives == 0)
	{
		gameState = "lost";
	}
}

function spawnBirds()
{
	var bird = createSprite(400, 300, 10, 10);
	var rand = Math.round(random(1,2));

	if (rand == 1)
	{
		bird.x = -50;
		bird.y = random(50, 550);
		bird.velocityX = 7;
		bird.addAnimation("left", bird2);
		bird.scale = 0.2;

	} else {
		bird.x = 850;
		bird.y = random(50, 550);
		bird.velocityX = -7;
		bird.addAnimation("right", bird1);
		bird.scale = 0.2;
	}

	birdGroup.add(bird);
	bird.lifetime = 1000;
}

function wonGame()
{
	background(extraImg);

	textSize(25);
	fill("white");
	stroke("black");
	text("You Won The Game!!", 280, 250);
	reset.visible = true;

	if (mousePressedOver(reset))
	{
		location.reload();
	}
}