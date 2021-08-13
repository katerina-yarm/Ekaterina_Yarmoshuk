function gamePageLoading (){
    let gameHtml = `<div class="mainPage">
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Back to main page</span></a>
            <div class='bird'></div>
            <div class='coin'></div>
        </div>`;
    return gameHtml;
}