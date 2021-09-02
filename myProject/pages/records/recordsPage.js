function recordsPageLoading (){
    //очищаем холст, чтобы не отображался финальный кадр игры
    let ctx = document.getElementById('game').getContext('2d');
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    //пропишем условие для установки значения переменной record
    if (parseInt(localStorage.getItem('top1'))>0){
        record1=localStorage.getItem('top1');
        name1 = localStorage.getItem('name1');
        if (parseInt(localStorage.getItem('top2'))>0){
            record2=localStorage.getItem('top2');
            name2 = localStorage.getItem('name2');
            if (parseInt(localStorage.getItem('top3'))>0){
                record3=localStorage.getItem('top3');
                name3 = localStorage.getItem('name3');
                if (parseInt(localStorage.getItem('top4'))>0){
                    record4=localStorage.getItem('top4');
                    name4 = localStorage.getItem('name4');
                    if (parseInt(localStorage.getItem('top5'))>0){
                        record5=localStorage.getItem('top5');
                        name5 = localStorage.getItem('name5');
                    }
                }
            }
        }
    }

   
    let recordsHtml = `
        <div class="recordsPage">
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Rules" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Rules</span></a>
        </div>
        <table class="zebra">
            <tr>
                <th></th>
                <th>Name</th>
                <th>Score</th>
            </tr>
            <tr>
                <td>1</td>
                <td>${name1}</td>
                <td>${record1}</td>
            </tr>
            <tr>
                <td>2</td>
                <td>${name2}</td>
                <td>${record2}</td>
            </tr>
            <tr>
                <td>3</td>
                <td>${name3}</td>
                <td>${record3}</td>
            </tr>
            <tr>
                <td>4</td>
                <td>${name4}</td>
                <td>${record4}</td>
            </tr>
            <tr>
                <td>5</td>
                <td>${name5}</td>
                <td>${record5}</td>
            </tr>
        </table>`;
    return recordsHtml;
}