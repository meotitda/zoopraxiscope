var Film = function() {
	this.prevAllSceneHeight = 0; 
	this.currentSceneID = 0;
	this.enterNewScene = false; 
	this.acc = 0.2;
	this.delayedYOffset = 0;
	this.rafID;
	this.rafState;
	this.section = []
	this.root = document.querySelector('body')
};

Film.prototype.addSection = function(section) {
	this.section.push(section)
}

var Section = function(info) {
	this.videoImageCount = info.videoImageCount
	this.imagePath = info.imagePath
	this.firstImageSequence = info.firstImageSequence
	this.extension = info.extension
	this.videoImages = []
	console.log(info.name)
	const section = document.getElementById(info.name)
	const wrapper = document.createElement("DIV");

	wrapper.classList.add('sticky-elem', 'sticky-elem-canvas')
	const canvas = document.createElement("canvas");
	canvas.width = info.canvasWidth
	canvas.height = info.canvasHeight
	canvas.id = "video-canvas-0"
	wrapper.appendChild(canvas)
	section.appendChild(wrapper)
}

Section.prototype.setCanvasImages = function() {
	for (let i = 0; i < this.videoImageCount; i++) {
		const imgElem = new Image();
		imgElem.src = `${this.imagePath}${this.firstImageSequence + i}.${this.extension}`;
		this.videoImages.push(imgElem);
	}
}

function setLayout() {
	setContainerHeight();

	// set CurrentSceneID
	let totalScrollHeight = 0;
	for (let i = 0; i < filmInfo.length; i++) {
		totalScrollHeight += filmInfo[i].playLength;
		if (totalScrollHeight >= window.pageYOffset) {
			currentSceneID = i;
			break;
		}
	}
	document.body.setAttribute('id', `show-scene-${currentSceneID}`);


	setCanvasLayout();

	function setCanvasLayout() {
		const widthRatio = window.innerWidth / 1920;
		const heightRatio = window.innerHeight / 1080;
		let canvasScaleRatio;
		if (widthRatio <= heightRatio) {
			canvasScaleRatio = heightRatio;
		}
		else {
			canvasScaleRatio = widthRatio;
		}
		filmInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasScaleRatio})`;
		filmInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasScaleRatio})`;
	}

	function setContainerHeight() {
		for (let i = 0; i < filmInfo.length; i++) {
			if (filmInfo[i].type === 'sticky' || filmInfo[i].type === 'wide') {
				filmInfo[i].playLength = filmInfo[i].playLengthParam * window.innerHeight;
			}
			else if (filmInfo[i].type === 'normal') {
				filmInfo[i].playLength = filmInfo[i].objs.container.offsetHeight;
			}
			filmInfo[i].objs.container.style.height = `${filmInfo[i].playLength}px`;
		}
	}
}