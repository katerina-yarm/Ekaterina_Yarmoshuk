let soundOn=false;

//переменная для фоновой музыки и зациклим ее воспроизведение
let fonAudio = new Audio("assets/audio/fon2.mp3");
fonAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

// создадим элемент аудио для выстрела
let shootingAudio=new Audio;
shootingAudio.src="assets/audio/shoot.mp3";

// создадим элемент аудио для удара с препятствием
let boomAudio=new Audio;
boomAudio.src="assets/audio/boom.mp3";

// создадим элемент аудио для столкновения с монетой
let coinAudio=new Audio;
coinAudio.src="assets/audio/coin.mp3";

// создадим элемент аудио для окончания игры
let gameOverAudio=new Audio;
gameOverAudio.src="assets/audio/gameOver.mp3";

// создадим элемент аудио нажатия кнопки
let buttonClick=new Audio;
buttonClick.src="assets/audio/button_click.mp3";
