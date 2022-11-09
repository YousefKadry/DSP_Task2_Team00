const selectedModes = document.getElementsByClassName("mode")
const modes = {
    freq: {numOfSliders:10, name:"frequency", maxFreq:200, step:1, editRange:true},
    vowels: {numOfSliders:9, name:"vowels", maxFreq:200, step:1, editRange:true},
    musicalInstruments: {numOfSliders:8, name:"musical-instruments", maxFreq:200, step:1, editRange:true},
    medicalSignal: {numOfSliders:7, name:"medical-signal", maxFreq:200, step:1, editRange:true},
    option: {numOfSliders:6, name:"option", maxFreq:200, step:1, editRange:true}
}

let signal = {x:[], y:[], mode: "lines", type: "line", name:'newSignal'}
let originalSignal = {x:[], y:[], mode: "lines", type: "line", name:'origSignal'}
let colorScale = [
    ['0.0', 'rgb(165,0,38)'],
    ['0.111111111111', 'rgb(215,48,39)'],
    ['0.222222222222', 'rgb(244,109,67)'],
    ['0.333333333333', 'rgb(253,174,97)'],
    ['0.444444444444', 'rgb(254,224,144)'],
    ['0.555555555556', 'rgb(224,243,248)'],
    ['0.666666666667', 'rgb(171,217,233)'],
    ['0.777777777778', 'rgb(116,173,209)'],
    ['0.888888888889', 'rgb(69,117,180)'],
    ['1.0', 'rgb(49,54,149)']
    ]
let originalSpectro = {x:[], y:[],z:[], type:'heatmap', colorscale:colorScale}
let newSpectro = {x:[], y:[],z:[], type:'heatmap', colorscale:colorScale}
let layout = {
    width: 540,
    height: 350,
    margin: {l:50, r:50, b:25, t:25, pad:1},
    xaxis:{range:[0-.025,0]}
}
let spectrolayout = {
    width: 540,
    height: 350,
    margin: {l:50, r:50, b:25, t:25, pad:1},
    yaxis:{range:[0,Math.max.apply(Math, originalSpectro.y)]}
}

createModesSliders(modes)

/*################################ adding SLiders ################################*/
let slidersPanel = document.querySelector(".sliders-panel")
let currentMode = modes.freq
, slidersObj = currentMode.slidersInfo
createSlidersElemnts(slidersObj)

document.addEventListener('click', (e) => {
    if(e.target.classList.contains("mode")){
        for(i = 0; i<selectedModes.length; i++){
            selectedModes[i].classList.remove("active")
        }
        e.target.classList.add("active")
        currentMode = modes[e.target.classList[1]]
        slidersObj = currentMode.slidersInfo

        createSlidersElemnts(slidersObj)

    }
});

/*################################ Show Spectrogram ################################*/
let figModes = document.querySelectorAll(".fig-mode")
let spectroGram = document.getElementsByClassName("spctrogram")
let lineGraph = document.getElementsByClassName("linegraph")
let signalOnly = function() {
    for(i = 0; i < lineGraph.length; i++){
        lineGraph[i].style.display = "block"
    }
    for(i = 0; i < spectroGram.length; i++){
        spectroGram[i].style.display = "none"
    }
}
let spectroOnly = function() {
    for(i = 0; i < lineGraph.length; i++){
        lineGraph[i].style.display = "none"
    }
    for(i = 0; i < spectroGram.length; i++){
        spectroGram[i].style.display = "block"
    }
}
let showBoth = function() {
    for(i = 0; i < lineGraph.length; i++){
        lineGraph[i].style.display = "block"
    }
    for(i = 0; i < spectroGram.length; i++){
        spectroGram[i].style.display = "block"
    }
}


let stopingBtns = document.getElementsByClassName("stoping-btns")
let playButton = document.querySelector(".play")
let pauseButton = document.querySelector(".pause")
let stopButton = document.querySelector('.stop')
let audio = document.getElementById('audio')
document.addEventListener("click", (e) => {
    if(e.target.classList[0] == "fig-mode"){
        for(i = 0; i < figModes.length; i++){
            if(figModes[i].classList[2] == "fig-mode-active"){
                figModes[i].classList.remove("fig-mode-active")
            } 
            e.target.classList.add("fig-mode-active")
        }
        if (e.target.classList[1] == "signal-only"){
            layout.height = 350
            signalOnly()
            setLayout(layout)
        } else if (e.target.classList[1] == "spectrogram-only"){
            spectrolayout.height = 350
            spectroOnly()
            setSpectroLayout(spectrolayout)
        } else {
            layout.height = 165
            spectrolayout.height = 165
            setTimeout(() => {showBoth(); }, 10);
            setLayout(layout)
            setSpectroLayout(spectrolayout)
        }
    }

    if(e.target.classList.contains("browse")){

    }

    if(e.target.classList[1] == "play"){
        for(i=0; i<stopingBtns.length; i++){
            stopingBtns[i].classList.remove("btn-off")
            stopingBtns[i].classList.add("btn-on")
        }
        e.target.classList.add("hide-play-btn")
        // audio.src = Flask.url_for('static/assets/upload-edit',filename='edited.wav')
        getData(currentMode, signal, originalSignal, newSpectro, originalSpectro)
        plotAll(signal, originalSignal, newSpectro, originalSpectro, layout, spectrolayout) 
        play()
    }

    if(e.target.classList.contains("stop")){
        for(i=0; i<stopingBtns.length; i++){
            stopingBtns[i].classList.add("btn-off")
            stopingBtns[i].classList.remove("btn-on")
        }   
        setTimeout(() => {playButton.classList.remove("hide-play-btn"); }, 50);
        pauseButton.classList.remove("pausing")
        stopPlaying()


    }
    if(e.target.classList.contains("pause")){
        if(e.target.classList.contains("pausing") || e.target.classList.contains("btn-off")){
            e.target.classList.remove("pausing")
            e.target.classList.add("btn-on")
        } else {
            e.target.classList.add("pausing")
            e.target.classList.remove("btn-on")
        }
    } 

})

var slidersValue = document.getElementsByClassName("slider-value")  
document.addEventListener('input', (e) => {
if(e.target.classList.contains("slider")){
    for(i = 0; i <= slidersValue.length; i++){
        if(typeof(e.target) != "undefined" && typeof(slidersValue[i]) != "undefined"){
            if(slidersValue[i].classList[1] == e.target.classList[1]){
                slidersValue[i].innerHTML = e.target.value
            }
        }
    }
}
if(e.target.className == "speed-slider"){
    document.querySelector(".play-speed .slider-value").innerHTML = `x${e.target.value} `
}
})



let browseBtn = document.getElementsByClassName('browse')
// document.getElementById('submit').addEventListener('click')
browseBtn[0].addEventListener('change', ()=> {
    console.log('gg')
    var form_data = new FormData($('#upload-file')[0]);
    $.ajax({
        type: 'POST',
        url: `http://127.0.0.1:5000/${currentMode.name}/upload`,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(res) {
            console.log(res)
        },
    });
}
)
