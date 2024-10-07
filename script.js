//defin HTML elements
const board=document.getElementById('game-board');
const instructionText=document.getElementById('instruction-text');
const logo=document.getElementById('logo');
const score=document.getElementById('score');
const highScoreText=document.getElementById('highScore');

const gridSize=20;
let snake=[{x:10, y:10}]
let food=generateFood()
let direction='right'
let gameInterval; 
let gameSpeedDelay=200;
let gameStarted=false;
let highScore=  0;

function draw(){
  //clear the board
  board.innerHTML='';
  drawSnake();
  drawFood();
  updateScore();
}

//draw a snake
function drawSnake(){
  snake.forEach((segment)=>{
    const snakeElement=createGameElement('div', 'snake')
    setPosition(snakeElement,segment)
    board.appendChild(snakeElement);
  });
}

//create a snake or food cube

function createGameElement(tag, className){
  const element=document.createElement(tag);
  element.className=className;
  
  return element;

}

//set position of an element

function setPosition(element, position){
  element.style.gridColumn=position.x;
  element.style.gridRow=position.y;
}

//draw()

//draw food function
function drawFood(){
  if(gameStarted){
  const foodElement=createGameElement('div','food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
  }
}

//genrerate food
function generateFood(){
  const x=Math.floor(Math.random()*gridSize)+1;
  const y=Math.floor(Math.random()*gridSize)+1; 
  return {x, y};
}

//movement functions
function move(){
  const head={...snake[0]};
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  
  }
  snake.unshift(head);
  //snake.pop();
  if(head.x===food.x && head.y===food.y){
    food=generateFood();
    increaseSpeed()
    clearInterval(gameInterval);
    gameInterval=setInterval(()=>{
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);

  } else {
    snake.pop();
  }
}

// setInterval(()=>{
//   move();
//   draw();
// }, 200)

//start game function
function startGame(){

    gameStarted=true; //keep track of a running game
    logo.style.display='none';
    instructionText.style.display='none';
    gameInterval=setInterval(()=>{
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  
}

//keyboard event listener
function handleKeyPress(event) {
  if(
    (!gameStarted && event.code==='Space') ||
    (!gameStarted && event.key==='')
  ){
    startGame();  
  } else{
    switch (event.key) {
      case 'ArrowUp':
          direction='up';
        break;
      case 'ArrowDown':       
          direction='down';        
        break;
      case 'ArrowLeft':        
          direction='left';        
        break;
      case 'ArrowRight':        
          direction='right';        
        break;      
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
  if(gameSpeedDelay>150){
    gameSpeedDelay-=5
  } else if(gameSpeedDelay>100){
    gameSpeedDelay-=3
  }
   else if(gameSpeedDelay>50){
    gameSpeedDelay-=2
  }
   else if(gameSpeedDelay>25){
    gameSpeedDelay-=1
  }
}

function checkCollision(){
  const head=snake[0];
  if(head.x<1 || head.y<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
    resetGame();
  }

  for(let i=1; i<snake.length; i++){
    if(head.x===snake[i].x && head.y===snake[i].y){
      resetGame();
    }
  }
}

function resetGame(){
  updateHighScore();
  stopGame();
  snake=[{x:10,y:10}];
  food=generateFood();
  direction='up';
  gameSpeedDelay=200;
  updateScore();
}

function updateScore(){
  const currentScore=snake.length-1;
  score.textContent=currentScore.toString().padStart(3, '0');
  
}

function stopGame(){
  clearInterval(gameInterval);
  gameStarted=false;
  instructionText.style='block';
  logo.style.display='block';
};

function updateHighScore(){
  const currentScore=snake.length-1;
  if(currentScore>highScore){
    highScore=currentScore;
    highScoreText.textContent=highScore.toString().padStart(3, '0');
  }

  highScoreText.style.display='block';


}