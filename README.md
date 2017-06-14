# SimpleVideoClippingProgram
A simple video clip creation program using Angular, Bootstrap, and Express with NodeJS

# WARINING
This application is still in a pre-alpha build. It is in no way stable, so do not be surprised by issues.

## Author: Brandon Cooke

## Preface
This application was built very quick and dirty to create clips from existing video files.
It utilizes an html form that accepts data. This data is then, on form submit, put into a 
cmd command string that creates a new clip using ffmpeg, a free video encoding tool.

## Installation
- Install NodeJS for your computer https://nodejs.org/en/
- Install ffmpeg https://ffmpeg.org/download.html
    - Pay attention to your OS version on this site.
- Copy and Paste your video into the client/videos folder. 
    - The application will look in this folder for your videos to edit.
- Once you have that, perform the following steps in CMD:
    - cd into the project directory
    - run ```npm installAll```
        - this will install all dependencies
    - run command ```node server```
        - this will host the app on http://localhost:1337
    - travel to http://localhost:1337 on a firefox or chrome browser
    
## Usage
- Traveling to the app will first auto-open a Google login page. You can login to your Youtube account for automated uploads.
- After Logging in, chose the account you want the videos uploaded to.
- Travel to localhost:1337 to bring you to an html form.
- From the video dropdown, choose a video file (that you put into the client/videos folder) and select Use File.
- Follow the steps on the form to define the clip that should be created.
- When you're ready, select Generate Clip. You should see the clip data at the queue on the bottom.
- You can now Generate the clip.
- After the clip is finished, you should be prompted to upload it (using whatever account you choose previously in step 1).
- You should be informed about the upload progress where the upload button was.
    
