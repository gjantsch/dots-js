class ColorComponent {
    constructor(min, max, value, step) {
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
    }

    increment() {
        this.value = this.value + this.step;
        if (this.value >= this.max || this.value <= this.min) {
            this.step = this.step * -1
        }
    }
};


class Color {
    constructor() {
        this.red = new ColorComponent(1, 254, parseInt(Math.random() * 255), 1);
        this.blue = new ColorComponent(1, 254, parseInt(Math.random() * 255), 1);
        this.green = new ColorComponent(1, 254, parseInt(Math.random() * 255), 1);
        this.alfa = 255;
    }

    increment() {
        this.red.increment();
        this.green.increment();
        this.blue.increment();
    }
}


class Dot {

    constructor(x, y, incrementX, incrementY, minX, minY, maxX, maxY) {
        this.x = x;
        this.y = y;
        this.incrementX = incrementX;
        this.incrementY = incrementY;
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.color = new Color();
    }

    increment() {

        this.x += this.incrementX;
        this.y += this.incrementY;

        if (this.y >= this.maxY || this.y <= this.minY) {
            this.incrementY = this.incrementY * -1;
        }

        if (this.x >= this.maxX || this.x <= this.minX) {
            this.incrementX = this.incrementX * -1;
        }

        this.color.increment();
    }

    accelerate(i) {
        this.incrementX = i * (this.incrementX > 0 ? 1 : -1);
        this.incrementY = i * (this.incrementY > 0 ? 1 : -1);
    }

    distanceTo(dot) {
        let dx = Math.pow(this.x - dot.x, 2);
        let dy = Math.pow(this.y - dot.y, 2);
        return Math.sqrt(dx + dy);
    }

    animate(board) {

        this.increment();

        var attractDistance = parseInt(board.canvas.width / 3);

        for (var index = 0; index < board.dots.length; index++) {
            var other = board.dots[index];
            if (this.distanceTo(other) < attractDistance) {
                let opacity = Math.abs(1 - (this.distanceTo(other) / attractDistance));
                board.drawLine(other, this, opacity);
            }
        }

        board.drawCircle(this);
        
    }
}

class Board {
    containerSelector = null;
    container = null;
    canvas = null;
    context = null;
    canvasData = null;
    dots = [];

    installCanvasOn(cssSelector) {

        var container = document.querySelector(cssSelector);
        var canvas = document.createElement("canvas");
        canvas.className = "myClass";
        canvas.id = "myId";
        canvas.height = container.clientHeight;
        canvas.width = container.clientWidth;
        canvas.style.backgroundColor = '#fff';

        container.appendChild(canvas)

        this.canvas = canvas;
        this.container = container;
        this.containerSelector = cssSelector;

        if (this.canvas.getContext) {
            this.context = canvas.getContext("2d");
            this.canvasData = this.context.getImageData(0, 0, canvas.width, canvas.height);

        }
    }

    drawPixel(dot) {

        this.context.beginPath();
        this.context.fillStyle = `rgb(${dot.color.red.value}, ${dot.color.green.value}, ${dot.color.blue.value}, 1)`;
        this.context.strokeStyle = `rgb(${dot.color.red.value}, ${dot.color.green.value}, ${dot.color.blue.value}, 1)`;
        this.context.arc(dot.x, dot.y, 1, 0, 2 * Math.PI, false)
        this.context.lineWidth = 1;
        this.context.fill();
        this.context.stroke();
    }

    updateCanvas() {
        this.context.putImageData(this.canvasData, 0, 0);
    }

    addDot(x, y) {
        this.dots.push(new Dot(x, y, 1, 1, 1, 1, this.canvas.clientWidth, this.canvas.clientHeight));
    }

    addRandomDot() {
        var x = parseInt(Math.random() * this.canvas.clientWidth);
        var y = parseInt(Math.random() * this.canvas.clientHeight);
        var incrementX = parseInt(Math.random() * 10) > 5 ? 1 : -1;
        var incrementY = parseInt(Math.random() * 10) > 5 ? 1 : -1;
        var last = this.dots.push(new Dot(x, y, incrementX, incrementY, 1, 1, this.canvas.clientWidth, this.canvas.clientHeight)) -1;

        return this.dots[last];

    }

    drawLine(dot1, dot2, opacity = 1) {

        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.moveTo(dot1.x, dot1.y);
        this.context.lineTo(dot2.x, dot2.y);
        this.context.strokeStyle = `rgb(${dot1.color.red.value}, ${dot1.color.green.value}, ${dot1.color.blue.value}, ${opacity})`;
        this.context.stroke();

    }

    clearLine(dot1, dot2) {

        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(dot1.x, dot1.y);
        this.context.lineTo(dot2.x, dot2.y);
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

    }

    contextSave() {
        this.context.save();
    }

    contextRestore() {
        this.context.restore();
    }

    drawCircle(dot) {
        this.context.beginPath();
        this.context.fillStyle = `rgb(${dot.color.red.value}, ${dot.color.green.value}, ${dot.color.blue.value}, 1)`;
        this.context.strokeStyle = `rgb(${dot.color.red.value}, ${dot.color.green.value}, ${dot.color.blue.value}, 0.5)`;
        this.context.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
    }

    clearCircle(dot) {
        this.context.beginPath();
        this.context.fillStyle = `rgb(255, 255, 255, 1)`;
        this.context.strokeStyle = `rgb(255, 255, 255, 1)`;
        this.context.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        this.context.stroke();
        this.context.fill();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
