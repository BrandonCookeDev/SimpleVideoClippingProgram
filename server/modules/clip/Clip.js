var log			= require('winston');
const execSync 	= require('child_process').execSync;
const moment 	= require('moment');
const format	= require('util').format;

var usage = "USAGE node clip.js [input file] [start time] [end time] [output file name] \n" +
			"--start time : format = xx:xx:xx \n" + 
			"--end time : format = xx:xx:xx \n";

class Clip{
	constructor(input, startTime, endTime, output, vcodec, acodec, crf){
		this.input = input;
		this.startTime = startTime;
		this.endTime = endTime;
		this.duration =
			this.createDuration(this.startTime, this.endTime);

		/* ENCODING OPTIONS */
		this.vcodec = vcodec;
		this.acodec = acodec;
		this.crf = crf;
		this.output = output;
	}

	createDuration(start, end){
        return moment.utc(moment(end, "HH:mm:ss").diff(moment(start, "HH:mm:ss"))).format("HH:mm:ss");
	}

	createFfmpegCommand(){
		var ret = [];

		ret = 
			'ffmpeg -i %s -ss %s -t %s -vcodec %s -acodec %s -crf %s %s';

		ret = format(ret, this.input, this.startTime, this.duration, this.vcodec, this.acodec, this.crf ? this.crf : '', this.output)
			
			/*
        var s = 'ffmpeg -i ' + this.input + ' -ss ' + this.startTime + ' -t ' + this.duration + ' -acodec copy -vcodec copy %s ' + this.output;
        if(this.crf)
        	s = format(s, '-crf ' + this.crf)
        else s = format(s, '');
			*/

        log.info(ret);
        return ret;
    }
}

if(process.argv.length != 6){
	console.log(usage);
	//process.exit(1); 
}
/*
 var program = process.argv[1];
 var input = process.argv[2];
 var startTime = process.argv[3];
 var endTime = process.argv[4];
 var output = process.argv[5];
 
 createClip(input, startTime, endTime, output);
 */
 
 function createClip(input, startTime, endTime, output){
	if(!input || !startTime || !endTime || !output){
		console.log(usage);
		return;
	}
 
	 var startArr = startTime.split(':').reverse();
	 var endArr = endTime.split(':').reverse();

     var h, m, s;
     var i = 0;
     var arr = [];
     var flag = false;
     startArr.forEach(function (element) {
         var strVal = "";
         var val = 0;

         //CALCULATE
         var end = parseInt(endArr[i]);
         var start = parseInt(startArr[i]);
         if (end < start) {
             val = end + 60 - start;

             if (flag)
                 val--;
             flag = true;
         }
         else {
             val = end - start;
             if (flag) {
                 val--;
                 flag = false;
             }
         }

         //VALIDATE
         if (val < 0) val = val * -1;
         if (val > 100) throw "VideoTimeException";
         else if (val < 10) strVal = '0' + val.toString();
         else strVal = val.toString();

         arr.push(strVal);
         i++;
     });

     h = arr[2];
     m = arr[1];
     s = arr[0];

     var timeDiff = h + ':' + m + ':' + s;

     console.log('----------------------COMMAND-----------------------');
     var cmd = 'ffmpeg -i ' + input + ' -ss ' + startTime + ' -t ' + timeDiff + ' -acodec copy -vcodec copy ' + output;
     console.log(cmd);
     console.log('----------------------COMMAND-----------------------');

     execSync(cmd);
     return output;
 }
 
 function createClipWithObject(file){
 
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
	 };
	 startTime = startArr[2] + ':' + startArr[1] + ':' + startArr[0];
	 

	 console.log('----------------------COMMAND-----------------------');
	 var cmd = 'ffmpeg -i ' + file.inputFileName + ' -ss ' + startTime + ' -t ' + timeDiff + ' -acodec copy -vcodec copy ' + file.outputFileName;
	 console.log(cmd);
	 console.log('----------------------COMMAND-----------------------');
	 
	 return cmd;
 };
 
 module.exports = Clip;