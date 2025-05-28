// Verander het canvas en context naar specifieke namen als je meerdere canvassen gebruikt
const canvas = document.getElementById("gameCanvas"); // Zorg ervoor dat het canvas element correct is.
const ctx = canvas.getContext("2d");

// Variabelen voor het tweede spel
let gameOver = false;
let gameWon = false;
let score = 0;
let pipes = [];
let pipeCount = 0;
let portalVisible = false;
let portalAlpha = 0;
let portalDelay = 0;
let portalX = canvas.width + 200;
let bird = {
  x: 50,
  y: 150,
  width: 50,
  height: 50,
  velocity: 0,
  lift: -10
};
let pipeSpeed = 2;
let pipeWidth = 50;
let gap = 150;
let goldPipeImage = new Image();
let cloudImage = new Image();
let citySkyline = new Image();
let winBackground = new Image();
let gameOverBackground = new Image();
let portalImage = new Image();

// Zorg ervoor dat je de afbeeldingen laad voordat het spel start
goldPipeImage.src = "goldPipe.png";
cloudImage.src = "cloudImage.png";
citySkyline.src = "citySkyline.png";
winBackground.src = "winBackground.png";
gameOverBackground.src = "gameOverBackground.png";
portalImage.src = "portalImage.png";

// Wacht totdat alle afbeeldingen geladen zijn
let imagesLoaded = 0;
const totalImages = 6;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    // Start het game loop zodra alle afbeeldingen geladen zijn
    gameLoop();
  }
}

// Voeg een onload event toe aan elke afbeelding
goldPipeImage.onload = checkImagesLoaded;
cloudImage.onload = checkImagesLoaded;
citySkyline.onload = checkImagesLoaded;
winBackground.onload = checkImagesLoaded;
gameOverBackground.onload = checkImagesLoaded;
portalImage.onload = checkImagesLoaded;

// Functie voor achtergrond tekenen
function drawBackground() {
  if (gameWon) {
    ctx.drawImage(winBackground, 0, 0, canvas.width, canvas.height);
  } else if (gameOver) {
    ctx.drawImage(gameOverBackground, 0, 0, canvas.width, canvas.height);
  } else {
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#FF7F50");
    gradient.addColorStop(0.5, "#FF6347");
    gradient.addColorStop(1, "#8A2BE2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  let skylineWidth = citySkyline.width;
  for (let i = 0; i < Math.ceil(canvas.width / skylineWidth); i++) {
    ctx.drawImage(citySkyline, i * skylineWidth, canvas.height - citySkyline.height, skylineWidth, citySkyline.height);
  }

  let cloudWidth = 300;
  let cloudHeight = 150;
  let cloudY = 100;
  for (let i = 0; i < Math.ceil(canvas.width / cloudWidth) + 1; i++) {
    ctx.drawImage(cloudImage, i * cloudWidth, cloudY, cloudWidth, cloudHeight);
  }
}

// Functie voor het tekenen van pijpen
function drawPipes() {
  pipes.forEach((pipe, index) => {
    if (index === 14) {
      ctx.drawImage(goldPipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
      ctx.save();
      ctx.translate(pipe.x + pipeWidth / 2, pipe.bottomY + (canvas.height - pipe.bottomY) / 2);
      ctx.rotate(Math.PI);
      ctx.drawImage(goldPipeImage, -pipeWidth / 2, -(canvas.height - pipe.bottomY) / 2, pipeWidth, canvas.height - pipe.bottomY);
      ctx.restore();
    } else {
      ctx.fillStyle = "#228b22";
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    }
  });
}

// Functie om pijpen te updaten
function updatePipes() {
  if (pipeCount < 15) {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
      const pipeTopHeight = Math.floor(Math.random() * (canvas.height - gap - 200)); 
      pipes.push({
        x: canvas.width,
        topHeight: pipeTopHeight,
        bottomY: pipeTopHeight + gap,
      });
      pipeCount++;
    }
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
    }
  });

  pipes.forEach((pipe) => {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth && (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)) {
      gameOver = true;
    }
  });

  if (pipeCount === 15) {
    portalDelay++;
    if (portalDelay > 100) {
      portalVisible = true;
    }
  }

  if (portalVisible && portalAlpha < 1) {
    portalAlpha += 0.02;
  }

  if (portalVisible) {
    portalX -= 2;
  }

  if (bird.x + bird.width > portalX && bird.x < portalX + portalImage.width && bird.y + bird.height > portalY && bird.y < portalY + portalImage.height) {
    gameWon = true;
  }
}

// Functie om de score te tekenen
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "40px 'Press Start 2P', cursive";
  const textWidth = ctx.measureText(`Score: ${score}`).width;
  const xPosition = (canvas.width - textWidth) / 2;
  const yPosition = 50;
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.strokeText(`Score: ${score}`, xPosition, yPosition);
  ctx.fillStyle = "#fff";
  ctx.fillText(`Score: ${score}`, xPosition, yPosition);
}

// Functie om het spel te resetten
function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  pipeCount = 0;
  portalVisible = false;
  portalAlpha = 0;
  portalX = canvas.width + 200;
  portalDelay = 0;
  gameOver = false;
  gameWon = false;
}

// Functie voor het Game Over scherm
function drawGameOver() {
  ctx.drawImage(gameOverBackground, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "100px 'Press Start 2P', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#000";
  ctx.strokeText("Game Over!", canvas.width / 2, canvas.height / 2 - 50);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = "30px 'Press Start 2P', cursive";
  ctx.lineWidth = 4;
  ctx.strokeText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 50);
}

// Functie voor het Win scherm
function drawWinScreen() {
  ctx.drawImage(winBackground, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "100px 'Press Start 2P', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#000";
  ctx.strokeText("WIN!", canvas.width / 2, canvas.height / 2 - 50);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("WIN!", canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = "30px 'Press Start 2P', cursive";
  ctx.lineWidth = 4;
  ctx.strokeText("Next Game", canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Next Game", canvas.width / 2, canvas.height / 2 + 50);
}

// Gebruikersinvoer (spatiebalk om het spel te starten)
document.addEventListener("keydown", (e) => {
  if (e.key === " " && !gameOver && !gameWon) {
    bird.velocity = bird.lift;
  } else if (e.key === " " && gameOver) {
    resetGame();
    gameLoop();
  }
});

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameWon) {
    drawWinScreen();
  } else if (gameOver) {
    drawGameOver();
  } else {
    drawBackground();
    drawPipes();
    updatePipes();
    drawScore();

    if (portalVisible) {
      const portalY = (canvas.height - portalImage.height) / 2;

      ctx.save();
      ctx.globalAlpha = portalAlpha;
      ctx.drawImage(portalImage, portalX, portalY);
      ctx.restore();
    }

    requestAnimationFrame(gameLoop);
  }
}
