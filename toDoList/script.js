    //создадим переменную для смены языка
    let languageChange='en';
    function languageChangeButton(language){
        languageChange=language;
        showToDos();
    }

    const app = document.getElementById('app');

    //создаем хранилище с заметками
    let todos=[]; 
    
    /*todos = [
        { 
            id: 1,
            name:'Уборка',
            description: "Вымыть кухню",
            endDate:'2021-10-20',
            priority:'Средний'
        },
        { 
            id: 2,
            name:'Развлечение',
            description: "Сходить в театр",
            endDate:'2021-10-18',
            priority:'Высокий'
        }
    ];*/
   
    
    //прорисовываем интерфейс отображения всех элементов, которые находятся в хранилище todos
    function render (){
        let toDoNum=1;
        if (JSON.parse(localStorage.getItem('todos'))==null){
            todos=[];  
        } else {
            todos=JSON.parse(localStorage.getItem('todos'));
        }
        
        let html = '';
        for (let i=0; i<todos.length; i++){
            html+= `
            <div class='list' id="${todos[i].id}">
                <div class='card-number'>${toDoNum}</div>
                <h5 class="card-title">${todos[i].name}</h5>
                <p class="card-date">${todos[i].endDate}</p>
                <p class="card-priority">${todos[i].priority}</p>
                <p class="card-description">${todos[i].description}</p>
                <button data-todoid=${todos[i].id} type="button" class='btn-del lng-delete'>Удалить</button>
                <button type="button" onclick='showChangesForm(${todos[i].id})' class='lng-change'>Изменить</button> 
            </div>`
            toDoNum++;
        }
        return html;
    }

    // отображает все записи + позволяет работать с ними (т.е. внутри функция для удаления записи)
    function showToDos () {
        app.innerHTML=render();
        changeLanguage(languageChange);

        let buttons = document.querySelectorAll('.btn-del'); //выбирает в массив все кнопки класса '.btn-del'
        buttons.forEach ((btn,indx) => {// назначим обработчик по кнопке, он будет вызван, когда кликнут на любую кнопку
            btn.addEventListener('click', function(e){
                //e.target ссылается на кликнутый элемент
                let buttonId = e.target.dataset.todoid;
                for (let i=0; i<todos.length; i++){
                    if (todos[i].id == buttonId){
                        todos.splice(i,1);
                        localStorage.clear();
                        localStorage.setItem (`todos`, JSON.stringify(todos));
                        showToDos ();
                    }
                }
            }); 
        })
    }
    
    showToDos();

    
    //                                          Вносим изменения в заметку
    //функция создания формы для внесения изменений в заметку
    function showChangesForm (modalButtonId) {
        let form = document.createElement('form');
        document.body.appendChild(form).classList = "form formStyle";
        let index=todos.findIndex(i=>i.id==modalButtonId)
        form.innerHTML = changesRender(index);
        changeLanguage(languageChange);
    }

    //функция render для отображения полей заметки, которую нужно откорректировать
    function changesRender(i){
        let modalHTML ="";
            modalHTML += `  
                    <h5 class="lng-changeTitle">Здесь вы можете внести изменения в заметку</h5>
                    <div class="modal-body">
                        <div>
                            <label class="lng-title">Название</label>
                            <input id="name" value="${todos[i].name}">
                        </div>
                        <div>
                            <label>Id</label>
                            <input id="id" value="${todos[i].id}" readonly>
                        </div>
                        <div>
                            <label class="lng-priority">Приоритет</label>
                            <input id="priority" value="${todos[i].priority}">
                        </div>
                        <div>
                            <label class="lng-endDate">Дата окончания</label>
                            <input id="endDate" type='date' value="${todos[i].endDate}">
                        </div>
                        <div>
                            <label class="lng-description">Описание</label>
                            <input id="description" value="${todos[i].description}">
                        </div>
                    </div>
                    <div>
                    <button type="button" onclick='getChangedValues(${i})' class="lng-saveChanges">Сохранить изменения</button>
                    </div>`;
            return modalHTML;
    }
    
    //забираем измененные данные из формы, вносим изменения в заметку и удаляем форму
    function getChangedValues(i) {
        let name = document.getElementById('name').value;
        let id = parseInt(document.getElementById('id').value);
        let priority = document.getElementById('priority').value;
        let description = document.getElementById('description').value;
        let endDate = document.getElementById('endDate').value;

        todos[i].name=name;
        todos[i].id=id;
        todos[i].priority=priority;
        todos[i].description=description;
        todos[i].endDate=endDate;

        localStorage.clear();
        localStorage.setItem (`todos`, JSON.stringify(todos));
        showToDos();
        document.body.removeChild(document.body.getElementsByClassName('form')[0]);
    }

    //                                          Добавляем новую заметку
    //функция для создания формы добавления новой записи
    function newToDoForm () {
        let newToDo = document.createElement('form');
        document.body.appendChild(newToDo).classList = "newToDo formStyle";
        newToDo.innerHTML = newToDoRender();
        changeLanguage(languageChange);
    }

    //функция render для отображения полей для заполнения данных по новой заметке
    function newToDoRender(){
        let modalHTML ="";
            modalHTML += `  
                    <h5 class="lng-newNoteTitle">Внесите новую заметку в ваш список дел</h5>
                    <div class="modal-body">
                        <div>
                            <label class="lng-title">Название</label>
                            <input id="newName" placeholder='Развлечение'>
                        </div>
                        <div>
                            <label>Id</label>
                            <input id="newId" placeholder='5'>
                        </div>
                        <div>
                            <label class="lng-priority">Приоритет</label>
                            <select id="newPriority">
                                <option value="Низкий" selected class="lng-lowPriority">Низкий</option>
                                <option value="Средний" class="lng-middlePriority">Средний</option>
                                <option value="Высокий" class="lng-highPriority">Высокий</option>
                            </select>
                        <div>
                            <label class="lng-endDate">Дата окончания</label>
                            <input id="newEndDate" type='date'>
                        </div>
                        <div>
                            <label class="lng-description">Описание</label>
                            <input id="newDescription" placeholder='Сходить в театр'>
                        </div>
                    </div>
                    <button type="button" onclick='getNewValues()' class="lng-saveChanges">Сохранить изменения</button>`;
            return modalHTML;
    }
    
    //забираем данные по новой заметке из формы, добавляем новую заметку и удаляем форму
    function getNewValues() {
        let name = document.getElementById('newName').value;
        let id = parseInt(document.getElementById('newId').value);
        let priority = document.getElementById('newPriority').value;
        let description = document.getElementById('newDescription').value;
        let endDate = document.getElementById('newEndDate').value;

        let todo = {
            id: id,
            name:name,
            description: description,
            endDate: endDate,
            priority:priority
        };
        todos.push(todo);
        localStorage.clear();
        localStorage.setItem (`todos`, JSON.stringify(todos));
        showToDos();
        document.body.removeChild(document.body.getElementsByClassName('newToDo')[0]);
    }

    //скрипт для переключения тем
    let switchTheme=document.getElementById('switchTheme');
    switchTheme.addEventListener('click',function(){
        let theme=document.getElementById('theme');
        if(theme.getAttribute('href')=='styles/light.css'){
            theme.href='styles/dark.css';
        } else {
            theme.href='styles/light.css';
        }
    });

    //сортировка по дате (от ближайшей даты к дальней)
    function dateSort(){
        if (JSON.parse(localStorage.getItem('todos'))==null){
            todos=[];  
        } else {
            todos=JSON.parse(localStorage.getItem('todos'));
        }

        todos.sort(function(a,b){
          return new Date(a.endDate) - new Date(b.endDate);
        });

        localStorage.clear();
        localStorage.setItem (`todos`, JSON.stringify(todos));
        showToDos();
    }

    //сортировка по приоритету (от высокого к низкому)
    function prioritySort(){
        if (JSON.parse(localStorage.getItem('todos'))==null){
            todos=[];  
        } else {
            todos=JSON.parse(localStorage.getItem('todos'));
        }

        let priorities = 
            {
              'Высокий' : 0, 
              'Средний' : 1,
              'Низкий' : 2
            }
        todos.sort(function (a, b) {
            return priorities[a.priority] - priorities[b.priority];
        });

        localStorage.clear();
        localStorage.setItem (`todos`, JSON.stringify(todos));
        showToDos();
    }

    //изменяем язык сайта
    function changeLanguage (language){
        for(let key in langArr){
            let elem = document.querySelectorAll(`.lng-${key}`)
            for(let i=0; i<elem.length; i++){
                elem[i].innerHTML=langArr[key][language]
            }
        }
    }
    