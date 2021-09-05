function gamePageLoading (){
    //получаем текущие размеры окна браузера(холста, к которому будем обращаться) 
    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvas = document.getElementById('game');
    let ctx = canvas.getContext('2d');
    canvas.setAttribute('width',w);
    canvas.setAttribute('height',h);
    let time=0;   
    //установим количество жизней
    let lives = 10;
    let score =0;

    //переменные для управления ракетой
    let goUp=false;
    let goDown=false;
    let goRight=false;
    let goLeft=false;
    let shoot=false;

    //объявим переменную для ракеты
    let rocket=new Image();
    rocket.src='assets/rocket.png';
    rocket.Y=h-400;
    rocket.X=0;

    //параметры пули
    let bullets = [];
    let bullet=new Image();
    bullet.src='assets/bullet.png'

    //объявим переменную для взрыва
    let boom=new Image();
    boom.src='assets/boom2.png';
    let boomFramesX=4;
    let currentBoomFrameY=0;
    let currentBoomFrameX=0;

    //создадим массив монет
    let coinsNumber = 7;
    let frames=10;
    let currentFrame=0;
    let coins=[];
    for (let i=0; i<coinsNumber; i++){
        coins[i] = new Image();
        coins[i].src = 'assets/coin-sprite-animation.png';
        coins[i].Y=0-Math.random()*h;//чтобы монеты появлялись вразброс укажем для них рандомные координаты
        coins[i].X=Math.random()*w;
    }
    
    //создадим переменную для массива с препятствиями
    let obstaclesNumber = 5;
    let obstacles = [];
    for (let i=0; i<obstaclesNumber; i++){
        obstacles[i] = new Image();
        obstacles[i].src = 'assets/monster.png';
        obstacles[i].Y=0-Math.random()*h;
        obstacles[i].X=Math.random()*(w-coins[i].width);
    }

    // создадим элемент аудио для выстрела
    let shootingAudio=new Audio;
    shootingAudio.src="assets/audio/shoot.mp3";

    // создадим элемент аудио для столкновения с монетой
    let coinAudio=new Audio;
    coinAudio.src="assets/audio/coin.mp3";

    //переменная для фоновой музыки
    let fonAudio=new Audio;
    fonAudio.src="assets/audio/fon.mp3";
    fonAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    //функция воспроизводит звук монеты
    function coinSound() {
        coinAudio.currentTime=0; // в секундах
        coinAudio.play();
    }

    //функция воспроизводит выстрел пулемета
    function shootingSound() {
        shootingAudio.currentTime=0; // в секундах
        shootingAudio.play();
    }
    
    //функция для отображения количества жизней
    function livesCounting (){
        ctx.font ='40px Gowun Batang';
        ctx.fillStyle ='#a09e9e';
        ctx.fillText('Lives:'+lives,w-235,50);
    }

    //функция для отображения счета
    function scoreCounting (){
        ctx.font ='40px Gowun Batang';
        ctx.fillStyle ='#a09e9e';
        ctx.fillText('Scores:'+score,w-435,50);
    }

    //функция для отрисовки кнопок после окончания игры
    function buttonsDraw (){
        let buttonsHtml = `
            <div class="gameButtons">
                <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
                <a href="#Rules" class="fciA navItem" onclick="switchToRulesPage()"><span class="fciSpan">Rules</span></a>
                <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
                <a href="#Game" class="fciA navItem" onclick="gamePageLoading()"><span class="fciSpan">New Game</span></a>
            </div>`
        return buttonsHtml;
    }

    //функция для остановки игры
    function gameOver (){
        cancelAnimationFrame(timer);
        ctx.font ='100px Gowun Batang';
        ctx.fillStyle='#900000';
        ctx.fillText('Game over', w/2-220,h/2);
        gameOver = true;
    }

    //функция для отрисовки ракеты
    function drawRocket () {
        //описываем условия движения ракеты
        if(goLeft==true && rocket.X>0){
            rocket.X-=5
        }
        if(goRight==true && rocket.X<(w-rocket.w)){
            rocket.X+=5
        }
        if(goUp==true && rocket.Y>0){
            rocket.Y-=5
        }
        if(goDown==true && rocket.Y<(h-rocket.h)){
            rocket.Y+=5
        }
        //ctx.save(); // Сохраняем настройки канваса до всяких манипуляций с ним
        // Сдвигаем в центр изображения,которое хотим повернуть.Все дело в работе метода rotate.
        // Он крутит относительно верхнего левого угла. Соответственно перевернется вся система координат
        //ctx.translate(0,0);
        //ctx.rotate(120*Math.PI/180);// Поворачиваем на `degrees` наш градус
        ctx.drawImage(rocket, 0,0, rocket.width,rocket.height,rocket.X,rocket.Y, rocket.width*0.4,rocket.height*0.4/*сжали изображение до 30%*/);
        rocket.w=rocket.width*0.4;
        rocket.h=rocket.height*0.4-40;
        // Рисуем повернутую картинку
        // Восстанавливаем настройки на момент когда делали `ctx.save`
        // то есть до `ctx.translate` и `ctx.rotate`. Рисунок при этом сохраняется.
        //ctx.restore();
    }
    
    //функция для отрисовки взрыва при ударе с препятствием
    function drawObstacleBoom (x,y) {
        ctx.drawImage(boom,128*1,128*0, 128,128, x,y, 128,128);    
    }

    //функция с анимацией взрыва
    function drawBoom (x,y) {
        ctx.drawImage(boom,128*currentBoomFrameX,128*currentBoomFrameY, 128,128, x,y, 128,128);
        if(currentBoomFrameX==boomFramesX){
            currentBoomFrameX=0;
            currentBoomFrameY++;
        } else {
            currentBoomFrameX++;
        }   
    }
    
    //функция для отрисовки появляющихся монет
    function drawCoins (num){
        //пропишем условие столкновения ракеты с монетами
        if((coins[num].X+coins[num].w>rocket.X) && coins[num].X<(rocket.X+rocket.w) && (coins[num].Y+coins[num].h)>rocket.Y && coins[num].Y<(rocket.Y+rocket.h)){
            bingo=true;
            //воспроизводим звук при столкновении с монетой
            coinSound();
            //меняем координаты монеты
            coins[num].Y=h;
            coins[num].X=Math.floor(Math.random()*w);
            //увеличиваем счет
            score++;
        } else {bingo=false;}
        if (!bingo){
            //отрисовываем монету и заставляем ее двигаться вниз
            ctx.drawImage(coins[num],100*currentFrame/*при увеличении этого значения на 100 отображаются разные кадры спрайта */,
                0, 100,100, coins[num].X,coins[num].Y, 100*0.6,100*0.6);
            //пропишем условие,чтобы спрайт вращался и замедлим анимацию
            let currentTime = new Date().getTime();
            if ((currentTime-time)>16){
                if(currentFrame==frames){
                    currentFrame=0;
                } else {
                    currentFrame++;
                }
                time=currentTime;
            } else {time=currentTime}
            //чтобы вдальнейшем было проще писать логику столкновений,укажем для монет ширину и высоту
            coins[num].w=coins[num].width*0.6*0.1;
            coins[num].h=coins[num].height*0.6;
            coins[num].Y++;
            //если монеты выходит за пределы поля, то меняем координаты
            if (coins[num].Y>h){
                coins[num].Y=0-coins[num].h;
                coins[num].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
            }
        }
        
    }
   
    //функция для отрисовки препятствий
    let scale = 0.2;
    function drawObstacles (num){
        //пропишем условие столкновения ракеты с препятствием
        if((obstacles[num].X+obstacles[num].w>rocket.X) && obstacles[num].X<(rocket.X+rocket.w) && (obstacles[num].Y+obstacles[num].h)>rocket.Y && obstacles[num].Y<(rocket.Y+rocket.h)){
            crash=true;
            //при столкновении запускаем анимацию взрава препятствий
            drawObstacleBoom(obstacles[num].X,obstacles[num].Y);
            //меняем координаты препятствия, чтобы посте столкновения оно исчезало и появлялось в другом месте
            obstacles[num].Y=h;
            obstacles[num].X=Math.floor(Math.random()*w);
            //забираем жизнь
            lives--;
            if (lives<1){
                gameOver()
            }
        } else {crash=false;}
        if (!crash){
            //отрисовываем препятствие и заставляем его двигаться вверх
            ctx.drawImage(obstacles[num], 0,0, 900,900, obstacles[num].X,obstacles[num].Y, 900*scale,900*scale);
            //чтобы монстры получались разного размера, добавим изменение переменной scale
            scale += 0.05;
            if (scale > 0.4) {
                scale = 0.2;
            }
            obstacles[num].w=obstacles[num].width*scale;
            obstacles[num].h=obstacles[num].height*scale-30;//-30 -это погрешность на торчащие лапки
            obstacles[num].Y++;
            //если препятствия выходят за пределы поля, то меняем координаты
            if (obstacles[num].Y>h){
                obstacles[num].Y=0-obstacles[num].height*scale;
                obstacles[num].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
            }
        }
    }

    //функция для отрисовки стрельбы
    function shooting (){
        //создадим класс,который будет хранить параметры для каждой пули
        class Bullet {
            constructor(){
                this.w = 463*0.03;
                this.h = 539*0.03;
                this.x = rocket.X+rocket.w/2-this.w/2;
                this.y = rocket.Y-10;
                bullets.push(this);
            }
            draw(){
                this.y-=5;
                //при выходе за пределы холста удаляем пулю из массива
                if(this.y < 0-this.h){
                    //удаляем из массива больше ненужный элемент
                    bullets.splice(bullets.indexOf(this));
                }
                //при попадании в препятствие удаляем пулю и препятствие, запускаем анимацию взрыва
                for (let i=0; i<obstaclesNumber; i++){
                    if( this.y<(obstacles[i].Y+obstacles[i].h) && obstacles[i].Y<(this.y+this.h) && (obstacles[i].X+obstacles[i].w)>this.x && obstacles[i].X<(this.x+this.w)){
                        //удаляем из массива больше ненужный элемент
                        bullets.splice(bullets.indexOf(this));
                        //при столкновении запускаем анимацию взрава препятствий
                        drawObstacleBoom(obstacles[i].X,obstacles[i].Y);
                       //меняем координаты препятствия, чтобы посте столкновения оно исчезало и появлялось в другом месте
                        obstacles[i].Y=h;
                        obstacles[i].X=Math.floor(Math.random()*w);
                    }
                }
                ctx.drawImage(bullet, 0,0, 463,539, this.x,this.y,this.w,this.h); 
            }
        }
        //описываем условие создания пули
        if(shoot==true){
            //создаем новую пулю
            new Bullet();
        }
        // рисуем пули
        bullets.forEach(bullet => bullet.draw());
    }
    
    //пропишем условия для сохранения рекордов игры
    function recordsCheck (){
        
         if(score>localStorage.getItem('top5')){
            if(score>localStorage.getItem('top4')){
                if(score>localStorage.getItem('top3')){
                    if(score>localStorage.getItem('top2')){
                        if(score>localStorage.getItem('top1')){
                            name5=name4;
                            localStorage.setItem('name5', name5);
                            name4=name3;
                            localStorage.setItem('name4', name4);
                            name3=name2;
                            localStorage.setItem('name3', name3);
                            name2=name1;
                            localStorage.setItem('name2', name2);
                            name1 = document.getElementById('IName').value;
                            localStorage.setItem('name1', name1);
                            record5=record4;
                            localStorage.setItem('top5', record5);
                            record4=record3;
                            localStorage.setItem('top4', record4);
                            record3=record2;
                            localStorage.setItem('top3', record3);
                            record2=record1;
                            localStorage.setItem('top2', record2);
                            record1=score;
                            localStorage.setItem('top1', record1);
                        } else {
                            name5=name4;
                            localStorage.setItem('name5', name5);
                            name4=name3;
                            localStorage.setItem('name4', name4);
                            name3=name2;
                            localStorage.setItem('name3', name3);
                            name2 = document.getElementById('IName').value;
                            localStorage.setItem('name2', name2);
                            record5=record4;
                            localStorage.setItem('top5', record5);
                            record4=record3;
                            localStorage.setItem('top4', record4);
                            record3=record2
                            localStorage.setItem('top3', record3);
                            record2=score;
                            localStorage.setItem('top2', record2);
                        }
                    } else {
                        name5=name4;
                        localStorage.setItem('name5', name5);
                        name4=name3;
                        localStorage.setItem('name4', name4);
                        name3 = document.getElementById('IName').value;
                        localStorage.setItem('name3', name3);
                        record5=record4;
                        localStorage.setItem('top5', record5);
                        record4=record3;
                        localStorage.setItem('top4', record4);
                        record3=score;
                        localStorage.setItem('top3', record3);
                    }
                }else {
                    name5=name4;
                    localStorage.setItem('name5', name5);
                    name4 = document.getElementById('IName').value;
                    localStorage.setItem('name4', name4);
                    record5=record4;
                    localStorage.setItem('top5', record5);
                    record4=score;
                    localStorage.setItem('top4', record4);
                }
            }else {
                name5 = document.getElementById('IName').value;
                localStorage.setItem('name5', name5);
                record5=score;
                localStorage.setItem('top5', record5);
            }  
        }
        //удаляется ненужное окно
        document.body.removeChild(document.getElementsByClassName('chempionWindow')[0]);
        //и появляется нужное
        pageHTML=buttonsDraw();
        document.getElementById('app').innerHTML=pageHTML;
    }
    //функция для отрисовки окна с вводом имени победителя
    function getChempionsName () {
        let chempionWindow = document.createElement('div');
        document.body.appendChild(chempionWindow).classList = "chempionWindow";

        let div1 = document.createElement('div');
        chempionWindow.appendChild(div1).classList = 'div';
        let div1Text = document.createTextNode('Сongratulations! You are in the high score table!');
        div1.appendChild(div1Text);

        let div2 = document.createElement('div');
        chempionWindow.appendChild(div2).classList = 'div';
        let div2Text = document.createTextNode('Please, enter your name!');
        div2.appendChild(div2Text);

        let inputField = document.createElement('input');
        chempionWindow.appendChild(inputField).setAttribute('id','IName');
        inputField.setAttribute('autocomplete', 'off');


        let button = document.createElement('a');
        chempionWindow.appendChild(button).classList = 'fciA navItem';
        //при нажатии на кнопку осуществляется проверка позиции игрока в таблице рекордов
        button.addEventListener('click',  recordsCheck); 

        let buttonName = document.createElement('span');
        button.appendChild(buttonName).classList = 'fciSpan';
        let buttonText = document.createTextNode('Enter');
        buttonName.appendChild(buttonText);
    }
    
    //функция для отрисовки игры
    function render(){
        //при старте игры включаем музыку
        fonAudio.play();
        fonAudio.volume=0.1;
        
        //для того, чтобы при старте новой игры исчезали кнопки
        document.getElementById('app').innerHTML='';
        //проверяем, если gameOver ==true, то останавливаем функцию render
        if(gameOver===true){
            fonAudio.pause();
            if(score>parseInt(localStorage.getItem('top5')) || isNaN(parseInt(localStorage.getItem('top5')))){
                getChempionsName();
                return;
            } else {
                pageHTML=buttonsDraw();
                document.getElementById('app').innerHTML=pageHTML;
                return;
            }
        }

        ctx.clearRect(0,0,w,h);

        drawRocket();

        for (let i=0; i<coinsNumber; i++){
            drawCoins(i);
        }

        for (let i=0; i<obstaclesNumber; i++){
            drawObstacles(i);
        }

        shooting();

        livesCounting();

        scoreCounting ();

        //для отрисовки анимации
        timer=requestAnimationFrame(render);
    }
    render();

    //пропишем обработчики событий нажатия клавиш
    //нажатия клавиши
    let direction;
    addEventListener('keydown', function(e){
        direction = e.keyCode;
        if(direction===39){
            goRight=true;
        }
        if(direction===37){
            goLeft=true;
        }
        if(direction===38){
            goUp=true;
        }
        if(direction===40){
            goDown=true;
        }
        if(direction===32){
            shoot=true;
            //при нажатии на кнопку запускаем звуковой файл
            shootingSound();
        }
    })
     //отжатия клавиши
     addEventListener('keyup', function(e){
        direction = e.keyCode;
        if(direction===38){
            goUp=false;
        }
        if(direction===40){
            goDown=false;
        }
        if(direction===39){
            goRight=false;
        }
        if(direction===37){
            goLeft=false;
        }
        if(direction===32){
            shoot=false;
        }
    })  
}