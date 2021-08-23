function rulesPageLoading (){
    let rules=`The goal of the game is to score as many points as possible. 
    <br> 
    <br>
    Points are collected when bumping with stars.
    <br> 
    <br>
    When bumping with an obstacle, the number of lives decreases.
    <br> 
    <br>
    Good luck!`;

    let rulesHtml = `
            <div class="rulesPage">
                <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
                <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
                <a href="#Records" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Scores</span></a>
            </div>
            <div class="rules">
                <h3>The rules of the game</h3>
                <br>
                <div>${rules}</div>
            </div>`;
    
   
    return rulesHtml;
}

