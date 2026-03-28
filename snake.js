const board=document.querySelector('.board');
const startButton=document.querySelector(".btn-start");
const modal=document.querySelector(".modal");
const startgamemodal=document.querySelector(".start-game");
const gameovermodal=document.querySelector(".game-over");
const restartButton=document.querySelector(".btn-restart");


const highScoreElement=document.querySelector("#high-score");
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time");



const blockheight=50;
const blockwidth=50;

let highScore=localStorage.getItem("highScore")||0;
let score=0
let time=`00-00`

highScoreElement.innerHTML=highScore;

const cols=Math.floor(board.clientWidth/blockwidth);
const rows=Math.floor(board.clientHeight/blockwidth);

let blocks=[]
let snake=[{
    x:1,y:3
}
]
let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
let direction="right";
let intervalid=null;
let timeIntervalId=null;

// for(let i=0;i<rows*cols;i++){
    // const block=document.createElement('div');
    // block.classList.add("block");
    // board.appendChild(block)
// }

for(let row=0;row<rows;row++){
for(let col=0;col<cols;col++){

 const block=document.createElement('div');
    block.classList.add("block");
    board.appendChild(block)
    block.innerText=`${row}-${col}`
    blocks[`${row}-${col}`]=block
}
}
 
function render(){
 

    let head=null

    blocks[`${food.x}-${food.y}`].classList.add("food")
    if(direction==='left'){
        head={x:snake[0].x,y:snake[0].y-1}
    }else if(direction==='right'){
        head={x:snake[0].x,y:snake[0].y+1}
    }else if(direction==="down"){
        head={x:snake[0].x+1,y:snake[0].y}
    }else if(direction==="up"){
        head={x:snake[0].x-1,y:snake[0].y}
    }

    if(head.x<0||head.x>=rows||head.y<0||head.y>=cols){
        clearInterval(intervalid);
         modal.style.display="flex"
         startgamemodal.style.display="none";
         gameovermodal.style.display="flex"
        return;
    };

    

    // food consume logic...

    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
        blocks[`${food.x}-${food.y}`].classList.add("food")

        snake.unshift(head)
        
        score+=10;
        scoreElement.innerHTML=score

        if(score>highScore){
            highScore=score
            localStorage.setItem("highScore",highScore.toString())
        }
    }

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head)
    snake.pop()

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
    })
}




// intervalid=setInterval(()=>{
 
//     render()
// },300)

startButton.addEventListener("click",()=>{
    modal.style.display="none";
        intervalid=setInterval(()=>{render()},300)
        timeIntervalId=setInterval(()=>{
         let [min,sec]=time.split("-").map(Number)
         
         if(sec==59){
            min+=1;
            sec=0;

         }else{
            sec+=1
         }

         time=`${min}-${sec}`
         timeElement.innerHTML=time
        },1000)
})

restartButton.addEventListener("click",restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food");

     snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    });
    

    score=0;
    time=`00-00`

    scoreElement.innerText=score
    timeElement.innerText=time
    highScoreElement.innerText=highScore



    modal.style.display="none";
    direction="down";
     snake=[{x:1,y:3}];
     food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
     intervalid=setInterval(()=>{render()},300)
}





addEventListener("keydown",(event)=>{
    if(event.key=="ArrowUp"){
        direction="up";
    }else if(event.key=="ArrowRight"){
         direction="right";
    }else if(event.key=="ArrowLeft"){
        direction="left";
    }else if(event.key=="ArrowDown"){
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
