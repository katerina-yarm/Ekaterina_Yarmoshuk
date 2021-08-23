function mainPageLoading (){
    let MainHtml = `<div class="mainPage">
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Rules" class="fciA navItem" onclick="switchToRulesPage()"><span class="fciSpan">Rules</span></a>
            <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
        </div>`;
    return MainHtml;
}