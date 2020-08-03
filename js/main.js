const film = new Film()

// 섹션 입히기
// sticky element가 하나라도 있으면 projector 타입
const section1 = new Section({
  id: 'forward',
  type: 'projector',
  playLengthParam: 10,
  playLength: 0,
  videoImageCount: 300,
  canvasWidth: 1920,
  canvasHeight: 1080,
  imageSequencesStartEnd: [0, 299],
  imagePath: './video/videoplayback_',
  firstImageSequence: 1000,
  extension: 'jpg',
  fadeIn: false,
  scenes: [
    {
      element: document.getElementById('iu'),
      animations: [
        {
          type: 'opacity',
          inout: 'in',
          value: [0, 1, { start: 0.2, end: 0.4 }],
        },
        {
          type: 'opacity',
          inout: 'out',
          value: [1, 0, { start: 0.41, end: 0.62 }],
        },
      ],
    },
    {
      element: document.getElementById('story'),
      animations: [
        {
          type: 'opacity',
          inout: 'in',
          value: [0, 1, { start: 0.63, end: 0.8 }],
        },
        {
          type: 'opacity',
          inout: 'out',
          value: [1, 0, { start: 0.81, end: 0.91 }],
        },
      ],
    },
  ],
})

// 이미지 추가하기
section1.setCanvasImages()

section1.draw()

// 색션 추가하기
film.addSection(section1)

const voidSection = new Section({
  id: 'middle',
  type: 'void',
  playLength: 0,
  scenes: [
    {
      element: document.getElementById('void_example'),
    },
  ],
})

// 색션 추가하기
film.addSection(voidSection)

const section2 = new Section({
  id: 'backward',
  type: 'projector',
  playLengthParam: 10,
  playLength: 0,
  videoImageCount: 300,
  canvasWidth: 1920,
  canvasHeight: 1080,
  imageSequencesStartEnd: [400, 699],

  imagePath: './video/videoplayback_',
  firstImageSequence: 1600,
  extension: 'jpg',
  scenes: [
    {
      element: document.getElementById('epoc'),
      animations: [
        {
          type: 'opacity',
          inout: 'in',
          value: [0, 1, { start: 0.2, end: 0.4 }],
        },
        {
          type: 'opacity',
          inout: 'out',
          value: [1, 0, { start: 0.41, end: 0.62 }],
        },
      ],
    },
    {
      element: document.getElementById('ui'),
      animations: [
        {
          type: 'opacity',
          inout: 'in',
          value: [0, 1, { start: 0.63, end: 0.8 }],
        },
        {
          type: 'opacity',
          inout: 'out',
          value: [1, 0, { start: 0.81, end: 0.91 }],
        },
      ],
    },
  ],
})

// 이미지 추가하기
section2.setCanvasImages()

// 색션 추가하기
film.addSection(section2)

//레이아웃 잡기
film.setLayout(section2)

// // 그리기

film.init()
