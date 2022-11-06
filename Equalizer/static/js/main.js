const selectedModes = document.getElementsByClassName("mode")
const modes = {
    freq: {numOfSliders:10, name:"frequancy", maxFreq:200, step:1, editRange:true},
    vowels: {numOfSliders:9, name:"vowels", maxFreq:100, step:1, editRange:true},
    musicalInstruments: {numOfSliders:8, name:"musical-instruments", maxFreq:100, step:1, editRange:true},
    medicalSignal: {numOfSliders:7, name:"medical-signal", maxFreq:100, step:1, editRange:true},
    option: {numOfSliders:6, name:"option", maxFreq:100, step:1, editRange:true}
}
/*################################ adding SLiders ################################*/
let slidersPanel = document.querySelector(".sliders-panel")
let currentMode, slidersObj
document.addEventListener('click', (e) => {
    if(e.target.classList.contains("mode")){
        for(i = 0; i<selectedModes.length; i++){
            selectedModes[i].classList.remove("active")
        }
        e.target.classList.add("active")

        currentSlidersPanel = document.getElementsByClassName("slider col-1")
        let numOfSliders = currentSlidersPanel.length
        let slidersList = [...currentSlidersPanel]
        for(let i = 0; i < numOfSliders; i++){
            slidersList[i].remove()
        }
        currentMode = modes[e.target.classList[1]]
        slidersObj = createSlidersObj(currentMode)

        for(let i = 0; i < currentMode.numOfSliders; i++){
            let slider = document.createElement("div")
            slider.className = "slider col-1"
            let input = document.createElement("input")
            input.type = "range"
            input.min = 0
            input.max = currentMode.maxFreq
            input.value = 100
            input.step = currentMode.step
            input.id = `${currentMode.name}-slider-${i+1}`
            input.className = `slider ${currentMode.name}-slider-${i+1}`

            let value= document.createElement("div")
            value.innerHTML= 100
            value.className = `slider-value ${currentMode.name}-slider-${i+1}`

            slider.appendChild(input)
            slider.appendChild(value)
            slidersPanel.appendChild(slider)
        }
        
        Object.entries(slidersObj).forEach(([sliderId, sliderObj]) => {
                let currentSlider = document.getElementById(sliderId)
                currentSlider.addEventListener('mouseup', () =>{

                    updateData(sliderObj, currentSlider.value) 
                    
                })
        })
    }
});

/*################################ Show Spectrogram ################################*/
let figMode = document.querySelector(".fig-mode")
let spectroGram = document.getElementsByClassName("spctrogram")
let showSpectro = function() {
    for(i = 0; i < spectroGram.length; i++){
        spectroGram[i].style.display = "block"
    }
}
let hideSpectro = function() {
    for(i = 0; i < spectroGram.length; i++){
        spectroGram[i].style.display = "none"
    }
}

figMode.addEventListener("click", (e) => {
    if(e.target.classList[1] != "fig-mode-active"){
        e.target.classList.add("fig-mode-active")
        e.target.innerHTML = "Hide Spectrogram"
        layout.height = 165
        setLayout(layout)
        setTimeout(() => {  showSpectro(); }, 10);

    } else {
        e.target.classList.remove("fig-mode-active")
        e.target.innerHTML = "Show Spectrogram"
        layout.height = 350
        setLayout(layout)
        hideSpectro()
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
})

let playBtn = document.getElementById('play-btn')
let signal = {x:[], y:[], mode: "lines", type: "line", name:'newSignal'}
let originalSignal = {x:[], y:[], mode: "lines", type: "line", name:'origSignal'}
let originalSpectro = {x:[], y:[],z:[], type:'heatmap', colorscale:'Jet'}
let newSpectro = {x:[], y:[],z:[], type:'heatmap', colorscale:'Jet'}
var layout = {
    width: 540,
    height: 350,
    margin: {l:50, r:50, b:25, t:25, pad:1},
    xaxis:{range:[0-.025,0]}
}


playBtn.onclick = ()=> {
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:5000/data',
        dataType: 'json',
        async: false,
        data: {},
        success: function (res, status, xhr) {
            signal.x = res[0]
            signal.y = res[1]
            originalSignal.x = res[0]
            originalSignal.y = res[2]
            newSpectro.x = res[4]
            newSpectro.y = res[3]
            newSpectro.z = res[5]
            originalSpectro.x = res[7]
            originalSpectro.y = res[6]
            originalSpectro.z = res[8]

        }

    })
    
    stopPlot()
    animationGraph(signal, originalSignal, newSpectro, originalSpectro, layout)
    // animationGraph(originalSignal, layout, 'plot2')
    // Plotly.newPlot('plot1', [originalSignal], layout)
    // Plotly.newPlot('plot2', [signal], layout)
}