const film = new Film()
const section = new Section({
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
    objs: {
    },
    css: {
    }
})
section.setCanvasImages()

film.addSection(section)

console.log(film)