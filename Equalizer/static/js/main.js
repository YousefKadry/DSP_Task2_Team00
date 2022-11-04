const selectedModes = document.getElementsByClassName("mode")
const modes = {
    freq: {numOfSliders:10, name:"freq", maxFreq:100, step:1},
    vowels: {numOfSliders:9, name:"vowels", maxFreq:100, step:1},
    musicalInstruments: {numOfSliders:8, name:"musical-instruments", maxFreq:100, step:1},
    medicalSignal: {numOfSliders:7, name:"medical-signal", maxFreq:100, step:1},
    option: {numOfSliders:6, name:"option", maxFreq:100, step:1}
}
/*################################ adding SLiders ################################*/
let slidersPanel = document.querySelector(".sliders-panel")
document.addEventListener('click', (e) => {
    if(e.target.classList.contains("mode")){
        for(i = 0; i<selectedModes.length; i++){
            selectedModes[i].classList.remove("active")
        }
        e.target.classList.add("active")

        currentSlidersPanel = document.getElementsByClassName("slider col-2")
        let numOfSliders = currentSlidersPanel.length
        let slidersList = [...currentSlidersPanel]
        for(i = 0; i < numOfSliders; i++){
            slidersList[i].remove()
        }

        for(i = 0; i < modes[e.target.classList[1]].numOfSliders; i++){
            let slider = document.createElement("div")
            slider.className = "slider col-2"
            let input = document.createElement("input")
            input.type = "range"
            input.min = 0
            input.max = modes[e.target.classList[1]].maxFreq
            input.step = modes[e.target.classList[1]].step
            input.id = `${modes[e.target.classList[1]].name}-slider-${i+1}`
            input.className = `slider ${modes[e.target.classList[1]].name}-slider-${i+1}`

            let value= document.createElement("div")
            value.innerHTML=50
            value.className = `slider-value ${modes[e.target.classList[1]].name}-slider-${i+1}`

            slider.appendChild(input)
            slider.appendChild(value)
            slidersPanel.appendChild(slider)
        }
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