const canvas=document.querySelector("canvas");
const ctx=canvas.getContext('2d');

var bg=new Image();
var playerImage=new Image();
var HardEnemyImage=new Image();
var LeftDownImage=new Image();
var LeftUpImage=new Image();
var RightDownImage=new Image();
var RightUpImage=new Image();

var planet1=new Image();
var planet2=new Image();
var planet3=new Image();
var planet4=new Image();
var planet5=new Image();
var planet6=new Image();

var shotSound=new Audio();
var hitSound=new Audio();
var deathSound=new Audio();
var pressedE=new Audio();

var controlImage1=new Image();
var controlImage2=new Image();

controlImage1.src="resim/keyboard.png";
controlImage2.src="resim/mouse.png";

shotSound.src="sesler/atissesi.wav";
hitSound.src="sesler/vurussesi.mp3";
deathSound.src="sesler/olumsesi.wav";
pressedE.src="sesler/pressedE.wav";

playerImage.src="resim/player.png";
bg.src="resim/resim.jpg";
HardEnemyImage.src="resim/kare.png";
LeftDownImage.src="resim/SolAsagi.png";
LeftUpImage.src="resim/SolaYukari.png";
RightDownImage.src="resim/SagAsagi.png";
RightUpImage.src="resim/SagYukari.png";

planet1.src="resim/planet1.png";
planet2.src="resim/planet2.png";
planet3.src="resim/planet3.png";
planet4.src="resim/planet4.png";
planet5.src="resim/planet5.png";
planet6.src="resim/planet6.png";

var score=0;
let scoreText;
let controlText;

canvas.width=innerWidth;
canvas.height=innerHeight;

class Player{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        ctx.drawImage(playerImage,this.x-30,this.y-50,60,90);
        ctx.drawImage(controlImage1,canvas.width-200,20,100,50);
        ctx.drawImage(controlImage2,canvas.width-100,20,50,50);
        //Hitbox test
        //ctx.fillStyle=this.color;
        //ctx.fill();
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        scoreText.draw();
        controlText.draw();
    }
}

class Projectile{
    constructor(x,y,radius,color,velocity,angle){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.angle=angle;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        if(this.angle>1.6){
            ctx.drawImage(LeftDownImage,this.x-20,this.y-50,70,70);
        }
        else if(this.angle<1.6&&this.angle>0){
            ctx.drawImage(RightDownImage,this.x-50,this.y-45,70,70);
        }
        else if(this.angle>-1.6){
            ctx.drawImage(RightUpImage,this.x-40,this.y-27,70,70);
        }
        else if(this.angle<-1.6){
            ctx.drawImage(LeftUpImage,this.x-20,this.y-20,70,70);
        }
        else{
            ctx.drawImage(ProjectileImage,this.x,this.y,50,50);
        }
        //ctx.fillStyle=this.color;
        //ctx.fill();
    }
    update(){
        this.draw()
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}
class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        //ctx.fillStyle=this.color;
       if(this.radius>30){
           ctx.drawImage(planet1,this.x-45,this.y-40,90,80);
       }
       else if(this.radius>25&&this.radius<30){
           ctx.drawImage(planet2,this.x-35,this.y-35,70,70);
       }
       else if(this.radius>20&&this.radius<25){
           ctx.drawImage(planet3,this.x-30,this.y-30,60,60);
       }
       else if(this.radius>15&&this.radius<20){
           ctx.drawImage(planet4,this.x-25,this.y-25,50,50);
       }
       else if(this.radius>10&&this.radius<15){
           ctx.drawImage(planet5,this.x-25,this.y-25,50,50);
       }
       else{
           ctx.drawImage(planet6,this.x-25,this.y-25,50,50);
       }
        //ctx.fill();
    }
    update(){
        this.draw()
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}
class HardEnemy{
    constructor(x,y,color,velocity){
        this.x=x;
        this.y=y;
        this.color=color;
        this.velocity=velocity;
        
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,20,0,Math.PI*2,false);
        ctx.drawImage(HardEnemyImage,this.x-50,this.y-40,100,80);
        //Hitbox Test
        //ctx.fillStyle=this.color;
        //ctx.fill();
    }
    update(){
        this.draw();
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}
class Text{
    constructor(text,x,y,align,c,s){
        this.x=x;
        this.y=y;
        this.c=c;
        this.align=align;
        this.text=text;
        this.s=s;
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.c;
        ctx.font=this.s+"px sans-serif";
        ctx.textAlign=this.align;
        ctx.fillText(this.text,this.x,this.y);
        ctx.closePath();
    }
}
let animationID
function animate(){
    scoreText= new Text("Score:"+score,20,20,"left","#FFFFFF","20"); 
    controlText=new Text("WASD:Move E:Clear  Click:Fire",canvas.width-200,90,"left","#FFFFFF","12");
    animationID= requestAnimationFrame(animate);
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    //ctx.fillStyle='rgba(0,0,0,0.2)';
    //ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    
    projectiles.forEach((projectile,pINdex)=>{
        projectile.update();
        
        if(projectile.x+projectile.radius<0 ||
           projectile.x-projectile.radius>canvas.width||
           projectile.y+projectile.radius<0||
           projectile.y-projectile.radius>canvas.height){
            setTimeout(()=>{
                projectiles.splice(pINdex,1);
            },0)
        }
    })
    enemies.forEach((Enemy,index)=>{
        Enemy.update();
        const distPlayer=Math.hypot(player.x-Enemy.x,player.y-Enemy.y);

        if(distPlayer-Enemy.radius<15){
            cancelAnimationFrame(animationID);
            deathSound.play();
            alert("GAME OVER\nYOUR SCORE:"+score);
            document.location.reload(); 
        }
        
        projectiles.forEach((Projectile,projectileIndex)=>{
            const dist=Math.hypot(Projectile.x-Enemy.x,Projectile.y-Enemy.y)
            if(dist-Enemy.radius-Projectile.radius<1){
                if(Enemy.radius-10>10){
                    Enemy.radius-=10;
                    setTimeout(()=>{
                        if(score>100){
                            score++;
                        }
                        else{
                        projectiles.splice(projectileIndex,1);
                        score++; 
                    }
                    },0)
                }
                else{
                setTimeout(()=>{
                    if(score>100){
                        enemies.splice(index,1);
                        hitSound.play();
                        score++;
                    }
                    else{
                        enemies.splice(index,1);
                        projectiles.splice(projectileIndex,1);
                        hitSound.play(); 
                        score++;

                    }
                },0)
                }
            }
        })
      
    }
    )
    hardEnemies.forEach((HardEnemy,hardINdex)=>{
        HardEnemy.update();
        const distPlayer=Math.hypot(player.x-HardEnemy.x,player.y-HardEnemy.y);
        if(distPlayer-20<10){
            cancelAnimationFrame(animationID);
            deathSound.play();
            alert("GAME OVER\nYOUR SCORE:"+score);
            document.location.reload();
        }
        projectiles.forEach((Projectile,projectileIndex2)=>{
            const dist=Math.hypot(Projectile.x-HardEnemy.x,Projectile.y-HardEnemy.y);
            if(dist-30-Projectile.radius<1){
                setTimeout(()=>{
                    if(score>100){
                        hardEnemies.splice(hardINdex,1);
                        hitSound.play();
                        score+=5;
                    }
                    else{
                        hardEnemies.splice(hardINdex,1);
                        projectiles.splice(projectileIndex2,1);
                        hitSound.play();
                        score+=5;
                    }
                })
            }
        })
    })
    
}
function spawnEnemies(){
    setInterval(()=>{
        const radius=Math.random()*(40-6)+6;
        let x;
        let y;
        if(Math.random()<0.5){
            x=Math.random()<0.5 ? 0-radius:canvas.width+radius;
            y=Math.random()*canvas.height;
        }
        else{
            x=Math.random()*canvas.width;
            y=Math.random()<0.5 ? 0-radius:canvas.height+radius;
        }
        const color=` hsl( ${Math.random()*360},50%,50%`;
        const angle=Math.atan2(player.y-y,player.x-x);
        const velocity={x:Math.cos(angle)*1,y:Math.sin(angle)*1}
        enemies.push(new Enemy(x,y,radius,color,velocity))
    },750);
    setInterval(()=>{
        const radius=Math.random()*(30-6)+6;
        let x;
        let y;
        if(Math.random()<0.5){
            x=Math.random()<0.5 ? 0-radius:canvas.width+radius;
            y=Math.random()*canvas.height;
        }
        else{
            x=Math.random()*canvas.width;
            y=Math.random()<0.5 ? 0-radius:canvas.height+radius;
        }
        const color=`hsl( ${Math.random()*360},50%,50%)`;
        const angle=Math.atan2(player.y-y,player.x-x);
        const velocity={
            x:Math.cos(angle)*3,y:Math.sin(angle)*3
        };
        hardEnemies.push(new HardEnemy(x,y,color,velocity));

    },3000)
}
let keysPressed={};
function controls() {
    document.addEventListener('keydown', (event) => {
        var key= event.key;
        var code = event.code;
        if(event.code=='KeyW'){
            moves.MoveW();
            keysPressed[key]=true;
        }
        if(event.code=='KeyS'){
            moves.MoveS();

        }
        if(event.code=='KeyD'){
            moves.MoveD();
        }
        if(event.code=='KeyA'){
            moves.MoveA();
        }
        if(code=="KeyE"){
            moves.ClearBoard();
        }
      }, false);
      //1W+A
      document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['w'] && event.key == 'a') {
            moves.MoveWA();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
    //2W+D
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['w'] && event.key == 'd') {
            moves.MoveWD();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
     //3A+S
     document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['a'] && event.key == 's') {
            moves.MoveAS();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
    //4S+A
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['s'] && event.key == 'a') {
            moves.MoveAS();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
     //5S+D
     document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['s'] && event.key == 'd') {
            moves.MoveSD();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     }); 
     //6D+S
     document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['d'] && event.key == 's') {
            moves.MoveSD();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
     //7 A+W
     document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['a'] && event.key == 'w') {
            moves.MoveWA();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
     //8D W
     document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
        if (keysPressed['d'] && event.key == 'w') {
            moves.MoveWD();
        }
     });
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });
    
    document.addEventListener('keyup',(event)=>{
        var key= event.key;
        var code=event.code;
        if(event.code=='KeyW'){
            moves.clearMove();
            keysPressed[event.code]=true;
        }
        if(event.code=='KeyS'){
            moves.clearMove();
            keysPressed[event.code]=true;
        }
        if(event.code=='KeyA'){
            moves.clearMove();
            keysPressed[event.code]=true;
        }
        if(event.code=="KeyD"){
            moves.clearMove();
            keysPressed[event.code]=true;
        }
        
    },false); 
}
var moveVelocity={x:0,y:0};
class Moves{
    MoveW(){
        moveVelocity={x:0,y:-2}
        player.velocity=moveVelocity;
    }
    MoveS(){
        moveVelocity={x:0,y:2};
        player.velocity=moveVelocity;
    }
    MoveA(){
        moveVelocity={x:-2,y:0};
        player.velocity=moveVelocity;
    }
    MoveD(){
        moveVelocity={x:2,y:0}
        player.velocity=moveVelocity;
    }
    MoveWD(){
        moveVelocity={x:2,y:-2}
        player.velocity=moveVelocity;
    }
    MoveWA(){
        moveVelocity={x:-2,y:-2};
        player.velocity=moveVelocity;
    }
    MoveAS(){
        moveVelocity={x:-2,y:2}
        player.velocity=moveVelocity;
    }
    MoveSD(){
        moveVelocity={x:2,y:2}
        player.velocity=moveVelocity;
    }
    clearMove(){
        moveVelocity={x:0,y:0}
        player.velocity=moveVelocity;
    }
    ClearBoard(){
        pressedE.play();
        score-=10;
        hardEnemies.splice(0,hardEnemies.length);
        enemies.splice(0,enemies.length);
    }
    
}
const x=canvas.width/2;
const y=canvas.height/2;

const player= new Player(x,y,10,'cyan',{x:0,y:0});
const moves=new Moves();


const projectile= new Projectile(player.x,player.y,5,'black',{x:1,y:1});
const projectiles=[];
const enemies=[];
const hardEnemies=[];

   
addEventListener('click',(event)=>{
    setTimeout(()=>{
        if(score>100){
            const angle=Math.atan2(event.clientY-player.y,event.clientX-player.x);
            const velocity={x:Math.cos(angle)*5,y:Math.sin(angle)*5}
            projectiles.push(new Projectile(player.x,player.y,5,'cyan',velocity,angle));
            shotSound.play();
        }
        else{
            const angle=Math.atan2(event.clientY-player.y,event.clientX-player.x);
            const velocity={x:Math.cos(angle)*5,y:Math.sin(angle)*5}
            projectiles.push(new Projectile(player.x,player.y,5,'cyan',velocity,angle));
            shotSound.play();
        }
    },100)     
})
controls()
animate()
spawnEnemies()

