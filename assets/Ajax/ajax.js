        
            //функция, которая срабатывает при возникновении ошибки
            function errorHandler(e) {
                console.log('Error',e);
            }
            //функция для заливки проекта на сервер
            function creationInsert() {
                let jsonValue = JSON.stringify(records);
                $.ajax({
                    url: ajaxHandlerScript,
                    type: 'POST', dataType: 'json',
                    data: { f: 'INSERT', n: myName, v: jsonValue },
                    success: createSuccessfully,
                    error: errorHandler
                })

                function createSuccessfully(data) {
                    console.log(data)
                }

                function errorHandler() {
                    console.log('Error')
                }
            }
            //вызывается один раз (только при первоначальной заливке проекта на сервер)
            // creation();

            //функция для получения данных с сервера
            function readInfo(){  
                $.ajax(
                    {
                        url: ajaxHandlerScript, type : 'POST', dataType:'json', 
                        data : { f : 'READ', n : myName },
                        success : readReady, error : errorHandler  
                    }
                );
            }
            //если данные получены, то выполняется следующая функция
            function readReady(callresult){
                if (callresult.error!=undefined)
                alert(callresult.error);
                else if ( callresult.result!="" ) {
                    result = JSON.parse(callresult.result);
                }
                //сортирует от большего к меньшему
                result.sort((prev, next) => next.record - prev.record);
            }
            //сразу подгрузим данные с сервера
            readInfo();
            //блокировка и изменение строки
            let updatePassword;
            // LOCKGET — чтение строки и планирование её изменения
            /*параметры:f=LOCKGET;n=имя;p=пароль (Возвращает строку с именем имя и одновременно её блокирует на 1 минуту 
            для последующего изменения командой UPDATE. Для успешного изменения требуется в команде UPDATE предоставить тот же пароль,
            который был указан в команде LOCKGET.При попытке заблокировать уже заблокированную другим пользователем строку делается 
            несколько попыток блокирования через некоторое время; затем возникает ошибка.*/
            function lockgetAndUpdateInfo() {
                updatePassword = Math.random();
                $.ajax({
                    url: ajaxHandlerScript, type: 'POST', dataType: 'json',
                    data: { f: 'LOCKGET', n: myName, p: updatePassword },
                    success: lockGetReady, error: errorHandler
                }
                );
                function lockGetReady(callresult) {
                    /*UPDATE — изменение заблокированной строки
                    параметры:f=UPDATE;n=имя;p=пароль;v=значение
                    Для строки с именем имя изменяет значение на значение, одновременно снимая с неё блокировку. 
                    Для успешного изменения требуется предоставить тот же пароль, который был указан в команде LOCKGET.
                    Возвращает строку "ОК". При попытке изменения незаблокированной строки, при попытке слишком позднего 
                    (через 1 минуту после блокирования) изменения строки, при неправильном указании пароля возникает ошибка.
                    Максимальный объём сохраняемых в сервисе строк установлен в 1 мегабайт.*/
                    if (callresult.error != undefined)
                        alert(callresult.error);
                    else {
                        $.ajax({
                            url: ajaxHandlerScript, type: 'POST', dataType: 'json',
                            data: { f: 'UPDATE', n: myName, v: JSON.stringify(result), p: updatePassword },
                            success: updateReady, error: errorHandler
                        }
                        );
                    }
                    function updateReady(callresult) {
                        if (callresult.error != undefined)
                            alert(callresult.error);
                    }
                }   
            }