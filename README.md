<h1 style="text-align: center">Zoopraxiscope</h1>

Zoopraxiscope is no dependency, smooth interactive video scroll library📽✨



## Demo
---
https://zoopraxiscope.vercel.app/

## Installation
---
Include the core library in your HTML file:
```html
	<link rel="stylesheet" href="https://zoopraxiscope.vercel.app/css/main.css">
    <script src="https://zoopraxiscope.vercel.app/js/main.css">
```

## Usage
---

``` javascript
const film = new Film()

const section1 = new Section({
    id : 'forward',
    type: 'projector',
    playLengthParam: 10, 
    playLength: 0, 
    videoImageCount: 300,
    canvasWidth: 1920,
    canvasHeight : 1080,
    imageSequencesStartEnd: [0,299],
    imagePath: "./video/videoplayback_",
    firstImageSequence: 1000,
    extension : 'jpg',
    scenes: [
        {
            element : document.getElementById('iu'),
            animations: [
                {
                    type : 'opacity',
                    inout: 'in',
                    value : [0, 1, {start:0.2, end:0.4}]
                },
                {
                    type : 'opacity',
                    inout: 'out',
                    value : [1, 0, {start:0.41, end:0.62}]
                }
            ] 
        },
        {
            element : document.getElementById('story'),
            animations: [
                {
                    type : 'opacity',
                    inout: 'in',
                    value : [0, 1, {start:0.63, end:0.8}]
                },
                {
                    type : 'opacity',
                    inout: 'out',
                    value : [1, 0, {start:0.81, end:0.91}]
                }
            ] 
        },
    ]
})

section1.setCanvasImages()
section1.draw()

film.addSection(section1)
film.setLayout(section1)
film.init()
```