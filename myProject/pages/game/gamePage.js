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
    let pauseOn=false;

    //переменные для таймера игры
    let hours=0;
    let minutes=0;
    let seconds=0;
    let counter=0;

    //переменные для управления ракетой
    let goUp=false;
    let goDown=false;
    let goRight=false;
    let goLeft=false;
    let shoot=false;

    //объявим переменную кнопки со звуком
    let soundButton=new Image();
    soundButton.src='assets/buttonOn.png';
    //объявим переменную кнопки паузы
    let pauseButton=new Image();
    pauseButton.src='assets/pause.png';

    //объявим переменную для ракеты
    let rocket=new Image();
    rocket.src='assets/rocket.png';
    rocket.Y=h/2;
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
    //параметры для адаптива монет
    let coinScale;
    if (w>1000){
        coinScale=0.6  
    }
    if (700<w<1000){
        coinScale=0.5  
    }
    if (700>w){
        coinScale=0.4  
    }
    
    //создадим переменную для массива с препятствиями
    let obstaclesNumber = 5;
    let obstacles = [];
    //параметры для адаптива
    let scale;
    if (w>1000){
        scale=0.2  
    }
    if (700<w<1000){
        scale=0.1  
    }
    if (700>w){
        scale=0.05  
    }
    for (let i=0; i<obstaclesNumber; i++){
        scale+=0.05;
        obstacles[i] = new Image();
        obstacles[i].src = 'assets/monster.png';
        obstacles[i].Y=0-Math.random()*h;
        obstacles[i].X=Math.random()*(w-obstacles[i].width);
        obstacles[i].scale=scale;
    }

    //функция для отрисовки кнопки включения/выключения звука
    function playStopSound (){
        if (soundOn==true){
            ctx.drawImage(soundButton, 0,0, 500,500,10,5, 500*0.12,500*0.12);
        } 
        if (soundOn==false){
            ctx.drawImage(soundButton, 0,0, 500,500,10,5, 500*0.12,500*0.12);
            ctx.strokeStyle="white";
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(50,20);
            ctx.lineTo(25,50);
            ctx.stroke();
        }
    }
    //навесим слушатель событий на кнопку Звука(чтобы при нажатии включать/отключать звук)
    canvas.addEventListener( "click", e => {
        if(e.offsetX > 10 && e.offsetX < 60 && e.offsetY > 10 && e.offsetY < 60) {
            if (soundOn==true){
                if(soundOn==true){
                    buttonClick.play();
                }
                fonAudio.pause();
                fonAudio.currentTime = 0;
                return soundOn=false;
            }
            if (soundOn==false){
                if(soundOn==true){
                    buttonClick.play();
                }
                fonAudio.play();
                return soundOn=true;
            }
        }
    });

    //функция для отрисовки кнопки паузы
    function drawPauseButton (){
        ctx.drawImage(pauseButton, 0,0, 388,390,80,2, 388*0.16,390*0.16);
    }
    //навесим слушатель событий на кнопку Паузы(чтобы при нажатии ставить игру на паузу)
    canvas.addEventListener( "click", e => {
        if(e.offsetX > 80 && e.offsetX < 140 && e.offsetY > 10 && e.offsetY < 60) {
            if (pauseOn==false){
                if(soundOn==true){
                    buttonClick.play();
                }
                pauseOn=true;
            }else if (pauseOn==true){
                if(soundOn==true){
                    buttonClick.play();
                }
                pauseOn=false;
            }
        }
    });
    //функция для отрисовки надписи во время паузы
    function pauseDraw (){
        ctx.font ='10vw Gowun Batang';
        ctx.fillStyle='#900000';
        ctx.fillText('Pause', w/2-w/15.36,h/2);
    }
   
    //функция рассчитывает продолжительность игры и задает нужный формат
    function getGameTime () {
        if(pauseOn==false){
            counter++;
            if (counter == 60) { //так как анимацию мы отрисовываем requestAnimationFrame, а это 60 кадров в секунду
                counter = 0;
                seconds++;
            }
            if (seconds == 60) {
                seconds = 0;
                minutes++;
            }
            if (minutes == 60) {
                minutes = 0;
                hours++;
            }  
        }
        // дополняем строку val слева нулями до длины Len
        function str0l(val,len) {
            let strVal=val.toString();
            while ( strVal.length < len )
                strVal='0'+strVal;
            return strVal;
        }
        // форматируем переданную дату-время в формате дд.мм.гггг чч:мм:сс
        let t = `${str0l(hours,2)}:${str0l(minutes,2)}:${str0l(seconds,2)}`;
        return t;
    }
    
    //функция для отображения продолжительности игры
    function gameTimeDraw (){
        ctx.font ='3vw Gowun Batang';
        ctx.fillStyle ='#a09e9e';
        ctx.fillText('Time:'+getGameTime(),w/2,h/12);
    }

    //функция для отображения количества жизней
    function livesCounting (){
        ctx.font ='3vw Gowun Batang';
        ctx.fillStyle ='#a09e9e';
        ctx.fillText('Lives:'+lives,w-w/6.5,h/12);
    }

    //функция для отображения счета
    function scoreCounting (){
        ctx.font ='3vw Gowun Batang';
        ctx.fillStyle ='#a09e9e';
        ctx.fillText('Scores:'+score,w-w/3.5,h/12);
    }

    //функция для отрисовки кнопок после окончания игры
    function buttonsDraw (){
        //убираем холст с прорисовкой игры, чтобы отображалась фоновая анимация
        canvas.setAttribute('width',0);
        canvas.setAttribute('height',0);
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
        ctx.font ='10vw Gowun Batang';
        ctx.fillStyle='#900000';
        ctx.fillText('Game over', w/2-w/7,h/2);
        gameOver = true;
        if(soundOn==true){
            gameOverAudio.play();
        }
    }

    //функция для отрисовки ракеты
    function drawRocket () {
        if(pauseOn==false){
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
        }
        //параметры для адаптива ракеты
        let rocketScale=0.5;
        /*if (window.innerWidth>1000){
            rocketScale=1  
        }*/
       /* if (700<w<1000){
            rocketScale=0.3  
        }
        if (700>w){
            rocketScale=0.2  
        }*/
        ctx.drawImage(rocket, 0,0, rocket.width,rocket.height,rocket.X,rocket.Y, rocket.width*rocketScale,rocket.height*rocketScale/*сжали изображение до 30%*/);
        rocket.w=rocket.width*rocketScale;
        rocket.h=rocket.height*rocketScale-40;
    }
    
    //функция для отрисовки взрыва при ударе с препятствием
    function drawBoom (x,y) {
        ctx.drawImage(boom,128*1,128*0, 128,128, x,y, 128,128);    
    }

    //функция с анимацией взрыва
    function drawanimationBoom (x,y) {
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
                if(soundOn==true){
                    coinAudio.play();
                }
                //меняем координаты монеты
                coins[num].Y=h;
                coins[num].X=Math.floor(Math.random()*w);
                while (coins[num].X>(w-coins[num].w)){//чтобы не выходили за пределы области видимости
                    coins[num].X=Math.floor(Math.random()*w);
                }
                //увеличиваем счет
                score++;
            } else {bingo=false;}
            if (!bingo){
                //отрисовываем монету и заставляем ее двигаться вниз
                ctx.drawImage(coins[num],100*currentFrame/*при увеличении этого значения на 100 отображаются разные кадры спрайта */,
                    0, 100,100, coins[num].X,coins[num].Y, 100*coinScale,100*coinScale);
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
                coins[num].w=coins[num].width*coinScale*0.1;
                coins[num].h=coins[num].height*coinScale;
                if(pauseOn==false){
                    coins[num].Y++;
                }
                //если монеты выходит за пределы поля, то меняем координаты
                if (coins[num].Y>h){
                    coins[num].Y=0-coins[num].h;
                    coins[num].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
                    while (coins[num].X>(w-coins[num].w)){//чтобы не выходили за пределы области видимости
                        coins[num].X=Math.floor(Math.random()*w);
                    }
                }
            }

    }
   
    //функция для отрисовки препятствий
    function drawObstacles (num){
        //пропишем условие столкновения ракеты с препятствием
        if((obstacles[num].X+obstacles[num].w>rocket.X) && obstacles[num].X<(rocket.X+rocket.w) && (obstacles[num].Y+obstacles[num].h)>rocket.Y && obstacles[num].Y<(rocket.Y+rocket.h)){
            crash=true;
            if(soundOn==true){
                boomAudio.play();
            }
            //при столкновении запускаем анимацию взрава препятствий
            drawBoom(obstacles[num].X,obstacles[num].Y);
            //меняем координаты препятствия, чтобы после столкновения оно исчезало и появлялось в другом месте
            obstacles[num].Y=0-obstacles[num].height*obstacles[num].scale;
            obstacles[num].X=Math.floor(Math.random()*w);
            while (obstacles[num].X>(w-obstacles[num].width*obstacles[num].scale)){//чтобы не выходили за пределы области видимости
                obstacles[num].X=Math.floor(Math.random()*w);
            }
            //забираем жизнь
            lives--;
            if (lives<1){
                gameOver()
            }
        } else {crash=false;}
        if (!crash){
            //отрисовываем препятствие и заставляем его двигаться вниз
            ctx.drawImage(obstacles[num], 0,0, 900,900, obstacles[num].X,obstacles[num].Y, 900*obstacles[num].scale,900*obstacles[num].scale);
            obstacles[num].w=obstacles[num].width*obstacles[num].scale;
            obstacles[num].h=(obstacles[num].height-40)*obstacles[num].scale;//-30 -это погрешность на торчащие лапки
            if(pauseOn==false){
                obstacles[num].Y++;
            }
            //если препятствия выходят за пределы поля, то меняем координаты
            if (obstacles[num].Y>h){
                obstacles[num].Y=0-obstacles[num].height*obstacles[num].scale;
                obstacles[num].X=Math.floor(Math.random()*w);
                while (obstacles[num].X>(w-obstacles[num].width*obstacles[num].scale)){//чтобы не выходили за пределы области видимости
                    obstacles[num].X=Math.floor(Math.random()*w);
                }
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
                        drawBoom(obstacles[i].X,obstacles[i].Y);
                        if(soundOn==true){
                            boomAudio.play();
                        }
                       //меняем координаты препятствия, чтобы посте столкновения оно исчезало и появлялось в другом месте
                       obstacles[i].Y=0-obstacles[i].height*obstacles[i].scale;
                       obstacles[i].X=Math.floor(Math.random()*w);
                       while (obstacles[i].X>(w-obstacles[i].width*obstacles[i].scale)){//чтобы не выходили за пределы области видимости
                           obstacles[i].X=Math.floor(Math.random()*w);
                       }
                    }
                }

                //при попадании в монету удаляем пулю и монету, запускаем анимацию взрыва
                for (let i=0; i<coinsNumber; i++){
                    if( this.y<(coins[i].Y+coins[i].h) && coins[i].Y<(this.y+this.h) && (coins[i].X+coins[i].w)>this.x && coins[i].X<(this.x+this.w)){
                        //удаляем из массива больше ненужный элемент
                        bullets.splice(bullets.indexOf(this));
                        //при столкновении запускаем анимацию взрава препятствий
                        drawBoom(coins[i].X-coins[i].w,coins[i].Y-coins[i].h);
                        if(soundOn==true){
                            boomAudio.play();
                        }
                       //меняем координаты препятствия, чтобы посте столкновения оно исчезало и появлялось в другом месте
                       coins[i].Y=0-coins[i].h;
                       coins[i].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
                       while (coins[i].X>(w-coins[i].w)){//чтобы не выходили за пределы области видимости
                           coins[i].X=Math.floor(Math.random()*w);
                       }
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
        //для того, чтобы при старте новой игры исчезали кнопки
        document.getElementById('app').innerHTML='';
        //проверяем, если gameOver ==true, то останавливаем функцию render
        if(gameOver===true){
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

        drawPauseButton();

        playStopSound();

        gameTimeDraw ()

        livesCounting();

        scoreCounting ();

        if(pauseOn==true){
            pauseDraw();
        }

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
            if(soundOn==true){
                shootingAudio.play();
            }
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