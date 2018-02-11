var concat = require('./Concatenator');
var path = require('path');
const exec = require('child_process').exec;

var DIR = 'D:\\workspace\\CookieCutter\\'
var v1 = path.join(DIR, 'NaClDecember-LosersEighths-What.Silver-SandcookiE.mp4');
var v2 = path.join(DIR, 'NaClDecember-LosersEighthsP2-What.Silver-SandcookiE.mp4');
var vids = [v1, v2];
var out = path.join(DIR, 'NaClDecember-LosersEighthsMERGED-What.Silver-SandcookiE.mp4');

var c = new concat(vids, out);

makeCmd(vids, out);

let cmd;
async function makeCmd(vids, output){
	try{
		cmd = await c.concatV2();
		console.log(cmd);
	} catch(e){
		console.error(e);
	}
}


/*
		exec(cmd, {}, function(e, stdout, stderr){
			if(e){
				console.error(e);
			}
			else{
				console.log('succ');
			}
		})
		*/

'ffmpeg -y -i D:\workspace\CookieCutter\NaClDecember-LosersEighths-What.Silver-SandcookiE.mp4 -i D:\workspace\CookieCutter\NaClDecember-LosersEighthsP2-What.Silver-SandcookiE.mp4 -f lavfi -i color=black:s=1920x1080 -filter_complex \
 "[0:v]format=pix_fmts=yuva420p,fade=t=out:st=10:d=1:alpha=1,setpts=PTS-STARTPTS[v0]; \
[1:v]format=pix_fmts=yuva420p,fade=t=in:st=0:d=1:alpha=1,fade=t=out:st=10:d=1:alpha=1,setpts=PTS-STARTPTS+10/TB[v1]; \ 
[2:v]trim=duration=30[over]; \
[over][v0]overlay[over1]; \
[over1][v1]overlay=format=yuv420[outv]" \ 
-vcodec libx264 -map [outv] D:\workspace\CookieCutter\NaClDecember-LosersEighthsMERGED-What.Silver-SandcookiE.mp4'

ffmpeg -y -i D:\workspace\CookieCutter\NaClDecember-LosersEighths-What.Silver-SandcookiE.mp4 -i D:\workspace\CookieCutter\NaClDecember-LosersEighthsP2-What.Silver-SandcookiE.mp4 -f lavfi -i color=black:s=1920x1080 -filter_complex  "[0:v]format=pix_fmts=yuva420p,fade=t=out:st=15:d=1:alpha=1,setpts=PTS-STARTPTS[v0]; [1:v]format=pix_fmts=yuva420p,fade=t=in:st=0:d=1:alpha=1,fade=t=out:st=15:d=1:alpha=1,setpts=PTS-STARTPTS+15/TB[v1]; [2:v]trim=duration=30[over]; [over][v0]overlay[over1]; [over1][v1]overlay=format=yuv420[outv]"  -vcodec libx264 -map [outv] D:\workspace\CookieCutter\NaClDecember-LosersEighthsMERGED2-What.Silver-SandcookiE.mp4

ffmpeg -y -i D:\workspace\CookieCutter\NaClDecember-LosersEighths-What.Silver-SandcookiE.mp4 -i D:\workspace\CookieCutter\NaClDecember-LosersEighthsP2-What.Silver-SandcookiE.mp4 -f lavfi -i color=black:s=1920x1080 -filter_complex  "[0:v]format=pix_fmts=yuva420p,fade=t=out:st=387.916016:d=1:alpha=1,setpts=PTS-STARTPTS[v0]; [1:v]format=pix_fmts=yuva420p,fade=t=in:st=0:d=1:alpha=1,fade=t=out:st=253.033984:d=1:alpha=1,setpts=PTS-STARTPTS+253.033984/TB[v1]; [2:v]trim=duration=30[over]; [over][v0]overlay[over1]; [over1][v1]overlay=format=yuv420[outv]"  -vcodec libx264 -map [outv] D:\workspace\CookieCutter\NaClDecember-LosersEighthsMERGED3-What.Silver-SandcookiE.mp4


To be fair, you have to have a very high IQ to understand Cherubi KnighT. The humour is extremely subtle, and without a solid grasp of Star Wars and Halo fandom most of the jokes will go over a typical viewer’s head. There’s also Rick’s nihilistic outlook, which is deftly woven into his characterisation- his personal philosophy draws heavily from Narodnaya Volya literature, for instance. The fans understand this stuff; they have the intellectual capacity to truly appreciate the depths of these jokes, to realise that they’re not just funny- they say something deep about LIFE. As a consequence people who dislike Rick & Morty truly ARE idiots- of course they wouldn’t appreciate, for instance, the humour in Rick’s existential catchphrase “Wubba Lubba Dub Dub,” which itself is a cryptic reference to Turgenev’s Russian epic Fathers and Sons. I’m smirking right now just imagining one of those addlepated simpletons scratching their heads in confusion as Dan Harmon’s genius wit unfolds itself on their television screens. What fools.. how I pity them. 😂