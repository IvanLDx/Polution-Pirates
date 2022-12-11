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
}), cam = new Camera();

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
    for (var i=0, l=map.length; i<l; i++) {
        if (map[i] == 1) {wall.push(new Rect({
            x: col*blockSize,
            y: row*blockSize,
            width: blockSize,
            height: blockSize
        }));}

        col++;
        if (col >= columns) {
            row ++;
            col = 0;
        }
    }

    // TAMAÑO DO MUNDO
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
	pj.debuxarMov(pressing[tDer], pressing[tEsq]);

	// ENFOCAR CÁMARA
	cam.focus(pj.x + pj.width/2, pj.y + pj.height/2);

	paint();
	setTimeout(() => act(), 17);
}

function paint() {
	// FONDO
	cx.fillStyle = "#dfdfdf";
	cx.fillRect(0,0,cv.width,cv.height);
	
	// PJ
	if(pj.imgArea == "der") {
		pj.anim(pjImg,5,0,pj.width,pj.height);
	} else if(pj.imgArea == "runDer") {
		pj.anim(pjImg,1.8,pj.height,pj.width,pj.height);
	} else if(pj.imgArea == "esq") {
		pj.anim(pjImg,5,pj.height*2,pj.width,pj.height);
	} else if(pj.imgArea == "runEsq") {
		pj.anim(pjImg,1.8,pj.height*3,pj.width,pj.height);
	}

	// WALL
	cx.fillStyle = "#202020";
	for (var i=0, l=wall.length; i<l; i++) {
        wall[i].fill();
    }
}

// FUNCIÓNS SECUNDARIAS.
function Rect(attr) {
	// TAMAÑO E POSICIONAMENTO
	this.x = attr.x || 0
	this.y = attr.y || 0;
	this.width = attr.width || 0;
	this.height = attr.height || this.width;

	// MOVEMENTO
	this.spd = attr.spd || 0;

	// ESTABLECER IMAXES
	this.imgArea = "der";
	this.startElapsedTime = this.imgArea;
	this.elapsedTime = 0;
}
Rect.prototype.fill = function() {
	cx.fillRect(
        this.x - cam.x,
        this.y - cam.y,
        this.width,
        this.height);
}
Rect.prototype.anim = function(img,imgX,imgY,imgW,imgH) {
    imgX = (~~(pj.elapsedTime/imgX)%10)*pj.width
	cx.drawImage(
        img,
        imgX, imgY,
        imgW, imgH,
        this.x - cam.x, this.y - cam.y,
        this.width, this.height);
}
Rect.prototype.roza = function(rect) {
    if (rect != null) {
        return (
            this.x < rect.x + rect.width
            && this.x + this.width > rect.x
            && this.y < rect.y + rect.height
            && this.y + this.height > rect.y );
    }
}
Rect.prototype.andar = function(speed) {
// Movemento esquerda e dereita e roce contra wall. this.stat = "choca";
    this.x += speed;
    for (var i = 0; i < wall.length ; i++) {
    	if(this.roza(wall[i])) {
    		if(this.esqDer == "esq") this.x = wall[i].x + wall[i].width;
    		else if(this.esqDer == "der") this.x = wall[i].x - this.width;
    	}
    }
}

Rect.prototype.debuxarMov = function(tecla1, tecla2) {
// Aquí están recollidas as variables de establecemento de imaxes
// this.andar();
	if (tecla1) {
        this.andar(this.spd);
        this.esqDer = "der";
        this.imgArea = "runDer";
    } else if (tecla2) {
        this.andar(-this.spd);
        this.esqDer = "esq";
        this.imgArea = "runEsq";
    }

	if (!tecla1 && this.imgArea == "runDer") this.imgArea = "der";
	if (!tecla2 && this.imgArea == "runEsq") this.imgArea = "esq";

// Aquí reiníciase a lectura de sprites.
    this.elapsedTime = this.elapsedTime < 3600 ? this.elapsedTime + 1 : 0;
// Esta función fai que, cada vez que a animación cambie, os sprites comecen dende o primeiro.
	if (this.startElapsedTime != this.imgArea) {
        this.startElapsedTime = this.imgArea;
        this.elapsedTime = 0;
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