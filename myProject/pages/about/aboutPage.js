function aboutPageLoading (){
    //очищаем холст, чтобы не отображался финальный кадр игры
    let ctx = document.getElementById('game').getContext('2d');
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    let aboutHtml = `   
        <div class="rulesPage">
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
            <a href="#Rules" class="fciA navItem" onclick="switchToRulesPage()"><span class="fciSpan">Rules</span></a>
            <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
        </div>;
        <div class="rules">
            <h3>"The Rocket Wars"</h3>
            <br>
            The development of this project included the usage of HTML5, CSS, JavaScript, Canvas, AJAX, JQuery.
        </div>`;
    return aboutHtml;
}