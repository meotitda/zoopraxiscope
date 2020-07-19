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

javascript

``` javascript
const film = new Film()

const section1 = new Section({
    id : 'forward', // section id
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
            element : document.getElementById('iu'), // scene element
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

html

```html
	<link rel="stylesheet" href="https://zoopraxiscope.vercel.app/lib/css/core.css">
<body>
    <!-- wrap zoopraxiscope class div  -->
	<div class="zoopraxiscope"> 
        <!-- wrap zoopraxiscope-section class section  -->
		<section class="zoopraxiscope-section" id="forward">
            <h1>zoopraxiscope</h1>
            <!-- if you want to add scene wrap zoopraxiscope-sticky -->
			<div class="zoopraxiscope-sticky" id="iu">
				<p>IU</p>
			</div>
			<div class="zoopraxiscope-sticky" id="story">
				<p>myoldstory</p>
			</div>
		</section>
		<section class="zoopraxiscope-section" id="backward">
            <h1>epocsixarpooz</h1>
			<div class="zoopraxiscope-sticky" id="ui">
				<p>UI</p>
			</div>
		</section>
	</div>
<body>
<script src="https://zoopraxiscope.vercel.app/lib/js/core.js">
```