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
    let userName;
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

    //объявим переменную кнопки стрельбы
    let shootingButton=new Image();
    shootingButton.src='assets/shootingButton.png';
    //кнопки управления
    let left=new Image();
    left.src='assets/arrows.png';
    let right=new Image();
    right.src='assets/arrows.png';
    let up=new Image();
    up.src='assets/arrows.png';
    let down=new Image();
    down.src='assets/arrows.png';

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
    
    //создадим переменную для массива с препятствиями
    let obstaclesNumber = 6;
    let scaleChange=0;
    let obstacles = [];
    for (let i=0; i<obstaclesNumber; i++){
        obstacles[i] = new Image();
        obstacles[i].src = 'assets/monster.png';
        obstacles[i].Y=0-Math.random()*h;
        obstacles[i].X=Math.random()*(w-obstacles[i].width);
        obstacles[i].scale=scaleChange;
        scaleChange+=0.05;
        if(scaleChange==0.2){
            scaleChange=0;
        }
    }

    //функция для отрисовки кнопки включения/выключения звука
    function playStopSound (){
        //для адаптива кнопок
        let x,y;
        if (window.innerWidth<=812){
            x=0.6;y=0.6;
        } else if (812<window.innerWidth && window.innerWidth<1050) {
            x=0.75;y=0.75; 
        } else if (window.innerWidth>=1050){
            x=1;y=1;
        }
        // Сохраняем настройки канваса до всяких манипуляций с ним
        ctx.save();
        if (soundOn==true){
            ctx.scale(x,y);
            ctx.drawImage(soundButton, 0,0, 500,500,10,7, 500*0.12,500*0.12);
        } 
        if (soundOn==false){
            ctx.scale(x,y);
            ctx.drawImage(soundButton, 0,0, 500,500,10,7, 500*0.12,500*0.12);
            ctx.strokeStyle="white";
            ctx.lineWidth=2;
            ctx.beginPath();
            ctx.moveTo(50,21);
            ctx.lineTo(25,51);
            ctx.stroke(); 
        }
        // Восстанавливаем настройки на момент когда делали `ctx.save`
        ctx.restore();
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
        //для адаптива кнопок
        let x,y;
        if (window.innerWidth<=812){
            x=0.6;y=0.6;
        } else if (812<window.innerWidth && window.innerWidth<1050) {
            x=0.75;y=0.75; 
        } else if (window.innerWidth>=1050){
            x=1;y=1;
        }
        ctx.save();
        ctx.scale(x,y);
        ctx.drawImage(pauseButton, 0,0, 388,390,80,5, 388*0.16,390*0.16);
        ctx.restore();
    }
    //навесим слушатель событий на кнопку Паузы(чтобы при нажатии ставить игру на паузу)
    canvas.addEventListener( "click", e => {
        if(e.offsetX > 60 && e.offsetX < 140 && e.offsetY > 10 && e.offsetY < 60) {
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
        ctx.fillText('Pause', w/2-w/10,h/2);
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
        if (window.innerWidth<560){
            ctx.font ='18px Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Time:'+getGameTime(),w-130,35);     
        } else if (window.innerWidth>=560){
            ctx.font ='2.5vw Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Time:'+getGameTime(),w/2,h/12);
        }
    }

    //функция для отображения количества жизней
    function livesCounting (){
        if (window.innerWidth<560){
            ctx.font ='18px Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Lives:'+lives,w-130,60);     
        } else if (window.innerWidth>=560){
            ctx.font ='2.5vw Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Lives:'+lives,w-w/6.5,h/12);
        }
    }

    //функция для отображения счета
    function scoreCounting (){
        if (window.innerWidth<560){
            ctx.font ='18px Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Scores:'+score,w-130,85);     
        } else if (window.innerWidth>=560){
            ctx.font ='2.5vw Gowun Batang';
            ctx.fillStyle ='#a09e9e';
            ctx.fillText('Scores:'+score,w-w/3.5,h/12);
        }
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
        gameOver = true;
        if(soundOn==true){
            gameOverAudio.play();
        }
        ctx.font ='10vw Gowun Batang';
        ctx.fillStyle='#900000';
        ctx.fillText('Game over', w/2-w/4,h/2);
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
        let rocketScale;
        if (window.innerWidth<=812){
            rocketScale=0.2 
        } else if (812<window.innerWidth && window.innerWidth<1050) {
            rocketScale=0.3  
        } else if (window.innerWidth>=1050){
            rocketScale=0.4
        }

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
        let coinScale;
        //параметры для адаптива препятствий
        if (window.innerWidth<=812){
            coinScale=0.35; 
        } else if (812<window.innerWidth && window.innerWidth<1050) {
            coinScale=0.45; 
        } else if (window.innerWidth>=1050){
            coinScale=0.6;
        }
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
        let obstaclesScale;
        //параметры для адаптива препятствий
        if (window.innerWidth<=812){
            obstaclesScale=0.02+scaleChange; 
        } else if (812<window.innerWidth && window.innerWidth<1050) {
            obstaclesScale=0.07+scaleChange; 
        } else if (window.innerWidth>=1050){
            obstaclesScale=0.15+scaleChange;
        }
        //пропишем условие столкновения ракеты с препятствием
        if((obstacles[num].X+obstacles[num].w>(rocket.X+rocket.w/4)) && obstacles[num].X<(rocket.X+rocket.w-rocket.w/4) && (obstacles[num].Y+obstacles[num].h)>rocket.Y && obstacles[num].Y<(rocket.Y+rocket.h)){
            crash=true;
            if(soundOn==true){
                boomAudio.play();
            }
            //при столкновении запускаем анимацию взрава препятствий
            drawBoom(obstacles[num].X,obstacles[num].Y);
            //меняем координаты препятствия, чтобы после столкновения оно исчезало и появлялось в другом месте
            obstacles[num].Y=0-2*obstacles[num].h;
            obstacles[num].X=Math.floor(Math.random()*w);
            while (obstacles[num].X>(w-obstacles[num].w)){//чтобы не выходили за пределы области видимости
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
            obstacles[num].w=obstacles[num].width*(obstaclesScale+obstacles[num].scale);
            obstacles[num].h=obstacles[num].height*(obstaclesScale+obstacles[num].scale)-40;//-40 -это погрешность на торчащие лапки
            ctx.drawImage(obstacles[num], 0,0, 460,302, obstacles[num].X,obstacles[num].Y, obstacles[num].w,obstacles[num].h+40);
            if(pauseOn==false){
                obstacles[num].Y++;
            }
            //если препятствия выходят за пределы поля, то меняем координаты
            if (obstacles[num].Y>h){
                obstacles[num].Y=0-2*obstacles[num].h;
                obstacles[num].X=Math.floor(Math.random()*w);
                while (obstacles[num].X>(w-obstacles[num].w)){//чтобы не выходили за пределы области видимости
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
                this.w = 463*0.02;
                this.h = 539*0.02;
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
    
    //функция для получения имени игрока
    function saveNewRecords (){
        //пропишем условия для сохранения рекордов игры в локальном хранилище
        function localStorageSort () {
            if(score>localStorage.getItem('top5')){
                if(score>localStorage.getItem('top4')){
                    if(score>localStorage.getItem('top3')){
                        if(score>localStorage.getItem('top2')){
                            if(score>localStorage.getItem('top1')){
                                records[4].name=records[3].name;
                                localStorage.setItem('name5', records[4].name);
                                records[3].name=records[2].name;
                                localStorage.setItem('name4', records[3].name);
                                records[2].name=records[1].name;
                                localStorage.setItem('name3', records[2].name);
                                records[1].name=records[0].name;
                                localStorage.setItem('name2', records[1].name);
                                records[0].name = document.getElementById('IName').value;
                                localStorage.setItem('name1', records[0].name);
                                records[4].record=records[3].record;
                                localStorage.setItem('top5', records[4].record);
                                records[3].record=records[2].record;
                                localStorage.setItem('top4', records[3].record);
                                records[2].record=records[1].record;
                                localStorage.setItem('top3', records[2].record);
                                records[1].record=records[0].record;
                                localStorage.setItem('top2', records[1].record);
                                records[0].record=score;
                                localStorage.setItem('top1', records[0].record);
                            } else {
                                records[4].name=records[3].name;
                                localStorage.setItem('name5', records[4].name);
                                records[3].name=records[2].name;
                                localStorage.setItem('name4', records[3].name);
                                records[2].name=records[1].name;
                                localStorage.setItem('name3', records[2].name);
                                records[1].name= document.getElementById('IName').value;
                                localStorage.setItem('name2', records[1].name);
                                records[4].record=records[3].record;
                                localStorage.setItem('top5', records[4].record);
                                records[3].record=records[2].record;
                                localStorage.setItem('top4', records[3].record);
                                records[2].record=records[1].record;
                                localStorage.setItem('top3', records[2].record);
                                records[1].record=score;
                                localStorage.setItem('top2', records[1].record);
                            }
                        } else {
                            records[4].name=records[3].name;
                            localStorage.setItem('name5', records[4].name);
                            records[3].name=records[2].name;
                            localStorage.setItem('name4', records[3].name);
                            records[2].name= document.getElementById('IName').value;
                            localStorage.setItem('name3', records[2].name);
                            records[4].record=records[3].record;
                            localStorage.setItem('top5', records[4].record);
                            records[3].record=records[2].record;
                            localStorage.setItem('top4', records[3].record);
                            records[2].record=score;
                            localStorage.setItem('top3', records[2].record);
                        }
                    }else {
                        records[4].name= records[3].name;
                        localStorage.setItem('name5',  records[4].name);
                        records[3].name = document.getElementById('IName').value;
                        localStorage.setItem('name4',  records[3].name);
                        records[4].record=records[3].record;
                        localStorage.setItem('top5', records[4].record);
                        records[3].record=score;
                        localStorage.setItem('top4', records[3].record);
                    }
                }else {
                    records[4].name = document.getElementById('IName').value;
                    localStorage.setItem('name5',  records[4].name);
                    records[4].record=score;
                    localStorage.setItem('top5', records[4].record);
                }  
            }
        }
        
        //записываем новые данные
        userName = document.getElementById('IName').value;
        result[result.length-1].record = score;
        result[result.length-1].name = userName;
        //сортирует от большего к меньшему
        result.sort((prev, next) => next.record - prev.record);
        //сохраняем новые данные
        lockgetAndUpdateInfo();
        readInfo();
        
        //удаляется ненужное окно
        document.body.removeChild(document.getElementsByClassName('chempionWindow')[0]);
        //и появляется нужное
        pageHTML=buttonsDraw();
        document.getElementById('app').innerHTML=pageHTML;
        return userName;
    }

    //функция для отрисовки окна с вводом имени победителя
    function getChempionsWindow () {
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
        button.addEventListener('click', saveNewRecords); 

        let buttonName = document.createElement('span');
        button.appendChild(buttonName).classList = 'fciSpan';
        let buttonText = document.createTextNode('Enter');
        buttonName.appendChild(buttonText);
    }
    
    //                                        ПЕРЕМЕННЫЕ ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
    //пропишем обработчики тач событий для движения ракетой
    let touchStart = null; //Точка начала касания
    let touchPosition = null; //Текущая позиция
    let touch = false;
    //Перехватываем события
    canvas.addEventListener("touchstart", function (e) { TouchStart(e); }); //Начало касания
    canvas.addEventListener("touchmove", function (e) { TouchMove(e); }); //Движение пальцем по экрану
    //Пользователь отпустил экран
    canvas.addEventListener("touchend", function (e) { TouchEnd(e); });
    //навесим слушатель событий на кнопки управления
    canvas.addEventListener( "touchstart", function (e) { touchButtonStart(e); });
    canvas.addEventListener( "touchend", function (e) { touchButtonEnd(e); });
    function TouchStart(e){
        //Получаем текущую позицию касания
        touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        if (touchStart.x>rocket.X && touchStart.x<(rocket.X+rocket.w) && touchStart.y>rocket.Y && touchStart.y<(rocket.Y+rocket.h)){
            touchPosition = { x: touchStart.x, y: touchStart.y };
            touch=true;
            rocket.X=touchPosition.x-rocket.w/2;
            rocket.Y=touchPosition.y-rocket.h/2;
        }
    }
    function TouchMove(e){
        //Получаем новую позицию
        if (touch==true){
            touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            rocket.X=touchPosition.x-rocket.w/2;
            rocket.Y=touchPosition.y-rocket.h/2;
        }
    }
    function TouchEnd(e){
        //Очищаем позиции
        touchStart = null;
        touchPosition = null;
        touch=false;
    }

    //функция для отрисовки кнопки стрельбы
    function drawShootingButton (){
        ctx.drawImage(shootingButton, 0,0, 1610,1610,(window.innerWidth/2-shootingButton.width*0.05/2),(window.innerHeight-shootingButton.height*0.05-70), 1610*0.05,1610*0.05);
    }
    //кнопки управления
    function drawUpButton (){
        ctx.drawImage(up, 200,0, 260,150,(window.innerWidth-150),(window.innerHeight-200), 586*0.2,426*0.18);
    }
    function drawDownButton (){
        ctx.drawImage(down, 200,300, 260,160,50,(window.innerHeight-100), 586*0.2,426*0.2);
    }
    function drawLeftButton (){
        ctx.drawImage(left, 0,130, 260,190,20,(window.innerHeight-200), 586*0.2,426*0.2);
    }
    function drawRightButton (){
        ctx.drawImage(right, 330,160, 260,150,(window.innerWidth-150),(window.innerHeight-100), 586*0.2,426*0.16);
    }
    function touchButtonStart(e) {
        touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        if(touchStart.x > (window.innerWidth/2-40) && touchStart.x < (window.innerWidth/2+40) && touchStart.y >(window.innerHeight-shootingButton.height*0.05-70)) {
            shoot=true;
            //при нажатии на область запускаем звуковой файл
            if(soundOn==true){
                shootingAudio.play();
            }
        }
        if(touchStart.x > (window.innerWidth/2+shootingButton.width*0.05/2) && touchStart.y>(window.innerHeight-shootingButton.height*0.05/2-70)) {
            goRight=true;
        }
        if(touchStart.x < (window.innerWidth/2-shootingButton.width*0.05/2) && touchStart.y>(window.innerHeight-shootingButton.height*0.05/2-70)) {
            goDown=true;
        }
        if(touchStart.x > (window.innerWidth/2+shootingButton.width*0.05/2) && touchStart.y<(window.innerHeight-shootingButton.height*0.05/2-70)) {
            goUp=true;
        }
        if(touchStart.x < (window.innerWidth/2-shootingButton.width*0.05/2) && touchStart.y<(window.innerHeight-shootingButton.height*0.05/2-70)) {
            goLeft=true;
        }
    }
    function touchButtonEnd (e) {
        touchStart = null;
        shoot=false; 
        goRight=false;
        goDown=false;
        goUp=false;
        goLeft=false;
    }
    
    //                                          функция для ОТРИСОВКИ ИГРЫ
    function render(){
        //для того, чтобы при старте новой игры исчезали кнопки
        document.getElementById('app').innerHTML='';
        //проверяем, если gameOver ==true, то останавливаем функцию render
        if(gameOver===true){
            //получаем данные с сервера
            readInfo();
            //проверяем, является ли полученный результат больше наименьшего значения в таблице рекордов (если да, то заменяем его новым значением) 
            if (records[records.length-1].record < score) {
                getChempionsWindow();
                return;
            /*} if(score>parseInt(localStorage.getItem('top5')) || isNaN(parseInt(localStorage.getItem('top5')))){
                getChempionsName();
                return;*/
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

        if(window.innerWidth<769){
            drawShootingButton ();
            drawUpButton();
            drawDownButton();
            drawLeftButton();
            drawRightButton();
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