function rulesPageLoading (){
    //очищаем холст, чтобы не отображался финальный кадр игры
    let ctx = document.getElementById('game').getContext('2d');
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    let rules=`The goal of the game is to score as many points as possible. 
    <br> 
    Points are collected when bumping with coins.
    <br> 
    When bumping with an obstacle, the number of lives decreases.
    <br> 
    The rocket is controlled by "up" and "down","left" and "right" arrows of the keyboard. 
    <br>
    Shooting - with help of a space bar.
    <br> 
    Good luck!`;

    let rulesHtml = `
        <div class="rulesPage">
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
            <a href="#About" class="fciA navItem" onclick="switchToAboutPage()"><span class="fciSpan">About</span></a>
        </div>
        <div class="rules">
            <h3>The rules of the game</h3>
            <br>
            <div>${rules}</div>
        </div>`;
    return rulesHtml;
}

