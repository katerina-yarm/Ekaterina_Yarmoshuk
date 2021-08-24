function gamePageLoading (){
    let rocket = document.createElement('div');
    document.body.appendChild(rocket).classList='rocket';
    
    // получение целого случайного числа в заданном диапазоне
    function randomDiap(n,m) {
        return Math.floor(Math.random()*(m-n+1))+n;
    }
    
    //создаем массив, куда будем помещать вновь созданные звезды
    let starsArray=[];

    //создаем звезды и помещаем их в массив
    
    function starsCreate() {
        for(let i = 0; i < randomDiap(0,5); i++) {
            starsArray[i] = document.createElement('div');
            document.body.appendChild(starsArray[i]).classList = 'star object';
            starsArray[i].style.left=(window.innerWidth)+"px";
            starsArray[i].style.top=Math.ceil(Math.random() * window.innerHeight)+"px";
            starsArray[i].style.animation=`StarAnimation ${randomDiap(5,20)}s linear 1 forwards`;
        }
    }
   
    for(let i = 0; i < starsArray.length; i++) {
        if (document.getElementsByClassName('star')[i].offsetLeft==0){
            document.removeChild(document.getElementsByClassName('star')[i]);

        }
    }
    starsCreate();

    //функция заставляет ранее созданные частицы двигаться
   /* function starsCreate() {
        for(let i = 0; i < stars; i++) {
            star = document.createElement('div');
            document.body.appendChild(star).setAttribute('style',`left:${window.innerWidth-10}px; top:${Math.ceil(Math.random() * window.innerHeight)}px `)
            document.body.appendChild(star).classList = 'star';
            star.style.animation='starMove 4.54s linear 1 forwards';
            //starsArray.push(star); 
            //console.log(starsArray);
             star.style.animation=`starMove ${starParameters.speedX}s linear 1 forwards`;
        }
    }
    starsCreate();
    starsCreate();*/

    
    //устанавливаем управление ракетой с помощью стрелок клавиатуры
    let rocketPositionY=rocket.offsetTop;
    let rocketPositionX=rocket.offsetLeft;
    window.addEventListener('keydown',function (e) {
        if (e.keyCode == 40){
            if(rocketPositionY<window.innerHeight){
            rocketPositionY=rocket.offsetTop+5
            rocket.style.top=rocketPositionY+'px';
            }
        }
        else if (e.keyCode == 38){
            if(rocketPositionY>0){
                rocketPositionY=rocket.offsetTop-5
                rocket.style.top=rocketPositionY+'px';
            }
        } 
        else if (e.keyCode == 37){
            if(rocketPositionX>0){
                rocketPositionX=rocket.offsetLeft-5
                rocket.style.left=rocketPositionX+'px';
            }
        } 
        else if (e.keyCode == 39){
            if(rocketPositionX<window.innerWidth){
                rocketPositionX=rocket.offsetLeft+5
                rocket.style.left=rocketPositionX+'px';
            }
        } 
    });
    
    
 return '';

    
}