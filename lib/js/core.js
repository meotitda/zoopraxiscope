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

Film.prototype.scrollLoop = function() {
		this.enterNewScene = false;
		this.prevAllSceneHeight = 0;
		// console.log('currentSceneID', this.currentSceneID)
		// console.log('this.delayedYOffset', this.delayedYOffset)
		// console.log('this.sections[this.currentSceneID]', this.sections[this.currentSceneID])
		for (let i = 0; i < this.currentSceneID; i++) {
			this.prevAllSceneHeight += this.sections[i].playLength;
		} // 이전씬의 높이 세팅 - 필름

		if (this.delayedYOffset > this.prevAllSceneHeight + this.sections[this.currentSceneID].playLength) {
			if (this.currentSceneID === this.sections.length -1) return; 
			this.enterNewScene = true;
			this.currentSceneID++;
			document.body.setAttribute('id', `show-scene-${this.currentSceneID}`);
		} // 씬의 변경 - 필름

		if (this.delayedYOffset < this.prevAllSceneHeight) {
			this.enterNewScene = true;
			if (this.currentSceneID === 0) return; 
			this.currentSceneID--;
			document.body.setAttribute('id', `show-scene-${this.currentSceneID}`);
		} // 씬의 변경 - 필름



		if (this.enterNewScene) {
			for(let i =0; i<this.sections.length; i++) {
				if(this.sections[this.currentSceneID] == this.sections[i]){
					if(!this.sections[this.currentSceneID].fadeIn)
					this.sections[i].scenes.section.style.opacity = 1
				}else {
					if(!this.sections[this.currentSceneID].fadeOut)
					this.sections[i].scenes.section.style.opacity = 0
				}
			}
			return; // 씬의 변경 - 필름
		}

		this.sections[this.currentSceneID].playAnimation(this.prevAllSceneHeight); // 씬마다 애니메이션 실행
}

Film.prototype.calculateValueFromCurrentScene = function(animations, currentYOffsetAtCurrentScene) {
	let value;
	const currentSceneScrollHeight = this.sections[this.currentSceneID].playLength;
	const currentScrollRatio = currentYOffsetAtCurrentScene / currentSceneScrollHeight; 
	if (animations.length === 3) {
		const startTimingHeight = animations[2].start * currentSceneScrollHeight;
		const endTimingHeight = animations[2].end * currentSceneScrollHeight;
		const animationDurationHeight = endTimingHeight - startTimingHeight;
		if (currentYOffsetAtCurrentScene >= startTimingHeight && currentYOffsetAtCurrentScene <= endTimingHeight) {
			const currentPlayingHeight  = currentYOffsetAtCurrentScene - startTimingHeight
			value = currentPlayingHeight / animationDurationHeight * (animations[1] - animations[0]) + animations[0];
		} else if (currentYOffsetAtCurrentScene < startTimingHeight) {
			value = animations[0];
		} else if (currentYOffsetAtCurrentScene > endTimingHeight) {
			value = animations[1];
		}
	} else {
		value = currentScrollRatio * (animations[1] - animations[0]) + animations[0];
	}

	return value;
}

Film.prototype.init = function() {

	if(this.sections.length < 0) {
		throw new Error('section이 존재하지 않습니다요.')
	}

	window.addEventListener('load', () => {
		let tempYOffset = window.pageYOffset;
		let tempScrollCount = 0;
		let firstSection = this.sections[0]

		if(firstSection.type == 'projector') {
			firstSection.scenes.context.drawImage(firstSection.videoImages[0], 0, 0);
		}
		if (tempYOffset > 0) {
			let siId = setInterval(() => {
				scrollTo(0, tempYOffset);
				tempYOffset += 1;
	
				if (tempScrollCount > 20) {
					clearInterval(siId);
				}
				tempScrollCount++;
			}, 20);
		} // 초반 따다닥
		  
        window.addEventListener('scroll', () => {
			this.scrollLoop(); 
  			if (!this.rafState) {
  				this.rafID = requestAnimationFrame(animationLoop.bind(this)); // 이미지 변경 (필름->섹션) - 필름
				  this.rafState = true;

			  }
			  
			  function animationLoop() {
				this.delayedYOffset = this.delayedYOffset + (window.pageYOffset - this.delayedYOffset) * this.acc; // 가속
		
				if (!this.enterNewScene) {
					if (this.sections[this.currentSceneID].type == 'projector') {
						const currentYOffset = this.delayedYOffset - this.prevAllSceneHeight;
						const scenes = this.sections[this.currentSceneID].scenes;
						const section = this.sections[this.currentSceneID];
						let sequence = Math.round(this.calculateValueFromCurrentScene(section.imageSequencesStartEnd, currentYOffset)) - section.imageSequencesStartEnd[0];
						if (section.videoImages[sequence]) {
							scenes.context.drawImage(section.videoImages[sequence], 0, 0);
						}	
					}
				}  // 씬에 대한 그림 그리기
		
				rafID = requestAnimationFrame(animationLoop.bind(this));
				if (Math.abs(window.pageYOffset - this.delayedYOffset) < 1) {
					cancelAnimationFrame(rafID);
					this.rafState = false;
				}
			}
  		});
	
		  window.addEventListener('resize', () => {
			  if (window.innerWidth > 900) {
				  this.setLayout();
				//   filmInfo[3].cssMeta.rectangleY = 0;
			}
	
			// if (currentSceneID === 3) {
			// 	let tempYOffset = window.pageYOffset;
			// 	let tempScrollCount = 0;
			// 	if (tempYOffset > 0) {
			// 		let siId = setInterval(() => {
			// 			scrollTo(0, tempYOffset);
			// 			tempYOffset -= 50;
	
			// 			if (tempScrollCount > 20) {
			// 				clearInterval(siId);
			// 			}
			// 			tempScrollCount++;
			// 		}, 20);
			// 	}
			// }
		  });
	});
}

Film.prototype.addSection = function(section) {
	this.sections.push(section)
}

var Section = function(info) {
	this.playLength=info.playLength
	this.id=info.id
	this.type=info.type
	this.imageSequencesStartEnd=info.imageSequencesStartEnd
	this.playLengthParam=info.playLengthParam
	this.videoImageCount = info.videoImageCount
	this.imagePath = info.imagePath
	this.firstImageSequence = info.firstImageSequence
	this.extension = info.extension
	this.videoImages = []
	this.scenes = info.scenes
	this.animations = info.animations
	this.fadeIn = typeof info.fadeIn === 'boolean' ? info.fadeIn : true
	this.fadeOut = typeof info.fadeOut === 'boolean' ? info.fadeOut : true


	if(this.type === 'void') {
		Object.assign(this, {section: document.querySelector(`#${this.id}`)})
	}
	const canvasID = `zoopraxiscope-canvas-${this.id}`

	const section = document.getElementById(this.id)
	const canvasWrapper = document.createElement("stage");

	canvasWrapper.classList.add(`zoopraxiscope-canvas`, 'zoopraxiscope-sticky')
	const canvas = document.createElement("canvas");
	canvas.width = info.canvasWidth
	canvas.height = info.canvasHeight
	canvas.id = canvasID

	canvasWrapper.appendChild(canvas)
	section.appendChild(canvasWrapper)
	Object.assign(this.scenes, {canvas: document.querySelector(`#${canvasID}`)})
	Object.assign(this.scenes, {context: document.querySelector(`#${canvasID}`).getContext('2d')})
	Object.assign(this.scenes, {section: document.querySelector(`#${this.id}`)})
}

Section.prototype.setCanvasImages = function() {
	for (let i = 0; i < this.videoImageCount; i++) {
		const imgElem = new Image();
		imgElem.src = `${this.imagePath}${this.firstImageSequence + i}.${this.extension}`;
		this.videoImages.push(imgElem);
	}
}

Section.prototype.setCanvasLayout = function() {
	const widthRatio = window.innerWidth / 1920;
	const heightRatio = window.innerHeight / 1080;
	let canvasScaleRatio;
	if (widthRatio <= heightRatio) {
		canvasScaleRatio = heightRatio;
	}
	else {
		canvasScaleRatio = widthRatio;
	}

	this.scenes.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${canvasScaleRatio})`;
}

Section.prototype.play = function() {
	if (scrollRatioAtCurrentScene <= 0.41) { 
		scenes.messageA.style.opacity = calculateValueFromCurrentScene(cssMeta.messageA_opacity_in, currentYOffsetAtCurrentScene);
		scenes.messageA.style.transform = `translate3d(0, ${calculateValueFromCurrentScene(cssMeta.messageA_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
	} else {
		scenes.messageA.style.opacity = calculateValueFromCurrentScene(cssMeta.messageA_opacity_out, currentYOffsetAtCurrentScene);
		scenes.messageA.style.transform = `translate3d(0, ${calculateValueFromCurrentScene(cssMeta.messageA_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
	}
}

Film.prototype.setLayout = function () {
	setSectionHeight(this.sections);

	// set CurrentSceneID
	let totalScrollHeight = 0;
	for (let i = 0; i < this.sections.length; i++) {
		totalScrollHeight += this.sections[i].playLength;
		if (totalScrollHeight >= window.pageYOffset) {
			this.currentSceneID = i;
			break;
		}
	}
	document.body.setAttribute('id', `show-scene-${this.currentSceneID}`);


	setCanvasLayout(this.sections);

	function setCanvasLayout(sections) {
		for (let i = 0; i < sections.length; i++) {
			if(sections[i].type !== 'void'){
				sections[i].setCanvasLayout()
			}
		}
	}

	function setSectionHeight(sections) {
		for (let i = 0; i < sections.length; i++) {
			if (sections[i].type === 'projector' || sections[i].type === 'wide') {
				sections[i].playLength = sections[i].playLengthParam * window.innerHeight;
			}
			else if (sections[i].type === 'void') {
				sections[i].playLength = sections[i].scenes.section.offsetHeight;
			}
			sections[i].scenes.section.style.height = `${sections[i].playLength}px`;
		}
	}
}

Section.prototype.draw= function() {
	this.scenes.canvas.getContext('2d').drawImage(this.videoImages[0],0,0)
}

Section.prototype.playAnimation = function(prevAllSceneHeight) {
	if(this.type === 'void') {
		return
	}

	const scenes = this.scenes
	const currentYOffsetAtCurrentScene = window.pageYOffset - prevAllSceneHeight;
	const CurrentScenescrollHeight = this.playLength;
	const scrollRatioAtCurrentScene = currentYOffsetAtCurrentScene / CurrentScenescrollHeight;

		if(scrollRatioAtCurrentScene <= 0.05) {
			if(this.fadeIn) {
				this.scenes['section'].style.opacity = this.calculateValueFromCurrentScene([0, 1, { start: 0, end: 0.05 }], currentYOffsetAtCurrentScene)
			}
		}else {
			if(this.fadeOut) {
				this.scenes['section'].style.opacity = this.calculateValueFromCurrentScene([1, 0, { start: 0.95, end: 1 }], currentYOffsetAtCurrentScene)		
			}
		}

	for(let i=0; i<scenes.length; i++) {
			for(let j=0; j<scenes[i].animations.length; j++) {
				var animation = scenes[i].animations[j]
				if(animation.inout =='in' && animation.value[2].end+0.01 >= scrollRatioAtCurrentScene) {
					if(animation.type == 'opacity') {
						scenes[i].element.style.opacity = this.calculateValueFromCurrentScene(animation.value, currentYOffsetAtCurrentScene)
					}
				}
				else if(animation.inout =='out' && animation.value[2].start <= scrollRatioAtCurrentScene){
					if(animation.type == 'opacity') {
					scenes[i].element.style.opacity = this.calculateValueFromCurrentScene(animation.value, currentYOffsetAtCurrentScene)
					}
				}
			}
	}
}

Section.prototype.calculateValueFromCurrentScene = function(animationValue, currentYOffsetAtCurrentScene) {
	let value;
	const currentSceneScrollHeight = this.playLength;
	const currentScrollRatio = currentYOffsetAtCurrentScene / currentSceneScrollHeight; 
	if (animationValue.length === 3) {
		const startTimingHeight = animationValue[2].start * currentSceneScrollHeight;
		const endTimingHeight = animationValue[2].end * currentSceneScrollHeight;
		const animationDurationHeight = endTimingHeight - startTimingHeight;
		if (currentYOffsetAtCurrentScene >= startTimingHeight && currentYOffsetAtCurrentScene <= endTimingHeight) {
			const currentPlayingHeight  = currentYOffsetAtCurrentScene - startTimingHeight
			value = currentPlayingHeight / animationDurationHeight * (animationValue[1] - animationValue[0]) + animationValue[0];
		} else if (currentYOffsetAtCurrentScene < startTimingHeight) {
			value = animationValue[0];
		} else if (currentYOffsetAtCurrentScene > endTimingHeight) {
			value = animationValue[1];
		}
	} else {
		value = currentScrollRatio * (animationValue[1] - animationValue[0]) + animationValue[0];
	}
	return value;
}