const selectedModes = document.getElementsByClassName("mode")
const modes = {
    freq: {numOfSliders:10, name:"frequency", maxFreq:10, minFreq:0, step:0.1, editRange:true},
    vowels: {numOfSliders:4, name:"vowels", maxFreq:10, minFreq:0, step:0.1, editRange:true},
    musicalInstruments: {numOfSliders:3, name:"musicalInstruments", maxFreq:10, minFreq:0, step:0.1, editRange:true},
    medicalSignal: {numOfSliders:1, name:"medicalSignal", maxFreq:10, minFreq:0, step:0.1, editRange:true},
    pitch: {numOfSliders:1, name:"pitch", maxFreq:2, minFreq:0.5, step:0.1, editRange:true}
}

let signal = {x:[], y:[], mode: "lines", type: "line", name:'newSignal'}
let originalSignal = {x:[], y:[], mode: "lines", type: "line", name:'origSignal'}
let colorScale = [
    ['0.0', '#023a21'],
    ['0.111111111111', '#035934'],
    ['0.222222222222', '#027161'],
    ['0.333333333333', '#02888e'],
    ['0.444444444444', '#01a0bb'],
    ['0.555555555556', '#00b7e8'],
    ['0.666666666667', '#048ac5'],
    ['0.777777777778', '#085da2'],
    ['0.888888888889', '#0f025b'],
    ['1.0', '#0f025b']
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
document.addEventListener("click", async(e) => {
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

 
    if(e.target.classList[1] == "play" && !e.target.classList.contains("btn-off")){
        document.querySelector(".fig-labels").style.display = "flex"
        document.querySelector(".play-bar").classList.remove("no-file-uploaded")
        for(i=0; i<stopingBtns.length; i++){
            stopingBtns[i].classList.remove("btn-off")
            stopingBtns[i].classList.add("btn-on")
        }
        e.target.classList.add("hide-play-btn")
        playBar.disabled = false   
        getData(currentMode, signal, originalSignal, newSpectro, originalSpectro)
        getAudio()
        plotAll(signal, originalSignal, newSpectro, originalSpectro, layout, spectrolayout) 
        play()
    }

    if(e.target.classList.contains("stop") && e.target.classList.contains("btn-on")){
        for(i=0; i<stopingBtns.length; i++){
            stopingBtns[i].classList.add("btn-off")
            stopingBtns[i].classList.remove("btn-on")
            currentTime.innerHTML = "-"
            endTime.innerHTML = "-"
        }
        document.querySelector(".play-bar").classList.add("no-file-uploaded")
        playBar.disabled = true   
        setTimeout(() => {playButton.classList.remove("hide-play-btn"); }, 50);
        pauseButton.classList.remove("pausing")
        stopPlaying()



    }
    if(e.target.classList.contains("pause") && e.target.classList.contains("btn-on")){
        if(e.target.classList.contains("pausing") || e.target.classList.contains("btn-off")){
            e.target.classList.remove("pausing")
            e.target.classList.add("btn-on")
        } else {
            e.target.classList.add("pausing")
            // e.target.classList.remove("btn-on")
        }

        pause()
    } 

})
let playBarClicked = false
let currentTime = document.querySelector(".start")
let endTime = document.querySelector(".end")
playBar = document.querySelector(".play-time-slider")

audio.addEventListener("timeupdate",(e)=>{
    if(!playBarClicked){
        currentTime.innerHTML = Math.floor(audio.currentTime)
        playBar.value = audio.currentTime
    }
    playBar.max = audio.duration
    if(audio.duration){
        document.querySelector(".end").innerHTML = Math.floor(audio.duration);
    }
})

playBar.addEventListener("change", (e)=>{
    audio.currentTime = playBar.value
    step = audio.currentTime
    if(!paused){
        play()
    }
    }
)
playBar.addEventListener("input", (e)=>{currentTime.innerHTML = Math.floor(playBar.value)})
playBar.addEventListener("mousedown", (e)=>{playBarClicked = true})
playBar.addEventListener("mouseup", (e)=>{playBarClicked = false})

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
browseBtn[0].addEventListener('change', ()=> {
    playBar.disabled = false
    playButton.classList.remove("btn-off")
    var file = browseBtn[0].files[0];  
    var uploadedFileName = file.name;
    document.querySelector(".uploaded-file-label").innerHTML = uploadedFileName
    var form_data = new FormData($('#upload-file')[0]);
    $.ajax({
        type: 'POST',
        url: `http://127.0.0.1:5000/${currentMode.name}/upload`,
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function(res) {
        },
    });
    stopButton.click()
    currentMode['slidersInfo'] = createSlidersObj(currentMode, sidersRanges[currentMode.name], slidersLabels[currentMode.name])
    slidersObj = currentMode['slidersInfo']
    createSlidersElemnts(slidersObj)
    

}
)



let speedSlider = document.getElementById('speedControl')
speedSlider.addEventListener('mouseup', ()=>{
    controlSpeed(speedSlider.value)
})
