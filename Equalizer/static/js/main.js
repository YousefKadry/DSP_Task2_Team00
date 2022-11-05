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

        currentSlidersPanel = document.getElementsByClassName("slider col-2")
        let numOfSliders = currentSlidersPanel.length
        let slidersList = [...currentSlidersPanel]
        for(let i = 0; i < numOfSliders; i++){
            slidersList[i].remove()
        }
        currentMode = modes[e.target.classList[1]]
        slidersObj = createSlidersObj(currentMode)

        for(let i = 0; i < currentMode.numOfSliders; i++){
            let slider = document.createElement("div")
            slider.className = "slider col-2"
            let input = document.createElement("input")
            input.type = "range"
            input.min = 0
            input.max = currentMode.maxFreq
            input.step = currentMode.step
            input.id = `${currentMode.name}-slider-${i+1}`
            input.className = `slider ${currentMode.name}-slider-${i+1}`

            let value= document.createElement("div")
            value.innerHTML=50
            value.className = `slider-value ${currentMode.name}-slider-${i+1}`

            slider.appendChild(input)
            slider.appendChild(value)
            slidersPanel.appendChild(slider)
        }
        
        Object.entries(slidersObj).forEach(([sliderId, sliderObj]) => {
                let currentSlider = document.getElementById(sliderId)
                currentSlider.addEventListener('mouseup', () =>{

                    updateData(sliderObj, currentSlider.value) 
                    // console.log(sliderObj)
                })
        })
    }
});


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
            console.log(signal.x)
            console.log(signal.y)
        }
    })
    Plotly.newPlot('plot1', [originalSignal, signal])
}