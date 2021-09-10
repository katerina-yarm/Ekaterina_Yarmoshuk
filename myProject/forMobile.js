 //                                        ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
    
    
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