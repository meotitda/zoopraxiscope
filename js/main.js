(() => {

	let prevAllSceneHeight = 0; 
	let currentSceneID = 0;
	let enterNewScene = false; 
	let acc = 0.2;
	let delayedYOffset = 0;
	let rafID;
	let rafState;

	const filmInfo = [
		{
			// 0
			type: 'sticky',
			playLengthParam: 10, 
			playLength: 0, 
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			cssMeta: {
				videoImageCount: 300,
				imageSequencesStartEnd: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }], // 처음 값 , 마지막 값, 시작 시간, 종료 시간
				messageA_opacity_in: [0, 1, { start: 0.2, end: 0.4 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.2, end: 0.4 }],
				messageB_translateY_in: [20, 0, { start: 0.6, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageB_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageB_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
			}
		},
		{
			type: 'normal',
			playLength: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			type: 'sticky',
			playLengthParam: 10,
			playLength: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
				canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: []
			},
			cssMeta: {
				videoImageCount: 600,
				imageSequencesStartEnd: [0, 599],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
				messageC_translateY_in: [30, 0, { start: 0.82, end: 0.87 }],
				messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				messageC_opacity_in: [0, 1, { start: 0.82, end: 0.87 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
				messageC_translateY_out: [0, -20, { start: 0.90, end: 0.95 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
				messageC_opacity_out: [1, 0, { start: 0.90, end: 0.95 }],
				pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
				pinC_scaleY: [0.5, 1, { start: 0.82, end: 0.87 }]
			}
		},
		{
			type: 'wide',
			playLengthParam: 10,
			playLength: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/iu-black.jpg',
					'./images/iu-color.jpg'
				],
				images: []
			},
			cssMeta: {
				rectangleLeft: [ 0, 0, { start: 0, end: 0 } ], 
				rectangleRight: [ 0, 0, { start: 0, end: 0 } ], 
				blendHeight: [ 0.0, 0, { start: 0, end: 0 } ],
				canvas_scale: [ 0, 0, { start: 0, end: 0 } ],
				canvasCaption_opacity: [ 0, 1, { start: 0, end: 0 } ],
				canvasCaption_translateY: [ 20, 0, { start: 0, end: 0 } ],
				rectangleY: 0
			}
		}
	];

	function setCanvasImages() {
		let imgElem;
		for (let i = 0; i < filmInfo[0].cssMeta.videoImageCount; i++) {
			imgElem = new Image();
			imgElem.src = `./video/videoplayback_${1000 + i}.jpg`;
			filmInfo[0].objs.videoImages.push(imgElem);
		}

		let imgElem2;
		for (let i = 0; i < filmInfo[2].cssMeta.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/videoplayback_${1300 + i}.jpg`;
			filmInfo[2].objs.videoImages.push(imgElem2);
		}

		let imgElem3;
		for (let i = 0; i < filmInfo[3].objs.imagesPath.length; i++) {
			imgElem3 = new Image();
			imgElem3.src = filmInfo[3].objs.imagesPath[i];
			filmInfo[3].objs.images.push(imgElem3);
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

	function calculateCssValueFromCurrentScene(cssMeta, currentYOffsetAtCurrentScene) {
		let cssValue;
		const currentSceneScrollHeight = filmInfo[currentSceneID].playLength;
		const currentScrollRatio = currentYOffsetAtCurrentScene / currentSceneScrollHeight; 

		if (cssMeta.length === 3) {
			const startTimingHeight = cssMeta[2].start * currentSceneScrollHeight;
			const endTimingHeight = cssMeta[2].end * currentSceneScrollHeight;
			const animationDurationHeight = endTimingHeight - startTimingHeight;
			if (currentYOffsetAtCurrentScene >= startTimingHeight && currentYOffsetAtCurrentScene <= endTimingHeight) {
				const currentPlayingHeight  = currentYOffsetAtCurrentScene - startTimingHeight
				cssValue = currentPlayingHeight / animationDurationHeight * (cssMeta[1] - cssMeta[0]) + cssMeta[0];
			} else if (currentYOffsetAtCurrentScene < startTimingHeight) {
				cssValue = cssMeta[0];
			} else if (currentYOffsetAtCurrentScene > endTimingHeight) {
				cssValue = cssMeta[1];
			}
		} else {
			cssValue = currentScrollRatio * (cssMeta[1] - cssMeta[0]) + cssMeta[0];
		}

		return cssValue;
	}

	function playAnimation() {
		const objs = filmInfo[currentSceneID].objs;
		const cssMeta = filmInfo[currentSceneID].cssMeta;
		const currentYOffsetAtCurrentScene = window.pageYOffset - prevAllSceneHeight;
		const CurrentScenescrollHeight = filmInfo[currentSceneID].playLength;
		const scrollRatioAtCurrentScene = currentYOffsetAtCurrentScene / CurrentScenescrollHeight;

		switch (currentSceneID) {
			case 0:
				objs.canvas.style.opacity = calculateCssValueFromCurrentScene(cssMeta.canvas_opacity, currentYOffsetAtCurrentScene);
				if (scrollRatioAtCurrentScene <= 0.41) { 
					objs.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_in, currentYOffsetAtCurrentScene);
					objs.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
				} else {
					objs.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_out, currentYOffsetAtCurrentScene);
					objs.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
				}

				if (scrollRatioAtCurrentScene <= 0.88) {
					objs.messageB.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageB_opacity_in, currentYOffsetAtCurrentScene);
					objs.messageB.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageB_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
				} else {
					objs.messageB.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageB_opacity_out, currentYOffsetAtCurrentScene);
					objs.messageB.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageB_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
				}

				break;

			case 2:
				if (scrollRatioAtCurrentScene <= 0.5) {
					objs.canvas.style.opacity = calculateCssValueFromCurrentScene(cssMeta.canvas_opacity_in, currentYOffsetAtCurrentScene);
				} else {
					objs.canvas.style.opacity = calculateCssValueFromCurrentScene(cssMeta.canvas_opacity_out, currentYOffsetAtCurrentScene);
				}

				if (scrollRatioAtCurrentScene <= 0.32) {
					objs.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_in, currentYOffsetAtCurrentScene);
					objs.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
				} else {
					objs.messageA.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageA_opacity_out, currentYOffsetAtCurrentScene);
					objs.messageA.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageA_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
				}

				if (scrollRatioAtCurrentScene <= 0.67) {
					objs.messageB.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageB_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
					objs.messageB.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageB_opacity_in, currentYOffsetAtCurrentScene);
					objs.pinB.style.transform = `scaleY(${calculateCssValueFromCurrentScene(cssMeta.pinB_scaleY, currentYOffsetAtCurrentScene)})`;
				} else {
					objs.messageB.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageB_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
					objs.messageB.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageB_opacity_out, currentYOffsetAtCurrentScene);
					objs.pinB.style.transform = `scaleY(${calculateCssValueFromCurrentScene(cssMeta.pinB_scaleY, currentYOffsetAtCurrentScene)})`;
				}

				if (scrollRatioAtCurrentScene <= 0.83) {
					objs.messageC.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageC_translateY_in, currentYOffsetAtCurrentScene)}%, 0)`;
					objs.messageC.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageC_opacity_in, currentYOffsetAtCurrentScene);
					objs.pinC.style.transform = `scaleY(${calculateCssValueFromCurrentScene(cssMeta.pinC_scaleY, currentYOffsetAtCurrentScene)})`;
				} else {
					objs.messageC.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.messageC_translateY_out, currentYOffsetAtCurrentScene)}%, 0)`;
					objs.messageC.style.opacity = calculateCssValueFromCurrentScene(cssMeta.messageC_opacity_out, currentYOffsetAtCurrentScene);
				}

				// currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
				if (scrollRatioAtCurrentScene > 0.9) {
					const objs = filmInfo[3].objs;
					const cssMeta = filmInfo[3].cssMeta;
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

					if (widthRatio <= heightRatio) {
						// 캔버스보다 브라우저 창이 홀쭉한 경우
						canvasScaleRatio = heightRatio;
					} else {
						// 캔버스보다 브라우저 창이 납작한 경우
						canvasScaleRatio = widthRatio;
					}

					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = 'white';
					objs.context.drawImage(objs.images[0], 0, 0);

					// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					cssMeta.rectangleLeft[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
					cssMeta.rectangleLeft[1] = cssMeta.rectangleLeft[0] - whiteRectWidth;
					cssMeta.rectangleRight[0] = cssMeta.rectangleLeft[0] + recalculatedInnerWidth - whiteRectWidth;
					cssMeta.rectangleRight[1] = cssMeta.rectangleRight[0] + whiteRectWidth;
					// 좌우 흰색 박스 그리기
					objs.context.fillRect(
						parseInt(cssMeta.rectangleLeft[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);
					objs.context.fillRect(
						parseInt(cssMeta.rectangleRight[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
					);
				}

				break;

			case 3:
				// console.log('3 play');
				let step = 0;
				// 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio;

				if (widthRatio <= heightRatio) {
					// 캔버스보다 브라우저 창이 홀쭉한 경우
					canvasScaleRatio = heightRatio;
				} else {
					// 캔버스보다 브라우저 창이 납작한 경우
					canvasScaleRatio = widthRatio;
				}

				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = 'white';
				objs.context.drawImage(objs.images[0], 0, 0);

				// 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
				const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

				if (!cssMeta.rectangleY) {
					// cssMeta.rectangleY = objs.canvas.getBoundingClientRect().top;
					cssMeta.rectangleY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
					cssMeta.rectangleLeft[2].start = (window.innerHeight / 2) / CurrentScenescrollHeight;
					cssMeta.rectangleRight[2].start = (window.innerHeight / 2) / CurrentScenescrollHeight;
					cssMeta.rectangleLeft[2].end = cssMeta.rectangleY / CurrentScenescrollHeight;
					cssMeta.rectangleRight[2].end = cssMeta.rectangleY / CurrentScenescrollHeight;
				}

				const whiteRectWidth = recalculatedInnerWidth * 0.15;
				cssMeta.rectangleLeft[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				cssMeta.rectangleLeft[1] = cssMeta.rectangleLeft[0] - whiteRectWidth;
				cssMeta.rectangleRight[0] = cssMeta.rectangleLeft[0] + recalculatedInnerWidth - whiteRectWidth;
				cssMeta.rectangleRight[1] = cssMeta.rectangleRight[0] + whiteRectWidth;

				// 좌우 흰색 박스 그리기
				objs.context.fillRect(
					parseInt(calculateCssValueFromCurrentScene(cssMeta.rectangleLeft, currentYOffsetAtCurrentScene)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
				objs.context.fillRect(
					parseInt(calculateCssValueFromCurrentScene(cssMeta.rectangleRight, currentYOffsetAtCurrentScene)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);

				if (scrollRatioAtCurrentScene < cssMeta.rectangleLeft[2].end) {
					step = 1;
					objs.canvas.classList.remove('sticky');
				} else {
					step = 2;
					// cssMeta.blendHeight: [ 0, 0, { start: 0, end: 0 } ]
					cssMeta.blendHeight[0] = 0;
					cssMeta.blendHeight[1] = objs.canvas.height;
					cssMeta.blendHeight[2].start = cssMeta.rectangleLeft[2].end;
					cssMeta.blendHeight[2].end = cssMeta.blendHeight[2].start + 0.2;
					const blendHeight = calculateCssValueFromCurrentScene(cssMeta.blendHeight, currentYOffsetAtCurrentScene);

					objs.context.drawImage(objs.images[1],
						0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
						0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
					);

					objs.canvas.classList.add('sticky');
					objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

					if (scrollRatioAtCurrentScene > cssMeta.blendHeight[2].end) {
						cssMeta.canvas_scale[0] = canvasScaleRatio;
						cssMeta.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
						cssMeta.canvas_scale[2].start = cssMeta.blendHeight[2].end;
						cssMeta.canvas_scale[2].end = cssMeta.canvas_scale[2].start + 0.2;

						objs.canvas.style.transform = `scale(${calculateCssValueFromCurrentScene(cssMeta.canvas_scale, currentYOffsetAtCurrentScene)})`;
						objs.canvas.style.marginTop = 0;
					}

					if (scrollRatioAtCurrentScene > cssMeta.canvas_scale[2].end
						&& cssMeta.canvas_scale[2].end > 0) {

						objs.canvas.classList.remove('sticky');
						objs.canvas.style.marginTop = `${CurrentScenescrollHeight * 0.4}px`;

						cssMeta.canvasCaption_opacity[2].start = cssMeta.canvas_scale[2].end;
						cssMeta.canvasCaption_opacity[2].end = cssMeta.canvasCaption_opacity[2].start + 0.1;
						cssMeta.canvasCaption_translateY[2].start = cssMeta.canvasCaption_opacity[2].start;
						cssMeta.canvasCaption_translateY[2].end = cssMeta.canvasCaption_opacity[2].end;
						objs.canvasCaption.style.opacity = calculateCssValueFromCurrentScene(cssMeta.canvasCaption_opacity, currentYOffsetAtCurrentScene);
						objs.canvasCaption.style.transform = `translate3d(0, ${calculateCssValueFromCurrentScene(cssMeta.canvasCaption_translateY, currentYOffsetAtCurrentScene)}%, 0)`;
					}
				}

				break;
		}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevAllSceneHeight = 0;

		for (let i = 0; i < currentSceneID; i++) {
			prevAllSceneHeight += filmInfo[i].playLength;
		}

		if (delayedYOffset > prevAllSceneHeight + filmInfo[currentSceneID].playLength) {
			enterNewScene = true;
			currentSceneID++;
			document.body.setAttribute('id', `show-scene-${currentSceneID}`);
		}

		if (delayedYOffset < prevAllSceneHeight) {
			enterNewScene = true;
			if (currentSceneID === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			currentSceneID--;
			document.body.setAttribute('id', `show-scene-${currentSceneID}`);
		}

		if (enterNewScene) return;

		playAnimation();
	}

	function animationLoop() {
		delayedYOffset = delayedYOffset + (window.pageYOffset - delayedYOffset) * acc;

		if (!enterNewScene) {
			if (currentSceneID === 0 || currentSceneID === 2) {
				const currentYOffset = delayedYOffset - prevAllSceneHeight;
				const objs = filmInfo[currentSceneID].objs;
				const cssMeta = filmInfo[currentSceneID].cssMeta;
				let sequence = Math.round(calculateCssValueFromCurrentScene(cssMeta.imageSequencesStartEnd, currentYOffset));
				if (objs.videoImages[sequence]) {
					objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				}
			}
		}

        // 추가 코드
        // home이나 end를 이용해 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // home 키로 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
            filmInfo[0].objs.canvas.style.opacity = 1;
            filmInfo[0].objs.context.drawImage(filmInfo[0].objs.videoImages[0], 0, 0);
        }
        // end 키로 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
            let tempYOffset = window.pageYOffset;
            scrollTo(0, tempYOffset - 1);
        }

		rafID = requestAnimationFrame(animationLoop);

		if (Math.abs(window.pageYOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafID);
			rafState = false;
		}
	}

	window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        filmInfo[0].objs.context.drawImage(filmInfo[0].objs.videoImages[0], 0, 0);

        let tempYOffset = window.pageYOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }

        window.addEventListener('scroll', () => {
			scrollLoop();

  			if (!rafState) {
  				rafID = requestAnimationFrame(animationLoop);
  				rafState = true;
  			}
  		});

  		window.addEventListener('resize', () => {
  			if (window.innerWidth > 900) {
  				setLayout();
  				filmInfo[3].cssMeta.rectangleY = 0;
  			}

            if (currentSceneID === 3) {
                let tempYOffset = window.pageYOffset;
                let tempScrollCount = 0;
                if (tempYOffset > 0) {
                    let siId = setInterval(() => {
                        scrollTo(0, tempYOffset);
                        tempYOffset -= 50;

                        if (tempScrollCount > 20) {
                            clearInterval(siId);
                        }
                        tempScrollCount++;
                    }, 20);
                }
            }
  		});

  		window.addEventListener('orientationchange', () => {
  			setTimeout(setLayout, 500);
  		});

  		document.querySelector('.loading').addEventListener('transitionend', (e) => {
  			document.body.removeChild(e.currentTarget);
		  });
		  
		  const audio = new Audio('mp3/iu.mp3')
		  document.querySelector('body').addEventListener('click', () => {
			  if(!audio.paused) {
				  audio.pause()
				  return
			  }
			audio.play()
		  })


	});

	setCanvasImages();

})();
