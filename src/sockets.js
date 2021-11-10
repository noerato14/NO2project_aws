var spawn = require('child_process').spawn;  
var bbPromise = require('bluebird');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New User connected');

        socket.on('userCoordinates', coords => { 
            getNO2Data(coords);
        })

        socket.on('Mapviz', Dates => {         
            getNO2Layer(Dates);
        })

        function getNO2Layer(arg) {
            return new bbPromise(function(resolve, reject) {
                var process = spawn('myenv/bin/python3', ["src/Mapviz.py", JSON.stringify(arg)]);
                resultString = '';
        
                process.stdout.on('data', function(data) {
                    resultString += data.toString();
                });
        
                process.stderr.on('data', function(err) {
                    reject(err.toString());
                });
        
                process.stderr.on('end', () => {
                    let resultData ={};
                    try {
                        resultData = JSON.parse(resultString);
                        resultData.success = true;
                        
                    } catch(error) {
                        console.error(error);
                        resultData.success = false;
                    }
                    socket.emit('Link', resultData);
                });
                process.on('exit', function() {
                    resolve();
                });
            });
        }

        function getNO2Data(arg) {
            console.log(arg)
            return new bbPromise(function(resolve, reject) {
                var process = spawn('myenv/bin/python3', ["src/app.py", JSON.stringify(arg)]);
                resultString = '';
        
                process.stdout.on('data', function(data) {
                    resultString += data.toString();
                });
        
                process.stderr.on('data', function(err) {
                    reject(err.toString());
                });
                process.stderr.on('end', () => {
                    let resultData ={};;
                    try {
                        resultData = JSON.parse(resultString);
                        resultData.success = true;
                        
                    } catch(error) {
                        console.error(error);
                        resultData.error = error;
                        resultData.success = false;
                    }
                    socket.emit('markerInfo', resultData);
                });
                process.on('exit', function() {
                    resolve();
                });
            });
        }
    });
}