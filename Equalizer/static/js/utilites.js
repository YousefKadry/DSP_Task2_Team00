let createSlidersObj = (mode) => {
    let slidersObj = {}
    let slidersRange = [[1,499], [500, 999], [1000, 1499], [1500, 1999], [2000, 2499], [2500, 2999] ,[3000, 3499] 
    ,[3500, 3999] ,[4000, 4499] ,[4500, 5000]]
    if(mode.editRange)
        for(let i=1; i <= mode.numOfSliders; i++){
            slidersObj[`${mode.name}-slider-${i}`] = {freqRange: slidersRange[i-1], freqAmp: 0, modeName: mode.name}
        }
    else{
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
        for(let i=1; i <= mode.numOfSliders; i++){
            slidersObj[`${mode.name}-slider-${i}`] = {freqlist: piano_freq, freqAmp: 0, modeName: mode.name}
        }
    }    
    return slidersObj
}


let updateData = (sliderInfoObj, sliderValue) => {
    sliderInfoObj.freqAmp = sliderValue
    $.ajax({
        method: 'POST',
        url: `http://127.0.0.1:5000/${sliderInfoObj.modeName}`,
        dataType: 'json',
        async: false,
        data: {freqRange:`${sliderInfoObj.freqRange[0]} ${sliderInfoObj.freqRange[1]}`,
            freqAmp:sliderInfoObj.freqAmp},
        success: function (res, status, xhr) {
        console.log(res)
        }
    });

    
}

let i = 0
let j = 50
let getData = (x, y) =>{
    
    if(j < x.length){
        return [x.slice(i, j), y.slice(i, j)]
        // return [x[i], y[i]]
    }
    return false
}

let plotdata

let animationGraph = (newSignal, originalSignal, layout) =>{
    // let rate = x.length/x[x.length-1]
    // console.log(rate)
    // Plotly.newPlot(plotName, [{x:[0], y:[0]}] , layout)
    Plotly.newPlot('plot1', [signal], layout)
    Plotly.newPlot('plot2', [originalSignal], layout)

    
    let cnt =  0 - .05
    plotdata = setInterval(async() =>{
        if(cnt <=signal.x[signal.x.length-1]){
        //     let data = getData(signal.x, signal.y)
        //     let x1 = data[0]
        //     let y1= data[1]
        //     i+=50
        //     j+=50
            
        
        //     await Plotly.extendTraces(plotName, {x:[x1],y:[y1]}, [0])
            cnt+= .04
            if(cnt>0){
                let range = {range:[cnt-1, cnt]}
                layout['xaxis']= range
                Plotly.relayout('plot1', layout)
                Plotly.relayout('plot2', layout)
            }
        }
        else{
            i = 0
            j = 0
            cnt = 0
            console.log(i)
            clearInterval(plotdata)
        }
        
        
    },1)

    
}
let stopPlot = (interval = plotdata)=>{
    if(interval){
    clearInterval(interval)
    }
}