'use strict';

let fs   = require('fs');
let path = require('path');
let uuid = require('uuid/v4');

class Concatenator{

	constructor(videoArray, outputName){
		this.videoArray = videoArray;
		this.outputName = outputName;
		this.filepath 	= path.join(__dirname, 'concat' + uuid() + '.txt');
		this.verifyVideoFiles();
	}

	verifyVideoFiles(){
		try{
			this.videoArray.forEach(file => {
				let p = path.resolve(file);

				if(!fs.existsSync(p)){
					console.error("%s does not exist", p);
				}
			})
		}catch(err){
			console.error(err);
		}
	}

	createFile(){
		try{
			if(fs.existsSync(this.filepath)){
				fs.unlinkSync(this.filepath);
			}

			let content = '';

			this.videoArray.forEach(file => {
				content += 'file ' + file + '\n';
			})

			fs.writeFileSync(this.filepath, content);
		} catch(err){
			console.error(err);
		}
	}

	deleteFile(){
		try{
			if(fs.existsSync(this.filepath)){
				fs.unlinkSync(this.filepath);
			}
		} catch(err){
			console.error(err);
		}
	}

	concatV2(){
		try{
			let cmd = 'ffmpeg -y'

			this.videoArray.forEach(file => {
				cmd += ' -i ' + file;
			})

			cmd += " -f lavfi -i color=black:s=1920x1080 -filter_complex \\ \n \""

			for(var i in this.videoArray){
				let file = this.videoArray[i];

				if(i == 0){
					cmd += '['+i+':v]format=pix_fmts=yuva420p,fade=t=out:st=10:d=1:alpha=1,setpts=PTS-STARTPTS[v0]; \\ \n';
				}else{
					cmd += '['+i+':v]format=pix_fmts=yuva420p,fade=t=in:st=0:d=1:alpha=1,fade=t=out:st=10:d=1:alpha=1,setpts=PTS-STARTPTS+10/TB[v'+i+']; \\ \n';
				}
			}

			cmd += '['+this.videoArray.length+':v]trim=duration=30[over]; \\ \n';

			for(var i in this.videoArray){
				let file = this.videoArray[i];

				if(i==0){
					cmd += '[over][v0]overlay[over1]; \\ \n';
				}
				else if(i == this.videoArray.length -1){
					cmd += '[over'+i+'][v'+i+']overlay=format=yuv420[outv]\" \\ \n'; 
				}else{
					let iPlus1 = parseInt(i) + 1;
					cmd += '[over'+i+'][v'+i+']overlay[over'+(iPlus1)+'] \\ \n';
				}
			}

			cmd += '-vcodec libx264 -map [outv] ' + this.outputName;

			console.log(cmd);

		} catch(err){
			console.error(err);
		}
	}

	concatV1(){
		try{
			if(!fs.existsSync(this.filepath)){
				this.createFile();
			}

			let cmd = 'ffmpeg -f concat -safe 0 -i ' + this.filepath + ' -c copy ' + this.outputName;

		}catch(err){
			console.error(err);
		}

	}
}

module.exports = Concatenator;