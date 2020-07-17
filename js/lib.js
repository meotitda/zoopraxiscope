var Film = function() {
	this.prevAllSceneHeight = 0; 
	this.currentSceneID = 0;
	this.enterNewScene = false; 
	this.acc = 0.2;
	this.delayedYOffset = 0;
	this.rafID;
	this.rafState;
	this.sections = []
	this.root = document.querySelector('body')
};

Film.prototype.addSection = function(section) {
	this.sections.push(section)
}

Film.prototype.play = function() {
	
}

var Section = function(info) {
	const id = `zoopraxiscope-canvas${this.id}`

	this.playLength=info.playLength
	this.name=info.name
	this.videoImageCount = info.videoImageCount
	this.imagePath = info.imagePath
	this.firstImageSequence = info.firstImageSequence
	this.extension = info.extension
	this.videoImages = []
	const section = document.getElementById(info.name)
	const wrapper = document.createElement("DIV");
	
	this.components = info.components
	this.animation = info.animation

	wrapper.classList.add('zoopraxiscope', `zoopraxiscope-canvas`)
	wrapper.id = id
	const canvas = document.createElement("canvas");
	canvas.width = info.canvasWidth
	canvas.height = info.canvasHeight
	canvas.id = "video-canvas-0"
	wrapper.appendChild(canvas)
	section.appendChild(wrapper)

	Object.assign(this.components, {canvas: document.querySelector(`#${id}`)})
	Object.assign(this.components, {container: document.querySelector(`#${this.name}`)})
}

Section.prototype.setCanvasImages = function() {
	for (let i = 0; i < this.videoImageCount; i++) {
		const imgElem = new Image();
		imgElem.src = `${this.imagePath}${this.firstImageSequence + i}.${this.extension}`;
		this.videoImages.push(imgElem);
	}
}

Section.prototype.play = function() {
	if (scrollRatioAtCurrentScene <= 0.41) { 
		components.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_in, currentYOffsetAtCurrentScene);
		components.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
	} else {
		components.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_out, currentYOffsetAtCurrentScene);
		components.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
	}
}

Film.prototype.setLayout= function () {
	setContainerHeight(this.sections);

	// set CurrentSceneID
	let totalScrollHeight = 0;
	for (let i = 0; i < this.sections.length; i++) {
		totalScrollHeight += this.sections[i].playLength;
		if (totalScrollHeight >= window.pageYOffset) {
			currentSceneID = i;
			break;
		}
	}
	document.body.setAttribute('id', `show-scene-${currentSceneID}`);


	setCanvasLayout(this.sections);

	function setCanvasLayout(sections) {
		const widthRatio = window.innerWidth / 1920;
		const heightRatio = window.innerHeight / 1080;
		let canvasScaleRatio;
		if (widthRatio <= heightRatio) {
			canvasScaleRatio = heightRatio;
		}
		else {
			canvasScaleRatio = widthRatio;
		}
		let totalScrollHeight = 0;

		for (let i = 0; i < sections.length; i++) {
			sections[i].components.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasScaleRatio})`;
		}
	}

	function setContainerHeight(sections) {
		for (let i = 0; i < sections.length; i++) {
			if (sections[i].type === 'sticky' || sections[i].type === 'wide') {
				sections[i].playLength = sections[i].playLengthParam * window.innerHeight;
			}
			else if (sections[i].type === 'normal') {
				sections[i].playLength = sections[i].components.container.offsetHeight;
			}
			sections[i].components.container.style.height = `${sections[i].playLength}px`;
		}
	}
}