// Configuratie van de canvas en de crosshair
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const crosshair = document.querySelector('.crosshair');

// Stel canvas in op het volledige scherm
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variabelen voor muispositie en schieten
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Laad de target afbeelding
const targetImage = new Image();
targetImage.src = 'assets/img/target.png.webp';  // Het juiste pad naar de target afbeelding

// Variabelen voor de target
let target = {
  x: Math.random() * (canvas.width - 100),  // Random x positie binnen het canvas
  y: Math.random() * (canvas.height - 100), // Random y positie binnen het canvas
  width: 100,  // Breedte van de target afbeelding
  height: 100  // Hoogte van de target afbeelding
};

// Score en timer variabelen
let score = 0;
let timer = 60;  // Starttimer op 60 seconden
let targetHits = 0;  // Bijhouden van de hits op de targets
let timerInterval;
let gameOver = false; // Game over conditie
let gameWin = false;  // Win conditie

// Array om flits-effecten op te slaan
let flashes = [];

// Functie om de score te tekenen
function drawScore() {
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.font = "40px 'Press Start 2P', cursive";  // Hetzelfde font als eerder gebruikt

  const textWidth = ctx.measureText(`Score: ${score}`).width;
  const xPosition = 10;  // Linksboven
  const yPosition = 50;

  // Zwarte rand rond de tekst
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";  // Zwarte rand
  ctx.strokeText(`Score: ${score}`, xPosition, yPosition);  // Rand tekenen

  // Witte tekst
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.fillText(`Score: ${score}`, xPosition, yPosition);  // De daadwerkelijke score tekst
}

// Functie om de timer te tekenen
function drawTimer() {
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.font = "40px 'Press Start 2P', cursive";  // Pixel font

  const textWidth = ctx.measureText(`Time: ${timer}`).width;
  const xPosition = canvas.width - textWidth - 10;  // Rechtsboven
  const yPosition = 50;

  // Zwarte rand rond de tekst
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";  // Zwarte rand
  ctx.strokeText(`Time: ${timer}`, xPosition, yPosition);  // Rand tekenen

  // Witte tekst
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.fillText(`Time: ${timer}`, xPosition, yPosition);  // De daadwerkelijke timer tekst
}

// Functie om de "Reach 50 hits!" tekst te tekenen
function drawTargetGoal() {
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.font = "40px 'Press Start 2P', cursive";  // Pixel font

  const textWidth = ctx.measureText(`Reach 50 hits!`).width;
  const xPosition = (canvas.width - textWidth) / 2;  // Midden bovenaan
  const yPosition = 50;

  // Zwarte rand rond de tekst
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";  // Zwarte rand
  ctx.strokeText(`Reach 50 hits!`, xPosition, yPosition);  // Rand tekenen

  // Witte tekst
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.fillText(`Reach 50 hits!`, xPosition, yPosition);  // De daadwerkelijke tekst
}

// Functie om de target te tekenen
function drawTarget() {
  ctx.drawImage(targetImage, target.x, target.y, target.width, target.height);
}

// Functie om flits-effecten te tekenen
function drawFlashes() {
  flashes.forEach(flash => {
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);  // Cirkel (flits)
    ctx.fillStyle = `rgba(255, 255, 150, ${flash.alpha})`;  // Witte/geelachtige kleur met doorzichtigheid
    ctx.fill();
    ctx.closePath();

    // Verklein de flits en verminder de doorzichtigheid
    flash.radius += 2;  // Maak de flits groter (duidelijk zichtbaar)
    flash.alpha -= 0.05;  // Verlaag de doorzichtigheid zodat het vervaagt

    // Verwijder flits als deze niet meer zichtbaar is
    if (flash.alpha <= 0) {
      const index = flashes.indexOf(flash);
      if (index > -1) {
        flashes.splice(index, 1);
      }
    }
  });
}

// Volg de muisbeweging
canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Verplaats de crosshair naar de muispositie
  crosshair.style.left = `${mouseX - 15}px`;  // Offset om de crosshair gecentreerd te houden
  crosshair.style.top = `${mouseY - 15}px`;   // Offset om de crosshair gecentreerd te houden
});

// Functie om te schieten (flits-effect bij klik en target check)
function shoot(e) {
  // Maak een flits-effect aan op de klikpositie
  const flash = {
    x: e.clientX,
    y: e.clientY,
    radius: 20,  // Verhoog de radius voor een grotere flits
    alpha: 1      // Begint volledig zichtbaar
  };
  flashes.push(flash);  // Voeg de flits toe aan de lijst van flitsen

  // Check of de klik op de target is
  const dist = Math.sqrt(Math.pow(e.clientX - (target.x + target.width / 2), 2) + Math.pow(e.clientY - (target.y + target.height / 2), 2));

  if (dist < target.width / 2) {
    // Als de klik op de target is, verhoog de score en de hitcount
    score++;  // Verhoog de score met 1
    targetHits++;  // Verhoog het aantal hits

    console.log('Target geraakt!');

    // Zet de target op een nieuwe willekeurige locatie
    target.x = Math.random() * (canvas.width - target.width);
    target.y = Math.random() * (canvas.height - target.height);
  }
}

// Voeg eventlistener toe voor de muisklik
canvas.addEventListener('click', shoot);

// Functie om de timer af te tellen
function countdown() {
  if (timer > 0) {
    timer--;  // Verlaag de timer met 1 seconde
  } else {
    clearInterval(timerInterval);  // Stop de timer als deze 0 is
    gameOver = true; // Zet de gameOver vlag aan
  }
}

// Start de timer
timerInterval = setInterval(countdown, 1000);  // Elke seconde (1000 ms) de countdown functie aanroepen

// Functie om de "GAME OVER!" tekst te tekenen
function drawGameOver() {
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.font = "80px 'Press Start 2P', cursive";  // Groot pixel font voor GAME OVER!

  const textWidth = ctx.measureText("GAME OVER!").width;
  const xPosition = (canvas.width - textWidth) / 2;  // Midden van het scherm
  const yPosition = canvas.height / 3;  // Midden van het scherm

  // Zwarte rand rond de tekst
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";  // Zwarte rand
  ctx.strokeText("GAME OVER!", xPosition, yPosition);  // Rand tekenen

  // Witte tekst
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.fillText("GAME OVER!", xPosition, yPosition);  // De daadwerkelijke tekst

  // Kleine tekst eronder
  ctx.font = "40px 'Press Start 2P', cursive";  // Kleinere tekst voor "Press Space to Restart"
  const smallTextWidth = ctx.measureText("Press Space to Restart").width;
  const smallTextX = (canvas.width - smallTextWidth) / 2;  // Midden van het scherm
  const smallTextY = yPosition + 60;  // Onder de GAME OVER! tekst

  ctx.strokeText("Press Space to Restart", smallTextX, smallTextY);
  ctx.fillText("Press Space to Restart", smallTextX, smallTextY);
}

// Functie om de win tekst te tekenen
function drawWin() {
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.font = "80px 'Press Start 2P', cursive";  // Groot pixel font voor WIN!

  const textWidth = ctx.measureText("WIN!").width;
  const xPosition = (canvas.width - textWidth) / 2;  // Midden van het scherm
  const yPosition = canvas.height / 3;  // Midden van het scherm

  // Zwarte rand rond de tekst
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";  // Zwarte rand
  ctx.strokeText("WIN!", xPosition, yPosition);  // Rand tekenen

  // Witte tekst
  ctx.fillStyle = "#FFFFFF";  // Witte tekst
  ctx.fillText("WIN!", xPosition, yPosition);  // De daadwerkelijke tekst

  // Kleine tekst eronder voor de "Next Page!" boodschap
  ctx.font = "40px 'Press Start 2P', cursive";  // Kleinere tekst voor "Next Page!"
  const smallTextWidth = ctx.measureText("Next Page!").width;
  const smallTextX = (canvas.width - smallTextWidth) / 2;  // Midden van het scherm
  const smallTextY = yPosition + 60;  // Onder de WIN! tekst

  ctx.strokeText("Next Page!", smallTextX, smallTextY);
  ctx.fillText("Next Page!", smallTextX, smallTextY);
}

// Functie om de game opnieuw te starten
function restartGame() {
  if (gameOver || gameWin) {
    score = 0;
    timer = 60;
    targetHits = 0;
    target.x = Math.random() * (canvas.width - 100);
    target.y = Math.random() * (canvas.height - 100);
    gameOver = false;
    gameWin = false;
    timerInterval = setInterval(countdown, 1000);  // Herstart de timer
  }
}

// Voeg event listener toe voor de spatiebalk om het spel te herstarten
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && (gameOver || gameWin)) {  // Controleer of de spatiebalk wordt ingedrukt
    restartGame();  // Herstart de game
  }
});

// Voeg eventlistener toe voor de "Next Page!" om naar spel3.html te gaan
canvas.addEventListener('click', (e) => {
  if (gameWin) {
    window.location.href = "spel3.html";  // Verander naar spel3.html
  }
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Wis het canvas

  if (gameOver) {
    drawGameOver();  // Teken de GAME OVER! tekst
  } else if (gameWin) {
    drawWin();  // Teken de WIN! tekst en Next Page!
  } else {
    drawTarget();      // Teken de target
    drawFlashes();     // Teken de flitsen
    drawScore();       // Teken de score
    drawTimer();       // Teken de timer
    drawTargetGoal();  // Teken de "Reach 50 hits!" boodschap
  }

  requestAnimationFrame(gameLoop);  // Herhaal de game loop
}

// Start de game loop
gameLoop();
