function gamePageLoading (){
    //получаем текущие размеры окна браузера(холста, к которому будем обращаться) 
    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvas = document.getElementById('background');
    let ctx = canvas.getContext('2d');
    //установим количество жизней
    let lives = 5;
    let score =0;
    //переменные для управления ракетой
    let goUp=false;
    let goDown=false;
    //объявим переменную для ракеты
    let rocket=new Image();
    rocket.src='assets/rocket3.png';
    rocket.Y=0;
    rocket.X=0;
    //создадим массив монет
    let coinsNumber = 7;
    let coins=[];
    for (let i=0; i<coinsNumber; i++){
        coins[i] = new Image();
        coins[i].src = 'assets/coin-sprite-animation.png';
        coins[i].Y=h+Math.random()*h;//чтобы монеты появлялись вразброс укажем для них рандобные координаты
        coins[i].X=Math.random()*(w-coins[i].width);
    }
    
    //создадим переменную для массива с препятствиями
    let obstaclesNumber = 5;
    let obstacles = [];
    for (let i=0; i<obstaclesNumber; i++){
        obstacles[i] = new Image();
        obstacles[i].src = 'assets/rocket2.png';
        obstacles[i].Y=h+Math.random()*h;
        obstacles[i].X=Math.random()*(w-coins[i].width);
    }
    

    //функция для отображения количества жизней
    function livesCounting (){
        ctx.font ='30px Arial';
        ctx.fillStyle ='white';
        ctx.fillText('Lives:'+lives,w-235,50);
    }

    //функция для отображения счета
    function scoreCounting (){
        ctx.font ='30px Arial';
        ctx.fillStyle ='white';
        ctx.fillText('Scores:'+score,w-435,50);
    }

    //функция для остановки игры
    function gameOver (){
        cancelAnimationFrame(timer);
        ctx.font ='60px Arial';
        ctx.fillStyle='red';
        ctx.fillText('Game over', w/2,h/2);
        gameOver = true;
    }

    //функция для отрисовки ракеты
    function drawRocket () {
        //описываем условия движения ракеты
        if(goUp==true && rocket.X>0){
            rocket.X-=5
        }
        if(goDown==true && rocket.X<(w-rocket.width*0.3)){
            rocket.X+=5
        }
        //ctx.save(); // Сохраняем настройки канваса до всяких манипуляций с ним
        // Сдвигаем в центр изображения,которое хотим повернуть.Все дело в работе метода rotate.
        // Он крутит относительно верхнего левого угла. Соответственно перевернется вся система координат
        //ctx.translate(0,0);
        //ctx.rotate(120*Math.PI/180);// Поворачиваем на `degrees` наш градус
        ctx.drawImage(rocket, 0,0, rocket.width,rocket.height,rocket.X,rocket.Y, rocket.width*0.3,rocket.height*0.3/*сжали изображение до 30%*/);
        // Рисуем повернутую картинку
        // Восстанавливаем настройки на момент когда делали `ctx.save`
        // то есть до `ctx.translate` и `ctx.rotate`. Рисунок при этом сохраняется.
        //ctx.restore();
    }

    //функция для отрисовки появляющихся монет
    function drawCoins (num){
        //пропишем условие столкновения ракеты с монетами
        if(coins[num].Y<(rocket.Y+rocket.height*0.1) && (coins[num].X+coins[num].width*0.7)>rocket.X && coins[num].X<(rocket.X+rocket.width*0.3-120/*без учета пламени */)){
            bingo=true;
            //меняем координаты монеты
            coins[num].Y=h;
            coins[num].X=Math.floor(Math.random()*w);
            //увеличиваем счет
            score++;
        } else {bingo=false;}
        if (!bingo){
            //отрисовываем монету и заставляем ее двигаться вверх
            ctx.drawImage(coins[num],0/*при увеличении этого значения на 100 отображаются разные кадры спрайта */,
                0, 100,100, coins[num].X,coins[num].Y, 100*0.7,100*0.7);
            coins[num].Y--;
            //если монеты выходит за пределы поля, то меняем координаты
            if (coins[num].Y<0){
                coins[num].Y=h;
                coins[num].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
            }
        }
    }

    //функция для отрисовки препятствий
    function drawObstacles (num){
        //пропишем условие столкновения ракеты с препятствием
        if(obstacles[num].Y<(rocket.Y+rocket.height*0.1) && (obstacles[num].X+obstacles[num].width*0.7)>rocket.X && obstacles[num].X<(rocket.X+rocket.width*0.3-120/*без учета пламени */)){
            crash=true;
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
            ctx.drawImage(obstacles[num], 0,0, 1680,1680, obstacles[num].X,obstacles[num].Y, 1680*0.1,1680*0.1);
            obstacles[num].Y--;
            //если препятствия выходят за пределы поля, то меняем координаты
            if (obstacles[num].Y<0){
                obstacles[num].Y=h;
                obstacles[num].X=Math.floor(Math.random()*w);//получаем случайное число и округляем его до целого
            }
        }
    }
    
    //функция для отрисовки игры
    function render(){
        //проверяем, если gameOver ==true, то останавливаем функцию render
        if(gameOver===true){return}

        livesCounting();

        scoreCounting ();

        for (let i=0; i<coinsNumber; i++){
            drawCoins(i);
        }

        for (let i=0; i<obstaclesNumber; i++){
            drawObstacles(i);
        }

        drawRocket();

        //для отрисовки анимации
        timer=requestAnimationFrame(render);
    }
    render();

    //пропишем обработчики событий нажатия клавиш
    //нажатия клавиши
    let direction;
    addEventListener('keydown', function(e){
        direction = e.keyCode;
        if(direction===37){
            goUp=true;
        }
        if(direction===39){
            goDown=true;
        }
    })
     //отжатия клавиши
     addEventListener('keyup', function(e){
        direction = e.keyCode;
        if(direction===37){
            goUp=false;
        }
        if(direction===39){
            goDown=false;
        }
    })  
}