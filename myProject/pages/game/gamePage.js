function gamePageLoading (){
    let rocket = document.createElement('div');
    document.body.appendChild(rocket).classList='rocket';   
    let stars = 1;
    let starsArray=[];
    

    //функция заставляет ранее созданные частицы двигаться
    function starsCreate() {
        for(let i = 0; i < stars; i++) {
            star = document.createElement('div');
            document.body.appendChild(star).setAttribute('style',`left:${window.innerWidth-10}px; top:${Math.ceil(Math.random() * window.innerHeight)}px`)
            document.body.appendChild(star).classList = 'star';
            starsArray.push(star); 
            console.log(starsArray);
        }
    }
    starsCreate();
    starsCreate();

    let starPosX;
    let starPosY;
    
    function starsMove(){
        for(let i=0; i<starsArray;i++){
            starPosX=starsArray[i].getBoundingClientRect().left;
            starPosY=starsArray[i].getBoundingClientRect().top;
            starsArray[i].setAttribute('style',`left:${starPosX-10}px; top:${starPosY}px`);
        }
    }
    
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