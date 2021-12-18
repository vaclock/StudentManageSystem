var canvas = document.getElementById('snow');
const container = document.getElementById('container');
var context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 300;
// var x1 = 150 - 50 * Math.sin(30 * Math.PI / 180),
//     y1 = 100 - 50 * Math.sin(60 * Math.PI / 180);
// var x2 = 150 + 50 * Math.sin(30 * Math.PI / 180),
//     y2 = 100 + 50 * Math.sin(60 * Math.PI / 180);
// context.moveTo(x1, y1);
// context.lineTo(x2, y2);
// var x3 = 150 + 50 * Math.sin(30 * Math.PI / 180),
//     y3 = 100 - 50 * Math.sin(60 * Math.PI / 180);

// var x4 = 150 - 50 * Math.sin(30 * Math.PI / 180),
//     y4 = 100 + 50 * Math.sin(60 * Math.PI / 180);
// context.moveTo(x3, y3);
// context.lineTo(x4, y4);
// context.stroke();

/**
 * 根据参数创建雪花 
 * @param {Number} x0 雪花画板的起点
 * @param {Number} y0 
 * @param {Number} scale 缩放的倍数
 * @param {Number} speedX 雪花向下飘落的速度
 * @param {Number} speedY 雪花向右飘落的速度
 * @param {Number} speedR 雪花旋转的速度
 */
function Snow(x0, y0, rotate, scale, speedX, speedY, speedR) {
    this.x0 = x0;
    this.y0 = y0;
    this.rotate = rotate;
    this.scale = scale;
    this.speedX = speedX;
    this.speedY = speedY;
    this.speedR = speedR;
}
var snows = [];
Snow.prototype.render = function () {
    context.save();
    context.beginPath();
    context.translate(this.x0, this.y0);
    context.scale(this.scale, this.scale);
    context.rotate(this.rotate);
    context.moveTo(-20, 0);
    context.lineTo(20, 0);
    var x = Math.sin(30 / 180 * Math.PI) * 20,
        y = Math.sin(60 / 180 * Math.PI) * 20;
    context.moveTo(-x, -y);
    context.lineTo(x, y);
    context.moveTo(-x, y);
    context.lineTo(x, -y);
    context.strokeStyle = '#fff';
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.stroke();
    context.restore();
}
function init() {
    for (var i = 0; i < 20; ++i) {
        var x = Math.random() * canvas.width;
        var speedX = (Math.random() - 0.5 )* 5 + 2;
        var speedY = Math.random() * 5 + 2;
        var scale = Math.random() + 0.5;
        var speedR = Math.random() * 0.1;
        (function (x0, y0, rotate, scale, speedX, speedY, speedR) {
            var timer = setTimeout(function () {
                var snow = new Snow(x0, y0, rotate, scale, speedX, speedY, speedR);
                snow.render();
                snows.push(snow);
            }, Math.random() * 8000)
        })(x, 0, 0, scale, speedX, speedY, speedR)
    }
    snowing(snows);
}

init();

function snowing(snowArray) {
    // canvas动画的实质
    setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < snowArray.length; ++i) {
            snowArray[i].x0 = (snowArray[i].x0 + snowArray[i].speedX) % canvas.width;
            snowArray[i].y0 = (snowArray[i].y0 + snowArray[i].speedY) % canvas.height;
            snowArray[i].rotate = (snowArray[i].rotate + snowArray[i].speedR) % 60;
            snowArray[i].render();
        }
    }, 30)
}