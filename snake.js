const board=document.querySelector('.board')
const startButton=document.querySelector(".btn-start");
const modal=document.querySelector(".modal");
const startgamemodal=document.querySelector(".start-game");
const gameovermodal=document.querySelector(".game-over");
const restartButton=document.querySelector(".btn-restart");

const highscoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time");

const blockwidth=30;
const blockheight=30;

const cols=Math.floor(board.clientWidth/blockwidth)
const rows=Math.floor(board.clientHeight/blockheight)

let highscore=localStorage.getItem("highscore")||0;
let score=0;
let time=`00-00`;

highscoreElement.innerHTML=highscore;

let blocks=[];
let snake=[{ x:1,y:3 }];

let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};

let intervalId=null;
let timeintervalId=null;

let direction="right";

// Create grid
for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        const block=document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`]=block
    }
}

// Game render
function render(){

    blocks[`${food.x}-${food.y}`].classList.add("food")

    let head=null;

    if(direction==='left'){
        head={x:snake[0].x,y:snake[0].y-1}
    }else if(direction==='right'){
        head={x:snake[0].x,y:snake[0].y+1}
    }else if(direction==="down"){
        head={x:snake[0].x+1,y:snake[0].y}
    }else if(direction==="up"){
        head={x:snake[0].x-1,y:snake[0].y}
    }

    // Wall collision
    if(head.x<0||head.x>=rows||head.y<0||head.y>=cols){
        clearInterval(intervalId);
        modal.style.display="flex"
        startgamemodal.style.display="none";
        gameovermodal.style.display="flex"
        return;
    }

    // Eat food
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        snake.unshift(head);

        score+=10;
        scoreElement.innerHTML=score;

        if(score>highscore){
            highscore=score
            localStorage.setItem("highscore",highscore.toString())
        }
        return;
    }

    // Remove old snake
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head)
    snake.pop()

    // Draw snake
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}

// Start game
startButton.addEventListener("click",()=>{
    modal.style.display="none";

    intervalId=setInterval(()=>{render()},300)

    timeintervalId=setInterval(()=>{
        let [min,sec]=time.split("-").map(Number);

        if(sec==59){
            min+=1;
            sec=0;
        }else{
            sec+=1;
        }

        time=`${min}-${sec}`
        timeElement.innerHTML=time
    },1000)
})

// Restart game
restartButton.addEventListener("click",restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });

    score=0;
    time=`00-00`

    scoreElement.innerHTML=score
    timeElement.innerHTML=time;
    highscoreElement.innerHTML=highscore

    modal.style.display="none";

    direction="right";
    snake=[{x:1,y:3}];

    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};

    clearInterval(intervalId);
    intervalId=setInterval(()=>{render()},300)
}

// Keyboard control
addEventListener("keydown",(event)=>{
    if(event.key=="ArrowUp" && direction!=="down"){
        direction="up";
    }else if(event.key=="ArrowRight" && direction!=="left"){
        direction="right";
    }else if(event.key=="ArrowLeft" && direction!=="right"){
        direction="left";
    }else if(event.key=="ArrowDown" && direction!=="up"){
        direction="down";
    }
})

// 📱 TOUCH CONTROLS (MOBILE)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", function(e) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "left") {
            direction = "right";
        } else if (dx < 0 && direction !== "right") {
            direction = "left";
        }
    } else {
        if (dy > 0 && direction !== "up") {
            direction = "down";
        } else if (dy < 0 && direction !== "down") {
            direction = "up";
        }
    }
});
