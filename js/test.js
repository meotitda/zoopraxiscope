// 전체 화면 만들기
const film = new Film()

// 섹션 입히기
const section = new Section({
    id : 1,
    name:'scroll-section-0',
    type: 'sticky',
    playLengthParam: 10, 
    playLength: 0, 
    videoImageCount: 300,
    canvasWidth: 1920,
    canvasHeight : 1080,
    imageSequencesStartEnd: {
        start : 0,
        end : 299
    },
    imagePath: "./video/videoplayback_",
    firstImageSequence: 1000,
    extension : 'jpg',
    components: {
        test : document.getElementById('test')
    },
    animation: {
        test_opacity_in: [0, 1, {start:0.2, end:0.4}]
    }
})


// 이미지 추가하기
section.setCanvasImages()

// 색션 추가하기
film.addSection(section)

//레이아웃 잡기
film.setLayout(section)

// 그리기