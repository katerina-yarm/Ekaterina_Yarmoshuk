//реализация через класс и функцию конструктор
/*class User {
    constructor (name){
        this.name=name;
    }
    sayHi(){
        console.log(`Привет,${this.name}`)
    }
}
const dima = new User("Дима");

dima.sayHi();

const user = {};
user.prototype.sayHi = function(name){console.log(`Привет,${name}`)};
user.prototype.sayHi("Дима")*/

/*function sum(a,b){
    if(arguments.length==2){
        return a+b;
    }
    return function (b1){
        return a+b1;
    } 
}

function sum1 (a){
    return function (b){
        return a+b;
    }
}
const sum = sum1(1);
sum(2);*/

//spread оператор - работа с массивами
//const citiesRussia = ['Москва','Волгоград','Казань']
//const citiesEurope = ['Париж',"Берлин","Прага"]
//const citiesAll = [...citiesRussia,...citiesEurope]
//console.log(citiesAll)

//spread оператор - работа с объектами
//const citiesRussiaInfo = {Москва: 20, Волгоград:8, Казань:10}
//const citiesEuropeInfo = {Париж:15, Берлин:9, Прага:4}
//const citiesAllInfo = {...citiesRussiaInfo,...citiesEuropeInfo}
//console.log(citiesAllInfo)

/*const array=[1,2,3,4,5]
function sum(...rest){
    console.log(rest.reduce((a,b)=>a+b,0))
}
sum(...array)

Object.prototype.sayHello=function(name){
    console.log(`Hello,${name}`)
}
Object.prototype.sayHello('Катя')*/

/*let array = [22,15,7,26,91,56,71,3]
let ar = array.filter((numb)=> numb>=18)
ar = array.map((numb)=> numb*2)
ar = array.reduce((a,b)=> a+b,0)
let arr = array.find((a)=> a===71)
ar = array.findIndex((a)=> a===71)
ar=array.concat(array)
array.forEach(a=> console.log(a))
console.log(ar)*/

/*function* gen(){
    yield 'H'
    yield 'e'
    yield 'l'
    yield 'l'
    yield 'o'
}
const gener=gen();
console.log(gener.next())*/

function counter (){
    let value = 0;
    return function () {
       return ++value
    }
}

const counter1 = counter();
const counter2 = counter();

counter1();

console.log(counter1()); //2
console.log(counter2()); //1


