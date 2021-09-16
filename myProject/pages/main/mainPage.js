function mainPageLoading (){
    //очищаем холст, чтобы не отображался финальный кадр игры
    let ctx = document.getElementById('game').getContext('2d');
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    function sound(){
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
    let MainHtml = `   
        <div class="mainPage">
            <img src='assets/rocket.png'>
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Rules" class="fciA navItem" onclick="switchToRulesPage()"><span class="fciSpan">Rules</span></a>
            <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
            <a href="" class="fciA navItem" onclick="sound()"><span class="fciSpan">On/Off sound</span></a>
        </div>`;
    return MainHtml;
}