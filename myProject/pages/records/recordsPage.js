function recordsPageLoading (){
   
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
                <td>Екатерина</td>
                <td>256</td>
            </tr>
            <tr>
                <td>2</td>
                <td>Артемий</td>
                <td>200</td>
            </tr>
            <tr>
                <td>3</td>
                <td>Михаил</td>
                <td>152</td>
            </tr>
            <tr>
                <td>4</td>
                <td>Михаил</td>
                <td>102</td>
            </tr>
            <tr>
                <td>5</td>
                <td>Михаил</td>
                <td>12</td>
            </tr>
        </table>`;
    return recordsHtml;
}