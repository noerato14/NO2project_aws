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
var select = document.getElementById('Year');
var select2 = document.getElementById('Month');
var button = document.getElementById('button');
var loader = document.getElementById('spinLoader');
loader.style.display = "none";

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
	loader.style.display = "block";
}

var map = L.map('map-template').setView([-12.046374, -77.042793], 13)
var openstreet = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
openstreet.addTo(map);
var no2Map= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

var baseMaps = {
	"Map": openstreet,
};

var overlayMaps = {
	"NO2 layer": no2Map
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

const socket = io();
var isAvailable = true;
var layerGroup = L.layerGroup().addTo(map);



var DateDict = {Start: '2021-10-01', End:'2021-10-15'}
console.log("cargando primera capa")
loader.style.display = "block";
socket.emit('Mapviz', DateDict)
select.disabled = true;
select2.disabled = true;
button.disabled = true;
slider.disabled = true;
isAvailable = false;

//L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.locate({enableHighAccuracy: true});


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
        select.disabled = true;
        select2.disabled = true;
        button.disabled = true;
        slider.disabled = true;
        isAvailable = false;
	    loader.style.display = "block";
    }
});



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
        select.disabled = true;
        select2.disabled = true;
        button.disabled = true;
        slider.disabled = true;
        isAvailable = false;
	    loader.style.display = "block";
    }
});

socket.on('markerInfo', (res) => {
    if (res.success){
        lineCharData(res.timeseries);
    }
    
	select.disabled = false;
    select2.disabled = false;
    button.disabled = false;
    slider.disabled = false;
    isAvailable = true;
	loader.style.display = "none";
})


function Years() {
    var elm = document.getElementById('Year'),
    df = document.createDocumentFragment();
    var startDate = new Date("2018/7/30")
    var today = new Date();
    var loop = new Date(startDate);
    while(loop < today) {
  		var year = loop.getFullYear();        
        var optionLabel1 = year;
        var option = document.createElement('option');
        option.value = optionLabel1.toString()
        option.appendChild(document.createTextNode(optionLabel1));
        df.appendChild(option);
        let newDate = loop.setDate(loop.getDate() + 365);
        loop = new Date(newDate);
    }
    elm.appendChild(df);
}
Years();
var months = {0:"Ene",1:"Feb",2:"Mar",3:"Abr",
              4:"May",5:"Jun",6:"Jul",7:"Ago",
              8:"Sep",9:"Oct",10:"Nov",11:"Dic"}
var months2 = {0:"01",1:"02",2:"03",3:"04",
              4:"05",5:"06",6:"07",7:"08",
              8:"09",9:"10",10:"11",11:"00"}

function MonthInit() {
    var elm = document.getElementById('Month'),
    df = document.createDocumentFragment();
    for(let i = 6; i < 12; i++){
        var optionLabel1 = months[i];
        var option = document.createElement('option');
        option.value = optionLabel1.toString()
        option.appendChild(document.createTextNode(optionLabel1));
        df.appendChild(option);
        
    }
    elm.appendChild(df);
}
MonthInit();


function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }
 
function MonthSelect() {
    var elm = document.getElementById('Month'),
    df = document.createDocumentFragment();
    var elm2 = document.getElementById('Year');
    var yearSel = elm2.value
    var init_value = 0;
    var end__value = months.length;
    var date = new Date();
    var month = date.getMonth();   
    date = date.getFullYear();
    if(yearSel.toString() == "2018"){
        init_value = 6;
        end__value = 12;
    }
    else if(yearSel.toString() == date.toString()){
        init_value = 0;
        end__value = months2[month.toString()]-1;
    }
    else if(yearSel.toString != "2018" || yearSel.toString != date.toString()){
        init_value = 0;
        end__value = 12;
    }
    
    // using the function:
    removeOptions(elm);
    for(let i = init_value; i < end__value; i++){
        var optionLabel1 = months[i];
        var option = document.createElement('option');
        option.value = optionLabel1.toString()
        option.appendChild(document.createTextNode(optionLabel1));
        df.appendChild(option);
        
    }
    elm.appendChild(df);
}


function DateSel(){
    if(isAvailable){
        var nums = {"Ene":"01","Feb":"02","Mar":"03","Abr":"04",
                    "May":"05","Jun":"06","Jul":"07","Ago":"08",
                    "Sep":"09","0ct":"10","Nov":"11","Dic":"12"}

        var Year = document.getElementById('Year').value;
        var Month = document.getElementById('Month').value;
        var m = Month.toString()
        var StartDate = Year.toString() + '-' + nums[m] + '-' + "01"
        var Mdays = 0;
        if(m == "Ene" ||m == "Mar" ||m == "May" ||m == "Jul" ||m == "Ago" || m == "Oct" ||m == "Dic")
            Mdays = 31;
        else if(m == "Nov" || m == "Abr" || m == "Jun" ||m == "Sep")
            Mdays = 30;
        else if(m == "Feb")
            Mdays = 28;
        var EndDate = Year.toString() + '-' + nums[m] + '-' + Mdays.toString();
        var DateDict = {Start: StartDate, End:EndDate}
        console.log(DateDict)
        socket.emit('Mapviz', DateDict)
        select.disabled = true;
        select2.disabled = true;
        button.disabled = true;
        slider.disabled = true;
        isAvailable = false;
        loader.style.display = "block";    
    }
}

socket.on('Link', (res) => {
    select.disabled = false;
    select2.disabled = false;
    button.disabled = false;
	slider.disabled = false;
	isAvailable = true;
   
 if (res.success){
        //map.eachLayer(function (layer) {
          //map.removeLayer(layer);
        //});
	map.removeLayer(no2Map);
        //L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        var link = res.Link;
        no2Map = L.tileLayer(link.toString()).addTo(map);
        //var baseMaps = {
        //    "Map": map,
        //}
    }
	loader.style.display = "none";
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
