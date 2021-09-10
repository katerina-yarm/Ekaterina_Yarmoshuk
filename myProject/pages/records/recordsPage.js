function recordsPageLoading (){
    //очищаем холст, чтобы не отображался финальный кадр игры
    let ctx = document.getElementById('game').getContext('2d');
    ctx.clearRect(0,0,window.innerWidth, window.innerHeight);

    //установка значений переменной records из локального хранилища
    function getDataFromLocalStorage () {
        if (parseInt(localStorage.getItem('top1'))>0){
            records[0].record=localStorage.getItem('top1');
            records[0].name = localStorage.getItem('name1');
            if (parseInt(localStorage.getItem('top2'))>0){
                records[1].record=localStorage.getItem('top2');
                records[1].name = localStorage.getItem('name2');
                if (parseInt(localStorage.getItem('top3'))>0){
                    records[2].record=localStorage.getItem('top3');
                    records[2].name = localStorage.getItem('name3');
                    if (parseInt(localStorage.getItem('top4'))>0){
                        records[3].record=localStorage.getItem('top4');
                        records[3].name = localStorage.getItem('name4');
                        if (parseInt(localStorage.getItem('top5'))>0){
                            records[4].record=localStorage.getItem('top5');
                            records[4].name = localStorage.getItem('name5');
                        }
                    }
                }
            }
        }
    }

    readInfo();
    let recordsHtml = `
        <div class="recordsPage">
            <a href="#Main" class="fciA navItem" onclick="switchToMainPage()"><span class="fciSpan">Main page</span></a>
            <a href="#Game" class="fciA navItem" onclick="switchToGamePage()"><span class="fciSpan">New Game</span></a>
            <a href="#Rules" class="fciA navItem" onclick="switchToRecordsPage()"><span class="fciSpan">Rules</span></a>
        </div>
        <table>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Score</th>
            </tr>`
            for (let i = 0; i < result.length; i++) {
                recordsHtml += 
                    `<tr>
                        <td>${i+1}</td>
                        <td>${result[i].name}</td>
                        <td>${result[i].record}</td>
                    </tr>`
            } recordsHtml += '</table>';
    return recordsHtml;
}