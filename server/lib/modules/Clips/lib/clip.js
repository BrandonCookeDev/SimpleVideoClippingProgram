const log      = require('winston');
const ffmpeg   = require('ffmpeg');
const moment   = require('moment');
const execSync = require('child_process').execSync;
const EventEmitter = require('events');

var usage = "USAGE node clip.js [input file] [start time] [end time] [output file name] \n" +
    "--start time : format = xx:xx:xx \n" +
    "--end time : format = xx:xx:xx \n";

class Clip extends EventEmitter{
	constructor(input, startTime, endTime, output){
		this.input = input;
		this.startTime = startTime;
		this.endTime = endTime;
		this.output = output;
		this.duration = endTime - startTime;
		console.log('ljfdslkghs')
	}

	generate(){
	    var thisClip = this;
	    return new Promise(function(resolve, reject){
            var process = new ffmpeg(this.input)
                .then(function(video){
                    video.setVideoFormat('mp4')
                    .setStartTime(thisClip.startTime)
                    .setDuration(thisClip.duration)
                    .save(thisClip.output, function(err, file){
                        if(err){
                            log.error(err.stack);
                            reject(err.message);
                        }
                        else {
                            log.info('Successfully created clip ' + thisClip.output);
                            resolve(thisClip.output);
                        }

                    })
                })
                .catch(function(err){
                    log.error(err.stack);
                    reject(err.message);
                })

        })

    }


    /**
	 * This method takes the properties of the current clip object
	 * and uses them to construct a plaintext command for ffmpeg
	 * to be executed in the command line.
     */
	createClipV1(){
        if(!this.input || !this.startTime || !this.endTime || !this.output){
            console.log(usage);
            return;
        }

        var startArr = this.startTime.split(':').reverse();
        var endArr = this.endTime.split(':').reverse();

        var h, m, s;
        var i = 0;
        var arr = [];
        var flag = false;
        startArr.forEach(function(element){
            var strVal = "";
            var val = 0;

            //CALCULATE
            var end = parseInt(endArr[i]);
            var start = parseInt(startArr[i]);
            if(end < start){
                val = end + 60 - start;

                if(flag)
                    val--;
                flag = true;
            }
            else{
                val = end - start;
                if(flag){
                    val--;
                    flag = false;
                }
            }

            //VALIDATE
            if(val < 0) val = val * -1;
            if(val > 100) throw "VideoTimeException";
            else if(val < 10) strVal = '0' + val.toString();
            else strVal = val.toString();

            arr.push(strVal);
            i++;
        });

        h = arr[2];
        m = arr[1];
        s = arr[0];

        var timeDiff = h + ':' + m + ':' + s;

        console.log('----------------------COMMAND-----------------------');
        var cmd = 'ffmpeg -i ' + this.input + ' -ss ' + this.startTime + ' -t ' + timeDiff + ' -acodec copy -vcodec copy ' + this.output;
        console.log(cmd);
        console.log('----------------------COMMAND-----------------------');

        execSync(cmd);
    }

    /**
	 * This method takes a custom clip object and
	 * uses its properties to create a clip.
	 *
     * @param file
     * @returns {string}
     */
	static createClipWithObjectV1(file){

        var startArr = file.ssString.split(':').reverse();
        var endArr = file.endString.split(':').reverse();

        var h, m, s;
        var i = 0;
        var arr = [];
        var flag = false;

        startArr.forEach(function(element){
            var strVal = "";
            var val = 0;

            //CALCULATE
            var end = parseInt(endArr[i]);
            var start = parseInt(startArr[i]);
            if(end < start){
                val = end + 60 - start;

                if(flag)
                    val--;
                flag = true;
            }
            else{
                val = end - start;
                if(flag){
                    val--;
                    flag = false;
                }
            }

            //VALIDATE
            if(val < 0) val = val * -1;
            if(val > 100) throw "VideoTimeException";
            else if(val < 10) strVal = '0' + val.toString();
            else strVal = val.toString();

            arr.push(strVal);
            i++;
        });

        h = arr[2];
        m = arr[1];
        s = arr[0];

        var timeDiff = h + ':' + m + ':' + s;

        var startTime = '';
        for(var i = 0; i < startArr.length; i++){
            var val = startArr[i];
            var strVal = val.toString();
            if(val < 10) strVal = '0' + val.toString();
            startArr[i] = strVal;
        }
        startTime = startArr[2] + ':' + startArr[1] + ':' + startArr[0];


        console.log('----------------------COMMAND-----------------------');
        var cmd = 'ffmpeg -i ' + file.inputFile + ' -ss ' + startTime + ' -t ' + timeDiff + ' -acodec copy -vcodec copy ' + file.outputFileName;
        console.log(cmd);
        console.log('----------------------COMMAND-----------------------');

        return cmd;
    }

}

module.exports = Clip;