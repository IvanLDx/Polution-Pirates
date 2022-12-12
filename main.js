// VARIABLES
var cv=null, cx=null;
var pressing=[];
var tArr='w', tDer='d', tAba='s', tEsq='a', tAction=' ';

var pj = new Rect({
    x: 400,
    y: 500,
    width: 152,
    height: 168,
    spd: 21
})
var cam = new Camera();

var pjImg = new Image(); pjImg.src="sprite1.png";

var worldWidth=0, worldHeight=0;
var wall=[];
var map01=[
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,0,0,0,0,0,0,0,1,0,0,0,0,1,
	1,1,0,0,0,0,0,0,1,0,0,0,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,1,0,0,0,0,0,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,0,0,0,0,0,0,0,0,0,0,0,0,1,
	1,1,0,0,0,0,0,0,0,0,0,0,0,1,
	1,0,0,0,0,0,1,0,0,0,0,0,0,1,
	1,0,1,0,0,0,0,0,0,0,1,0,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,1,1,1,1,1,1];

// FUNCIÓNS PRINCIPAIS: ESTABLECEMENTO DO XOGO.
function setMap(map,columns,blockSize) {
    var col = 0;
    var row = 0;
    wall.length = 0;
    for (var i = 0; i < map.length; i++) {
        if (map[i] == 1) {
            wall.push(new Rect({
                x: col*blockSize,
                y: row*blockSize,
                width: blockSize,
                height: blockSize
            }));
        }

        col++;
        if (col >= columns) {
            row ++;
            col = 0;
        }
    }

    worldWidth = columns*blockSize;
    worldHeight = row*blockSize;
}

function init() {
	cv = document.getElementById('cv');
	cx = cv.getContext('2d');
	cv.width = 1920;
	cv.height = 1080;

	setMap(map01,14,200);
	act();
}

function act() {
	pj.debuxarMov(pressing[tDer], pressing[tEsq], 'x');
    pj.debuxarMov(pressing[tAba], pressing[tArr], 'y');

	// ENFOCAR CÁMARA
	cam.focus(pj.x + pj.width/2, pj.y + pj.height/2);

	paint();
	setTimeout(() => act(), 17);
}

function paint() {
	cx.fillStyle = "#dfdfdf";
	cx.fillRect(0,0,cv.width,cv.height);
	
    cx.fillStyle = "#202020";
    pj.fill();

	for (var i=0, l=wall.length; i<l; i++) wall[i].fill();
}

function Rect(attr) {
	// TAMAÑO E POSICIONAMENTO
	this.x = attr.x || 0
	this.y = attr.y || 0;
	this.width = attr.width || 0;
	this.height = attr.height || this.width;
	this.spd = attr.spd || 0;

    this.fill = () => {
        cx.fillRect(
            this.x - cam.x,
            this.y - cam.y,
            this.width,
            this.height);
    }
    this.andar = (speed, dir) => {
        if (dir == 'x') this.x += speed;
        else this.y += speed;
    }
    
    this.debuxarMov = (tecla1, tecla2, dir) => {
        if (tecla1) {
            this.andar(this.spd, dir);
            this.esqDer = dir == 'x' ? "der" : 'aba';
        } else if (tecla2) {
            this.andar(-this.spd, dir);
            this.esqDer = dir == 'x' ? "esq" : 'arr';
        }
    }
}

function Camera() {
	this.x = 0;
	this.y = 0;
    this.focus = (x, y) => {
        this.x = x - cv.width/2;
        this.y = y - cv.height/2;
    }
}

window.addEventListener('keydown', evt => pressing[evt.key] = true);
window.addEventListener('keyup', evt => pressing[evt.key] = false);
window.addEventListener('load', init, false);