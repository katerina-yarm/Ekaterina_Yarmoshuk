function rulesPageLoading (){
    let rules=`Цель игры: набрать как можно, большее количество очков. Очки собираются при столкновении со звездочкой.</br>
                При столкновении с препятствием количество жизней уменьшается.`;

    let rulesHtml = `<div class="mainPage">
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Back to main page</span></a>
            <div>${rules}</div>
        </div>`;
    return rulesHtml;
}