var canvas, ctx, mouse_pos, mouse_pos_msg="Mouse:0,0", snake = [], isPaused=false, score=0, tick=0, food, headfwd, currentheadfwd, WIDTH=20;

var colors = [ '#9184e5', '#317874', '#6e783f', '#F38630', '#FA6900', '#FF4E50', '#453a1b' ];
console.info('******************************Begin******************************');

canvas = document.createElement('canvas');


window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000);
};

   
function init() {
  //console.info('init()'); 

  if(canvas.getContext && canvas.getContext('2d')) {
    var container = document.getElementById('container'); 
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');  
    canvas.style.position = 'relative';
    canvas.id="snakecanvas";
    canvas.height = 400;
    canvas.width = 600;
    canvas.style.top = 0;
    canvas.style.bottom = 0;
    canvas.style.left = 0;
    canvas.style.right = 0;
    canvas.style.zIndex = -1;    
    window.addEventListener('keydown', key_down, true);    

    //console.info("ball: x="+ball.x+" y:"+ball.y);
    game_start();
    //console.log("x: " + food.x + " y: " + food.y);
    update();
	}		
  else {
    // text
    var text = document.createElement("div");
    text.innerHTML = "This game can't play on browser:";
    text.setAttribute('class', 'text'); 
    document.getElementById("container").appendChild(text);
    // Browser
    var browser = document.createElement("div");
    browser.innerHTML = get_browser();
    browser.setAttribute('class', 'browser-version'); 
    document.getElementById("container").appendChild(browser);
    // text
    var text1 = document.createElement("div");
    text1.innerHTML = "version";
    text1.setAttribute('class', 'text'); 
    document.getElementById("container").appendChild(text1);
    // Version
    var version = document.createElement("div");
    version.innerHTML = get_browser_version();
    version.setAttribute('class', 'browser-version'); 
    document.getElementById("container").appendChild(version);
    // text
    var text3 = document.createElement("div");
    text3.innerHTML = "=( sorry";
    text3.setAttribute('class', 'text'); 
    document.getElementById("container").appendChild(text3);
  }
		
}
 

function draw_snake(){
  for(var i =0; i < snake.length; i++){
    ctx.beginPath();
        ctx.rect(snake[i].x,snake[i].y,WIDTH, WIDTH);
        ctx.fillStyle = '#3c3c3c';
        ctx.fill();
    ctx.closePath();
  }
      
}
function update_score()
{
  document.getElementById("score").innerHTML = score;
  //console.log("score:" + score);
}

function game_start() {
  currentheadfwd = {
      x:0,
      y:0
  };
  headfwd = {
      x:0,
      y:0
  };
  snake = [];
  score=0;
  update_score();
  snake.push({
      x: WIDTH*Math.floor(Math.random()*canvas.width/WIDTH),
      y: WIDTH*Math.floor(Math.random()*canvas.height/WIDTH)
   });
  //print_snake();
  isPaused=true;
  //draw grid
  init_food(); 
}

function key_down(e) {
  // SPACE BAR
  if(e.keyCode == 13) {
    isPaused = !isPaused;
  }

  // LEFT KEY
  if(e.keyCode == 37 && !isPaused && currentheadfwd.x==0) {
    headfwd.x = -WIDTH;
    headfwd.y = 0;
    //console.info('LEFT'); 
  }
  // RIGHT KEY
  else if(e.keyCode == 39 && !isPaused && currentheadfwd.x==0) {
    headfwd.x = WIDTH;
    headfwd.y = 0;
   // console.info('RIGHT'); 
  }
  // UP KEY
  else if(e.keyCode == 38 && !isPaused && currentheadfwd.y==0) {
    headfwd.y = -WIDTH;
    headfwd.x = 0;
    //console.info('UP');   
  }
  //DOWN KEY
  else if(e.keyCode == 40 && !isPaused && currentheadfwd.y==0){
    headfwd.y = WIDTH;
    headfwd.x = 0;
    //console.info('DOWN'); 

  }
  
}

function print_snake(){
  console.log("-----------------------------");
  for(var i=0; i <snake.length; i++){
    console.log("snake["+ i +"]= x:"+snake[i].x +", y:"+snake[i].y);
  }
}
function draw_food(){
   ctx.beginPath();
        ctx.rect(food.x,food.y,WIDTH, WIDTH);
        ctx.fillStyle = '#9f3142';
        ctx.fill();
   ctx.closePath();
}
function init_food(){
    food = {
      x: WIDTH*Math.floor(Math.random()*canvas.width/WIDTH),
      y: WIDTH*Math.floor(Math.random()*canvas.height/WIDTH)
    }
    for(var i=0; i<snake.length; i++){
      if(food.x == snake[i].x && food.y == snake[i].y)
        init_food();
    }
}
/** Find out the browser version and  name by **/
function get_browser(){
  var N=navigator.appName, ua=navigator.userAgent, tem;
  var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
  return M[0];
}

function get_browser_version(){
  var N=navigator.appName, ua=navigator.userAgent, tem;
  var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
  return M[1];
}

function update(){
  reset();
  
  if (!isPaused){
    draw_snake();
    draw_food();    
    tick++;
    //console.log(tick);
    if(tick == 5){
      currentheadfwd.x = headfwd.x;
      currentheadfwd.y = headfwd.y;
      //move snake by creating a new head
      snake.unshift({
        x: snake[0].x + headfwd.x,
        y: snake[0].y + headfwd.y
      });
      //remove tail
      snake.pop();
      //check if right bottom wall?
      if(snake[0].x + WIDTH> canvas.width || snake[0].x < 0){
       //console.log("RIGHT / LEFT WALL");
        game_start();
      }
      if(snake[0].y + WIDTH > canvas.height || snake[0].y + WIDTH< 0){
        //console.log("BOTTOM / TOP WALL");
        game_start();
      }
      //if snake crashes into itself
      for(var i=1; i<snake.length; i++){
        if(snake.length > 2 && snake[0].x == snake[i].x && snake[0].y == snake[i].y)
          game_start();
      }
      //check if next cell is food
      if(snake[0].x == food.x && snake[0].y == food.y){
          //console.log("OMNOMNOM begin growing");
          //print_snake();  
          snake.unshift({
             x: snake[0].x + headfwd.x,
             y: snake[0].y + headfwd.y
          });
          //print_snake();
          score+= 10;
          update_score();
          init_food();
      } 
    }  
    if(tick==5)
      tick=0;  
  }
  else {      
    ctx.beginPath();
    ctx.font = 'bold 20pt segoe ui light';
    ctx.fillStyle = '#3c3c3c';
    ctx.fillText("PRESS ENTER TO PLAY", canvas.width/2-140, canvas.height/2);
    ctx.closePath();     
  }
  window.setTimeout(requestAnimFrame(update),1000); 
}

function reset() {
  canvas.width = canvas.width;
}

window.onload = function () {  
  canvas.width = canvas.width;
  canvas.height = canvas.height;
  init();
};
