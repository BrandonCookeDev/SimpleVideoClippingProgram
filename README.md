# SimpleVideoClippingProgram
A simple video clip creation program using Angular, Bootstrap, and Express with NodeJS

## Author: Brandon Cooke

## Preface
This application was built very quick and dirty to create clips from existing video files.
It utilizes an html form that accepts data. This data is then, on form submit, put into a 
cmd command string that creates a new clip using ffmpeg, a free video encoding tool.

## Installation
- Install NodeJS for your computer https://nodejs.org/en/
- Install ffmpeg https://ffmpeg.org/download.html
    - Pay attention to your OS version on this site.
- Once you have that, perform the following steps in CMD:
    - cd into the project directory
    - run ```npm install```
        - this will install the server dependencies for the project
    - cd into server/public, then run ```npm install```
        - this will install the frontend dependencies for the project
    - cd back to project root/server
    - run command ```node server```
        - this will host the app on http://localhost:1337
    - travel to http://localhost:1337 on a firefox or chrome browser
    
## Usage
- Traveling to the app will bring you to an html form.
- In the Input File textfield, put the absolute path to the video file on your computer.
- Enter the timestamps for begining and finishing of the clip you would like.
- Enter Tournament, Round, and Player data as requested in the form.
- You can hit "Generate Name" to auto-generate a filename for you based on the above info.
- Hitting submit will create an ffmpeg command and send it to cmd to be executed.
- Output files will be located in whatever directory you ran the ```node``` command from (see Installation)
    
