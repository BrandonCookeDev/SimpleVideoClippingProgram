REM Batch file to fade in and out two videos together with ffmpeg
REM %1 resolution [1280x720, 1920x1080, etc]
REM %2 fade duration
REM %3 output file name
REM %4 video 1 path
REM %5 video 1 duration
REM %6 video 2 path
REM %7 video 2 duration


ffmpeg -i %4 -i %6 ^
-filter_complex ^
"color=black:%1:d=%5+%7-%2[base]; ^
 [0:v]setpts=PTS-STARTPTS[v0]; ^
 [1:v]format=yuva420p,fade=in:st=0:d=%2:alpha=1, ^
      setpts=PTS-STARTPTS+((%5-%2)/TB)[v1]; ^
 [base][v0]overlay[tmp]; ^
 [tmp][v1]overlay,format=yuv420p[fv]; ^
 [0:a][1:a]acrossfade=d=%2[fa]" ^
-map [fv] -map [fa] ^
%3