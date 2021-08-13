function rulesPageLoading (){
    let rules=`The goal of the game is to score as many points as possible. 
    <br> 
    <br>
    Points are collected when bumping with stars.
    <br> 
    <br>
    When bumping with an obstacle, the number of lives decreases.`;

    let rulesHtml = `<div class="rulesPage">
            <div class="rules">
                <h3>The rules of the game</h3>
                <div>${rules}</div>
            </div>
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">back to the main page</span></a>
        </div>`;
    return rulesHtml;
}