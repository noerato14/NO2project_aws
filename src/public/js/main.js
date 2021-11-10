document.addEventListener("DOMContentLoaded", function(event) { 
    let seriesData = [];
    lineCharData(seriesData);
});

var currDate = new Date();
var todayDate = currDate.getFullYear()+'-'+(currDate.getMonth()+1)+'-'+currDate.getDate();
var startDate = '2021-01-01';
var endDate = todayDate;
var lat = 0;
var lng = 0;

async function getMeasurements(lat, lng) {
    const msg = {
        lat: lat,
        lng: lng,
        startDate: startDate,
        endDate: endDate
    };
    socket.emit('userCoordinates', msg);
}


var slider = document.getElementById("timeSlider");
var labelSlider = document.getElementById("labelSlider");
labelSlider.innerHTML = slider.value;

slider.oninput = function() {
    labelSlider.innerHTML = this.value;
    if (slider.value == currDate.getFullYear()){
        startDate = '2021-01-01';
        endDate = todayDate;
    } else if (slider.value == '2018') {
        startDate = '2018-07-30';
        endDate = '2018-12-31';
    }  else {
        startDate = this.value + '-01-01';
        endDate = this.value + '-12-31';
    }
    getMeasurements(lat, lng)
}


var map = L.map('map-template').setView([-12.046374, -77.042793], 13)
const socket = io();
var isAvailable = true;
var layerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({enableHighAccuracy: true});

/*
map.on('locationfound', e => {
    if (isAvailable) {

        layerGroup.clearLayers();
        map.closePopup();
        const coords = [e.latlng.lat, e.latlng.lng]
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        const marker = L.marker(coords).addTo(map);
        marker.addTo(layerGroup);
        marker.bindPopup('Tu ubicación actual');
        map.addLayer(marker);
        getMeasurements(e.latlng.lat, e.latlng.lng);
        isAvailable = false;
        slider.disabled = true;
    }
});*/



map.on('click', function(e) {
    if (isAvailable) {
        layerGroup.clearLayers();
        map.closePopup();
        const coords = [e.latlng.lat, e.latlng.lng]
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        const marker = L.marker(coords).addTo(map);
        marker.addTo(layerGroup);
        getMeasurements(e.latlng.lat, e.latlng.lng);
        isAvailable = false;
        slider.disabled = true;
    }
});

socket.on('markerInfo', (res) => {
    console.log(res)
    if (res.success){
        lineCharData(res.timeseries);
    }
    
    isAvailable = true;
    slider.disabled = false;
})


function options() {
    var elm = document.getElementById('DateSelect'),
    df = document.createDocumentFragment();
    var startDate = new Date("2018/7/30")
    var today = new Date();
    var loop = new Date(startDate);
    var i = 0
    while(loop < today) {
    	
  		var day1 = loop.getDate();
        if(day1 < 10){day1 = '0' + day1}
        var month1 = loop.getMonth();
        if(month1 < 10){month1 = '0' + month1}
        if(month1.toString() == '00'){month1 = '12'} 
        var year1 = loop.getFullYear();
    

        let newDate = loop.setDate(loop.getDate() + 14);
        loop = new Date(newDate);
        var newDate1 = new Date(newDate);
        var day2 = newDate1.getDate();
        if(day2 < 10){day2 = '0' + day2}
        var month2 = newDate1.getMonth();
        if(month2 < 10){month2 = '0' + month2}
        if(month2.toString() == '00'){month2 = '12'} 
        var year2 = newDate1.getFullYear();
        
        var optionLabel1 = year1 + '-'+month1+'-'+day1;
        var optionLabel2 = year2 + '-'+month2+'-'+day2;
        var option = document.createElement('option');
        option.value = optionLabel1.toString()
        option.appendChild(document.createTextNode(optionLabel1+' - '+optionLabel2));
        df.appendChild(option);
        
    }
    elm.appendChild(df);
}

options();

function UpdtMap(){
    var select = document.getElementById('DateSelect');
    var option = select.options[select.selectedIndex];
    var StartDate = option.value
    var date = new Date(StartDate)
    var EndDate = date.setDate(date.getDate() + 14);
    var EndDate = new Date(EndDate);
    var day2 = EndDate.getDate();
    if(day2 < 10){day2 = '0' + day2}
    var month2 = EndDate.getMonth()+1;
    if(month2 < 10){month2 = '0' + month2}
    var year2 = EndDate.getFullYear();   
    var EndDate = year2 + '-'+month2+'-'+day2;
    var DateDict = {Start: StartDate, End:EndDate}
    console.log(DateDict)
    socket.emit('Mapviz', DateDict)
}

socket.on('Link', (res) => {
    if (res.success){
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        console.log(res.Link)
        var link = res.Link;
        var no2Map = L.tileLayer(link.toString()).addTo(map);
        var baseMaps = {
            "Map": map,
        };
        var overlayMaps = {
            "NO2 layer": no2Map
        };
        L.control.layers(baseMaps, overlayMaps).addTo(map);
    }
});


var lineCharData = async ( seriesData) => {
    Highcharts.chart('container', {
        title: {
            text: 'Nivel de Dióxido de Nitrogeno (NO2)'
        },
    
        subtitle: {
            text: 'Source: Google Earth Engine'
        },
    
        yAxis: {
            title: {
                text: 'Niveles de Concentración de NO2 en mol/m^2'
            },
            min: 0,     
            max: 0.0004
        },
    
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%e}'
            },
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
    
        series: [{
            name: 'NO2',
            data: seriesData
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    });
}
/* 
socket.on('newUserCoordinates', (coords) => {
    console.log('New user is connected');
    const marker = L.marker([coords.lat + 0.001, coords.lng+ 0.001]);
    marker.bindPopup('Hello there!');
    map.addLayer(marker);
})
*/