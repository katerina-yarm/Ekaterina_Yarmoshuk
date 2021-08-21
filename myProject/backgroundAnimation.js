function bg (){
    //получаем текущие размеры окна браузера
    let w = window.innerWidth;
    let h = window.innerHeight;
    let canvas = document.getElementById('background');
    let ctx = canvas.getContext('2d');
    canvas.setAttribute('width',w);
    canvas.setAttribute('height',h);
    //указываем сколько будет создано частиц
    let stars = 100;
    //создаем массив, в котором будем хранить наши частицы
    let starsArray = new Array;
    //создаем массив цветов (чтобы пыль была разноцветная)
    let colors = ['#ffd893','#ef6b4d','white','#f3a998','#fac365'];
    //задаем максимальный размер частиц
    let size = 3;
    //задаем частоту вызова функции (в интервале 60 кадров в секунду)
    let rate = 60;
    //устанавливаем скорость движения частиц
    let speed = .5;

    // получение целого случайного числа в заданном диапазоне
    function randomDiap(n,m) {
      return Math.floor(Math.random()*(m-n+1))+n;
    }
    // описываем функцию для создания массива с частицами звездной пыли
    function create() {
      for(let i = 0; i < stars; i++) {
        starsArray[i] = {
          x: Math.ceil(Math.random() * w),
          y: Math.ceil(Math.random() * h),
          toX:Math.random() * 5 - 1, //число,на которое будет смещаться частица в сторону после создания по оси х
          toY:Math.random() * 2 - 1, //благодаря этой функции будут образовываться и отрицательные числа, следовательно движение в обратном направлении
          c: colors[randomDiap(0,colors.length-1)],
          size: Math.random() * size // Math.random() возвращает псевдослучайное число с плавающей запятой из диапазона [0, 1]
        }
      }
    }

    //устанавливаем начальные координаты позиции мышки
    let mouse = { x: 0, y: 0 };
    //функция устанавливает новые координаты позиции мыши
    function MouseMove(e) {
      mouse.x = e.screenX; 
      mouse.y = e.screenY;
   }

    function DistanceBetween(p1,p2) {
      let dx = p2.x-p1.x;
      let dy = p2.y-p1.y;
      return Math.sqrt(dx*dx + dy*dy);
    }

    //функция заставляет ранее созданные частицы двигаться
    function starsMove() {
      //после каждой итерации очищаем наш холст, так как в противном случае у нас не будут двигаться частиты,а будут отрисовываться полоски
      ctx.clearRect(0,0,w,h);
      //навешиваем слушатель события, чтобы при наведении мышкой записывались новые координаты
      canvas.addEventListener('mousemove', MouseMove, false);
      for(let i = 0; i < stars; i++) {
        //при наведении мышкой круги в этой области будут отрисовываться большего размера
        let sizeFactor = DistanceBetween( mouse, starsArray[i] );
        let distanceFactor = Math.max( Math.min( 15 - ( sizeFactor / 10 ), 10 ), 1 );
        ctx.beginPath();
        //рисуем круг
        ctx.arc(starsArray[i].x,starsArray[i].y,starsArray[i].size*distanceFactor,0,Math.PI*2,false);
        //указываем цвет заливки
        ctx.fillStyle = starsArray[i].c;
        //и цвет обводки
        ctx.strokeStyle=starsArray[i].c;
        //прописываем условие (если четный, то обводим)
        if(i%2==0)
          ctx.stroke();
        else //если нечетный, то закрашиваем
          ctx.fill();
        //чтобы частицы начали двигаться, то смещаем их координаты
        starsArray[i].x = starsArray[i].x + starsArray[i].toX*speed;
        starsArray[i].y = starsArray[i].y + starsArray[i].toY*speed;

        //чтобы процесс был бесконечным, то как только координаты частицы заходят за пределы поля частицы появляется с противоположной стороны
        if(starsArray[i].x > w){
          starsArray[i].x = 0; 
        }
        if(starsArray[i].y > h) {
          starsArray[i].y = 0; 
        }
        if(starsArray[i].x < 0) {
          starsArray[i].x = w; 
        }
        if(starsArray[i].y < 0) {
          starsArray[i].y = h; 
        }
      }
      setTimeout(starsMove,1000/rate);
    }

  create();
  starsMove();
}