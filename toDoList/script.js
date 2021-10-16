
    const app = document.getElementById('app');

    //создаем хранилище с заметками
    const todos = {};
    todos.id1 = { 
        id: 1,
        name:'Уборка',
        description: "Вымыть кухню",
        endDate:'20.10.2021',
        priority:'middle'
    };
    todos.id2 = { 
        id: 2,
        name:'Развлечение',
        description: "Сходить в театр",
        endDate:'20.10.2021',
        priority:'high'
    };
    
    //прорисовываем интерфейс отображения всех элементов, которые находятся в хранилище todos
    function render (){
        let toDoNum=1;
        let html = '';
        html+=`
        <header id="todo">
            <h1>Мои списки дел</h1>
            <button onclick='newToDoForm()'>Добавить новую запись</button>
            <button id='switchTheme'>Изменить тему</button>
        </header>`
        for (let key in todos){
            html+= `
            <div class='list' id="${todos[key].id}">
                <div class='card-number'>${toDoNum}</div>
                <h5 class="card-title">${todos[key].name}</h5>
                <p class="card-text">${todos[key].endDate}</p>
                <p class="card-text">${todos[key].priority}</p>
                <p class="card-text">${todos[key].description}</p>
                <button data-todoid=${todos[key].id} type="button" class='btn-del'>Удалить</button>
                <button type="button" onclick='showChangesForm(${todos[key].id})'>Изменить</button> 
            </div>`
            toDoNum++;
        }
        return html;
    }

    // отображает все записи + позволяет работать с ними (т.е. внутри функция для удаления записи)
    function showToDos () {
        app.innerHTML=render();

        let buttons = document.querySelectorAll('.btn-del'); //выбирает в массив все кнопки класса '.btn-del'
        buttons.forEach ((btn,indx) => {// назначим обработчик по кнопке, он будет вызван, когда кликнут на любую кнопку
            btn.addEventListener('click', function(e){
                //e.target ссылается на кликнутый элемент
                let buttonId = e.target.dataset.todoid;
                for (let key in todos){
                    if (todos[key].id == buttonId){
                        delete todos[key];
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
        form.innerHTML = changesRender(modalButtonId);
    }

    //функция render для отображения полей заметки, которую нужно откорректировать
    function changesRender(id){
        let modalHTML ="";
            modalHTML += `  
                    <h5>Здесь вы можете внести изменения в заметку</h5>
                    <div class="modal-body">
                        <div>
                            <label>Название</label>
                            <input id="name" value="${todos[`id${id}`].name}">
                        </div>
                        <div>
                            <label>Id</label>
                            <input id="id" value="${todos[`id${id}`].id}" readonly>
                        </div>
                        <div>
                            <label>Приоритер</label>
                            <input id="priority" value="${todos[`id${id}`].priority}">
                        </div>
                        <div>
                            <label>Дата окончания</label>
                            <input id="endDate" value="${todos[`id${id}`].endDate}">
                        </div>
                        <div>
                            <label>Описание</label>
                            <input id="description" value="${todos[`id${id}`].description}">
                        </div>
                    </div>
                    <div>
                    <button type="button" onclick='getChangedValues()'>Сохранить изменения</button>
                    </div>`;
            return modalHTML;
    }
    
    //забираем измененные данные из формы, вносим изменения в заметку и удаляем форму
    function getChangedValues() {
        let name = document.getElementById('name').value;
        let id = document.getElementById('id').value;
        let priority = document.getElementById('priority').value;
        let description = document.getElementById('description').value;
        let endDate = document.getElementById('endDate').value;

        todos[`id${id}`].name=name;
        todos[`id${id}`].id=id;
        todos[`id${id}`].priority=priority;
        todos[`id${id}`].description=description;
        todos[`id${id}`].endDate=endDate;
        
        showToDos();
        document.body.removeChild(document.body.getElementsByClassName('form')[0]);
    }

    //                                          Добавляем новую заметку
    //функция для создания формы добавления новой записи
    function newToDoForm () {
        let newToDo = document.createElement('form');
        document.body.appendChild(newToDo).classList = "newToDo formStyle";
        newToDo.innerHTML = newToDoRender();
    }

    //функция render для отображения полей для заполнения данных по новой заметке
    function newToDoRender(){
        let modalHTML ="";
            modalHTML += `  
                    <h5>Внесите новую заметку в ваш список дел</h5>
                    <div class="modal-body">
                        <div>
                            <label>Название</label>
                            <input id="newName" placeholder='Развлечение'>
                        </div>
                        <div>
                            <label>Id</label>
                            <input id="newId" placeholder='5'>
                        </div>
                        <div>
                            <label>Приоритер</label>
                            <input id="newPriority" placeholder='Средний'>
                        </div>
                        <div>
                            <label>Дата окончания</label>
                            <input id="newEndDate" placeholder='12.12.2028'>
                        </div>
                        <div>
                            <label>Описание</label>
                            <input id="newDescription" placeholder='Сходить в театр'>
                        </div>
                    </div>
                    <button type="button" onclick='getNewValues()'>Сохранить изменения</button>`;
            return modalHTML;
    }
    
    //забираем данные по новой заметке из формы, добавляем новую заметку и удаляем форму
    function getNewValues() {
        let name = document.getElementById('newName').value;
        let id = document.getElementById('newId').value;
        let priority = document.getElementById('newPriority').value;
        let description = document.getElementById('newDescription').value;
        let endDate = document.getElementById('newEndDate').value;

        todos['id'+id]={
            id: id,
            name:name,
            description: description,
            endDate: endDate,
            priority:priority
        }
        localStorage.setItem (`todos[id${id}]`, JSON.stringify(todos['id'+id]));
        showToDos();
        document.body.removeChild(document.body.getElementsByClassName('newToDo')[0]);
    }

    