function gamePageLoading (){
    //получаем текущие размеры окна браузера(холстаБ к которому будем обращаться) 
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
    rocket.src='assets/rocket.png';
    rocket.Y=-700;
    rocket.X=0;
    //объявим переменную для звезды
    let star=new Image();
    star.src='assets/stars.png';
    star.X=-180;
    star.Y=100;
    //объявим переменную для препятствия
    let obstacle=new Image();
    obstacle.src='assets/rocket.png';
    obstacle.X=-180;
    obstacle.Y=100;

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
        if(goUp===true && rocket.X>0){
            rocket.X-=5
        }
        if(goDown===true && rocket.X<h){
            rocket.X+=5
        }


        ctx.save(); // Сохраняем настройки канваса до всяких манипуляций с ним
        ctx.translate(0,0);// Сдвигаем все адресованные пиксели на указанные значения
        ctx.scale(0.4, 0.4);
        ctx.rotate(85*Math.PI/180);// Поворачиваем на `degrees` наш градус
        ctx.drawImage(rocket, rocket.X, rocket.Y);// Рисуем повернутую картинку
        // Восстанавливаем настройки на момент когда делали `ctx.save`
        // то бишь до `ctx.translate` и `ctx.rotate`. Рисунок при этом сохраняется.
        ctx.restore(); 
    }


    //функция для отрисовки игры
    function render(){
        //проверяем, если gameOver ==true, то останавливаем функцию render
        if(gameOver===true){return;}


        livesCounting();
        scoreCounting ();
        drawRocket();

        //для отрисовки анимации
        timer=requestAnimationFrame(render);
    }
    render();

    //пропишем обработчики событий нажатия клавиш
    //нажатия клавиши
    addEventListener('keydown', function(e){
        let direction = e.keyCode;
        if(direction===38){
            goUp=true;
        }
        if(direction===40){
            goDown=true;
        }
    })

    //отжатия клавиши
    addEventListener('keyUp', function(e){
        let direction = e.keyCode;
        if(direction===38){
            goUp=false;
        }
        if(direction===40){
            goDown=false;
        }
    })

    
 

    
}