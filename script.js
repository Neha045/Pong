//select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//user paddle
const user1 = {
    x:10,
    y:cvs.height/2 - 50,
    width:10,
    height:100,
    color:"#f1444df5",
    score:0
}
const user2= {
    x:cvs.width - 20,
    y:cvs.height/2 - 50,
    width:10,
    height:100,
    color:"#00ff73f5",
    score:0
}

// Create the ball
const ball ={
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color:"#d05de7"
}

//draw rectangle function
function drawRect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h)
}

//draw ball
function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

//Draw text
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y)
}

//Draw net
function drawNet(){
    drawRect(cvs.width/2, 0, 3, cvs.height ,"#f3f3f3c9")
}


function render(){
    //clear canvas
    drawRect(0,0, cvs.width, cvs.height, "#222");

    //Net
    drawNet();

    //score
    drawText(user1.score, cvs.width/4, cvs.height/5, "#f3f3f359");
    drawText(user2.score, 3*cvs.width/4, cvs.height/5, "#f3f3f359");

    //draw paddles
    drawRect(user1.x, user1.y, user1.width, user1.height, user1.color);
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);

    //draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//control user paddle:
cvs.addEventListener("mousemove", movePaddle);
function movePaddle(event){
    let rect = cvs.getBoundingClientRect();

    user2.y = event.clientY - rect.top - user2.height/2;
}


//collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    p.top = p.y ;
    p.bottom = p.y + p.height;
    p.left = p.x ;
    p.right = p.x + p.width;

    return b.right>p.left && b.bottom>p.top && b.left<p.right &&b.top<p.bottom;

}
//reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

//update
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // control user1 AI
    let level = 0.05;
    user1.y += (ball.y -(user1.y + (user1.height/2))) * level;

    if(ball.y + ball.radius > cvs.height || ball.y-ball.radius <0){
        ball.velocityY = - ball.velocityY;
    }
    if(ball.x + ball.radius > cvs.width || ball.x-ball.radius < 0){
        ball.velocityX = - ball.velocityX;
    }

    let player =(ball.x <cvs.width/2) ? user1 : user2;

    if(collision(ball, player)){
        let collidePoint = ball.y - (player.y + (player.height/2));
        collidePoint = collidePoint/(player.height/2)
        
        //angle
        let angle = collidePoint * Math.PI/4;

        //X direction of ball 
        let direction = (ball.x < cvs.width/2) ? 1 : -1

        // change velocity
        ball.velocityX = direction * ball.speed * Math.cos(angle);
        ball.velocityY =  ball.speed * Math.sin(angle);

        // increase speed
        ball.speed += 0.1;
    }

    //update score
    if(ball.x - ball.radius < 0){
        user2.score++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width){
        user1.score++;
        resetBall();
    }

}


//init
function game(){
    update();
    render();
}

//loop
const fps = 50;
setInterval(game, 1000/fps);