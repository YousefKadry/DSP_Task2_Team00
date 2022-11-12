let createSlidersObj = (mode, sliderFreqValues, labels) => {
    let slidersObj = {}
        for(let i=1; i <= mode.numOfSliders; i++){
            slidersObj[`${mode.name}-slider-${i}`] ={freqToChange: sliderFreqValues[i-1]
                                                    ,freqAmp: 1.0, modeName: mode.name, label:labels[i-1]}
        }
    return slidersObj
}


let sidersRanges = {frequency:[[1, 500], [500, 1000], [1000, 1500], [1500, 2000]
    , [2000, 2500], [2500, 3000] ,[3000, 3500] ,[3500, 4000] ,[4000, 4500] ,[4500, 5000]]
    ,vowels:[[1,500], [500, 1000], [1000, 1500], [1500, 2000]
    , [2000, 2500], [2500, 3000] ,[3000, 3500] ,[3500, 4000] ,[4000, 4500]]
    ,musicalInstruments:[[1,250], [200, 400], [400, 1200]]
    ,medicalSignal:[[1,500], [500, 1000], [1000, 1500], [1500, 2000]
    , [2000, 2500], [2500, 3000] ,[3000, 3500]]
    ,option:[[1,500], [500, 1000], [1000, 1500], [1500, 2000]
    , [2000, 2500], [2500, 3000]]}

let slidersLabels = {frequency:['500Hz', '1000Hz', '1500Hz', '2000Hz', '2500Hz', '3000Hz', '3500Hz', '4000Hz', '4500Hz', '5000Hz']
    ,vowels:['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9']
    ,musicalInstruments:['drum', 'flute', 'xylaphone']
    ,medicalSignal:['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7']
    ,option:['label1', 'label2', 'label3', 'label4', 'label5', 'label6']}

let createModesSliders = (modes)=>{
modes.freq['slidersInfo'] = createSlidersObj(modes.freq, sidersRanges[modes.freq.name], slidersLabels[modes.freq.name])
modes.vowels['slidersInfo'] = createSlidersObj(modes.vowels, sidersRanges[modes.vowels.name], slidersLabels[modes.vowels.name])
modes.musicalInstruments['slidersInfo'] = createSlidersObj(modes.musicalInstruments, sidersRanges[modes.musicalInstruments.name], slidersLabels[modes.musicalInstruments.name])
modes.medicalSignal['slidersInfo'] = createSlidersObj(modes.medicalSignal, sidersRanges[modes.medicalSignal.name], slidersLabels[modes.medicalSignal.name])
modes.option['slidersInfo'] = createSlidersObj(modes.option, sidersRanges[modes.option.name], slidersLabels[modes.option.name])
}


let createSlidersElemnts = (slidersInfo)=>{
    currentSlidersPanel = document.getElementsByClassName("slider col-1")
        let numOfSliders = currentSlidersPanel.length
        let slidersList = [...currentSlidersPanel]
        for(let i = 0; i < numOfSliders; i++){
            slidersList[i].remove()
        }

    Object.entries(slidersInfo).forEach(([sliderId, sliderObj]) => {
        let slider = document.createElement("div")
        slider.className = "slider col-1"
        let input = document.createElement("input")
        input.id = sliderId
        input.type = "range"
        input.min = 0
        input.max = currentMode.maxFreq
        input.value = sliderObj.freqAmp
        input.step = currentMode.step
        input.className = `slider ${sliderId}`

        let value= document.createElement("div")      
        value.innerHTML= sliderObj.freqAmp
        value.className = `slider-value ${sliderId}`

        let sliderLabel = document.createElement("div")
        sliderLabel.innerHTML = sliderObj.label
        sliderLabel.className = "label"
        

        slider.appendChild(sliderLabel)
        slider.appendChild(input)
        slider.appendChild(value)
        slidersPanel.appendChild(slider)
    
    
        let currentSlider = document.getElementById(sliderId)
        currentSlider.addEventListener('mouseup', () =>{
            sliderObj.freqAmp = parseFloat(currentSlider.value)
            updateData(sliderObj) 
        })
            
    })

}


let updateData = (sliderInfoObj) => {
    let changedFreq = sliderInfoObj.freqToChange.join(' ').toString()
    $.ajax({
        method: 'POST',
        url: `http://127.0.0.1:5000/${sliderInfoObj.modeName}`,
        dataType: 'json',
        async: false,
        data: {freqToChange: changedFreq,
            freqAmp:sliderInfoObj.freqAmp},
        success: function (res, status, xhr) {
            console.log(res)
        }
    });
}




let plotAll = (signal, originalSignal, newSpectro, originalSpectro, layout, spectrolayout) =>{
    let maxAmp = Math.max.apply(Math, originalSignal.y);
    let yscale = {range:[-maxAmp, maxAmp]}
    layout['yaxis']= yscale   
    Plotly.newPlot('plot1', [originalSignal], layout)
    Plotly.newPlot('plot2', [signal], layout)
    Plotly.newPlot('plot3', [originalSpectro], spectrolayout)
    Plotly.newPlot('plot4', [newSpectro], spectrolayout)

    let plot1 = document.getElementById('plot1')
    let plot2 = document.getElementById('plot2')
    let plot3 = document.getElementById('plot3')
    let plot4 = document.getElementById('plot4')

    syncHover(plot1, plot2)
    syncHover(plot3, plot4)

    syncZooming(plot1, plot2)
    syncZooming(plot3, plot4)

    // plot1.on("plotly_relayout", function(ed) {
    //     Plotly.relayout('plot2', ed)
    // });

    // plot3.on("plotly_relayout", function(ed) {
    //     Plotly.relayout('plot4', ed)
    //     });
    
    
}



let plotdata
let step =  0
let speed = 0.1
let play = ()=>{
    clearInterval(plotdata)
    plotdata = setInterval(() =>{
        if(step+.25 <=signal.x[signal.x.length-1]){
            step+= speed
            if(step>0){
                range = {range:[step-.25, step+.25]}
                layout['xaxis']= range
                setLayout(layout)
            }
        }
        else{
            stopPlaying()
            stopButton.click()
            
        } 
    },100)
    audio.play()
    audio.playbackRate = speedSlider.value

}

let stopPlaying = (interval = plotdata)=>{
    if(interval){
    clearInterval(interval)
    step = 0
    let range = {range:[0-.025,0]}
                layout['xaxis']= range
                setLayout(layout)    
    }
    audio.load()
    if(paused){
        clearInterval(interval)
        paused = false
    }
}

let setLayout = (layout)=>{
    Plotly.relayout('plot1', layout)
    Plotly.relayout('plot2', layout)
}
let setSpectroLayout = (spectrolayout)=>{
    Plotly.relayout('plot3', spectrolayout)
    Plotly.relayout('plot4', spectrolayout)
}

let syncHover = (plotdev1, plotdev2)=>{
    plotdev1.on('plotly_hover', function (eventdata){
        var pointNum = eventdata.points[0].pointNumber;
        Plotly.Fx.hover(plotdev2,[
            { curveNumber:0, pointNumber:pointNum }
        ]);
        })
        .on('plotly_unhover',function(){
        Plotly.Fx.hover(plotdev2,[]);
        });
    plotdev2.on('plotly_hover', function (eventdata){
        var pointNum = eventdata.points[0].pointNumber;
        Plotly.Fx.hover(plotdev1,[
            { curveNumber:0, pointNumber:pointNum }
        ]);
        })
        .on('plotly_unhover',function(){
        Plotly.Fx.hover(plotdev1,[]);
        });
}
let getData = (currentMode, signal, originalSignal, newSpectro, originalSpectro)=>{
    $.ajax({
        method: 'POST',
        url: `http://127.0.0.1:5000/${currentMode.name}/data`,
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
            audioName = res[9]
        }

    })
    
}
let audio = document.getElementById('audio')

// let audio
let audioName
let getAudio =  ()=>{
    

        audio.src = Flask.url_for('static', {"filename":`${audioName}`})

        
        
        // $.ajax({
        //     method: 'GET',
        //     url: 'http://127.0.0.1:5000/audio',
        //     dataType: 'json',
        //     async: false,
        //     data: {},
        //     success: function (res, status, xhr) {
                
        //         }
        //     })
    // audio = new Audio(Flask.url_for('static', {"filename":'edited.wav'}))
    

}

let paused = false
let pause = ()=>{
    if(!paused){
        clearInterval(plotdata)
        audio.pause()
        paused = true
    }
    else{
        play()
        paused = false
    }

}

let controlSpeed = (speedValue)=>{
    let originalSpeed = .1
    speed = originalSpeed*speedValue
    audio.playbackRate = speedValue
}

let syncZooming = (plot1, plot2)=>{
    plot1.on("plotly_relayout", function(ed) {
        Plotly.relayout(plot2, ed)
    });
}