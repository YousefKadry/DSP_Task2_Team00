let createSlidersObj = (mode, sliderFreqValues, labels) => {
    let slidersObj = {}
        for(let i=1; i <= mode.numOfSliders; i++){
            slidersObj[`${mode.name}-slider-${i}`] ={freqToChange: sliderFreqValues[i-1]
                                                    ,freqAmp: 0, modeName: mode.name, label:labels[i-1]}
        }
        piano_freq= [16.35160						
            ,17.32391						
            ,18.35405						
            ,19.44544						
            ,20.60172						
            ,21.82676						
            ,23.12465						
            ,24.49971						
            ,25.95654
            ,27.50000						
            ,29.13524						
            ,30.86771	
            ,32.70320						
            ,34.64783	
            ,36.70810						
            ,38.89087						
            ,41.20344	
            ,43.65353						
            ,46.24930
            ,48.99943						
            ,51.91309						
            ,55.00000	
            ,58.27047						
            ,61.73541
            ,65.40639		
            ,69.29566						
            ,73.41619	
            ,77.78175
            ,82.40689
            ,87.30706	
            ,92.49861
            ,97.99886
            ,103.8262
            ,110.0000
            ,116.5409
            ,123.4708						
            ,130.8128
            ,138.5913						
            ,146.8324
            ,155.5635						
            ,164.8138						
            ,174.6141						
            ,184.9972
            ,195.9977
            ,207.6523						
            ,220.0000
            ,233.0819						
            ,246.9417
            ,261.6256
            ,277.1826						
            ,293.6648			
            ,311.1270	
            ,329.6276
            ,349.2282						
            ,369.9944						
            ,391.9954
            ,415.3047
            ,440.0000
            ,466.1638						
            ,493.8833
            ,523.2511						
            ,554.3653						
            ,587.3295						
            ,622.2540						
            ,659.2551			
            ,698.4565						
            ,739.9888						
            ,783.9909						
            ,830.6094						
            ,880.0000						
            ,932.3275						
            ,987.7666						
            ,1046.502						
            ,1108.731						
            ,1174.659						
            ,1244.508						
            ,1318.510						
            ,1396.913						
            ,1479.978						
            ,1567.982						
            ,1661.219						
            ,1760.000						
            ,1864.655						
            ,1975.533						
            ,2093.005						
            ,2217.461						
            ,2349.318						
            ,2489.016						
            ,2637.020						
            ,2793.826						
            ,2959.955						
            ,3135.963						
            ,3322.438						
            ,3520.000						
            ,3729.310						
            ,3951.066						
            ,4186.009						
            ,4434.922						
            ,4698.636						
            ,4978.032						
            ,5274.041						
            ,5587.652						
            ,5919.911						
            ,6271.927						
            ,6644.875						
            ,7040.000						
            ,7458.620						
            ,7902.133]
    return slidersObj
}


let createModesSliders = (modes)=>{
    let freqSlidersRange = [[1,500], [500, 1000], [1000, 1500], [1500, 2000]
, [2000, 2500], [2500, 3000] ,[3000, 3500] ,[3500, 4000] ,[4000, 4500] ,[4500, 5000]]

let vowelsSlidersValues = [[1,500], [500, 1000], [1000, 1500], [1500, 2000]
, [2000, 2500], [2500, 3000] ,[3000, 3500] ,[3500, 4000] ,[4000, 4500]]

let musicSlidersValues = [[1,500], [500, 1000], [1000, 1500], [1500, 2000]
, [2000, 2500], [2500, 3000] ,[3000, 3500] ,[3500, 4000]]

let medicalSlidersValues = [[1,500], [500, 1000], [1000, 1500], [1500, 2000]
, [2000, 2500], [2500, 3000] ,[3000, 3500]]

let optionSlidersValues = [[1,500], [500, 1000], [1000, 1500], [1500, 2000]
, [2000, 2500], [2500, 3000]]

let freqSlidersLabel = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10']

let vowelsSlidersLabel = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10']

let musicSlidersLabel = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10']

let medicalSlidersLabel = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10']

let optionSlidersLabel = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10']

modes.freq['slidersInfo'] = createSlidersObj(modes.freq, freqSlidersRange, freqSlidersLabel)
modes.vowels['slidersInfo'] = createSlidersObj(modes.vowels, vowelsSlidersValues, vowelsSlidersLabel)
modes.music['slidersInfo'] = createSlidersObj(modes.music, musicSlidersValues, musicSlidersLabel)
modes.medical['slidersInfo'] = createSlidersObj(modes.medical, medicalSlidersValues, medicalSlidersLabel)
modes.option['slidersInfo'] = createSlidersObj(modes.option, optionSlidersValues, optionSlidersLabel)
}
















let updateData = (sliderInfoObj, sliderValue) => {
    sliderInfoObj.freqAmp = sliderValue
    let changedFreq = sliderInfoObj.freqToChange.join(' ').toString()
    $.ajax({
        method: 'POST',
        url: `http://127.0.0.1:5000/${sliderInfoObj.modeName}`,
        dataType: 'json',
        async: false,
        data: {freqToChange: changedFreq,
            freqAmp:sliderInfoObj.freqAmp},
        success: function (res, status, xhr) {
        }
    });
}



let plotdata
let animationGraph = (signal, originalSignal, newSpectro, originalSpectro, layout) =>{
    // Plotly.newPlot(plotName, [{x:[0], y:[0]}] , layout)
    let m = Math.max.apply(Math, originalSignal.y);
    let range1 = {range:[-m, m]}
    
        layout['yaxis']= range1
    let layout1 = {...layout}
    let layout2 = {...layout}
    Plotly.newPlot('plot1', [originalSignal], layout1)
    Plotly.newPlot('plot2', [signal], layout2)
    Plotly.newPlot('plot3', [originalSpectro], spectrolayout)
    Plotly.newPlot('plot4', [newSpectro], spectrolayout)

//     let plot1 = document.getElementById('plot1')
//     let plot2 = document.getElementById('plot2')
//     let plot3 = document.getElementById('plot3')
//     // let plot4 = document.getElementById('plot4')

    


    plot1.on("plotly_relayout", function(ed) {
        Plotly.relayout('plot2', ed)
        console.log('gg')
    });

    // plot2.on("plotly_relayout", function(ed) {
    //     // Plotly.newPlot('plot1', [originalSignal], layout)
    //     Plotly.relayout('plot1', ed)
    // });   

    plot3.on("plotly_relayout", function(ed) {
        Plotly.relayout('plot4', ed)
    
        });
    
    
    let cnt =  0
    plotdata = setInterval(async() =>{
        if(cnt+.25 <=signal.x[signal.x.length-1]){
            cnt+= .065
            if(cnt>0){
                let range = {range:[cnt-.25, cnt+.25]}
                layout['xaxis']= range
                // setLayout(layout)
                setLayout(layout)
            }
        }
        else{
            cnt = 0
            clearInterval(plotdata)
        } 
    },65)

    
}
let stopPlot = (interval = plotdata)=>{
    if(interval){
    clearInterval(interval)
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

