try{
    # Get the ID and security principal of the current user account
    echo hello
    $myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
    $myWindowsPrincipal=new-object System.Security.Principal.WindowsPrincipal($myWindowsID)
     
    # Get the security principal for the Administrator role
    $adminRole=[System.Security.Principal.WindowsBuiltInRole]::Administrator
     
    # Check to see if we are currently running "as Administrator"
    if ($myWindowsPrincipal.IsInRole($adminRole))
       {
       # We are running "as Administrator" - so change the title and background color to indicate this
       $Host.UI.RawUI.WindowTitle = $myInvocation.MyCommand.Definition + "(Elevated)"
       $Host.UI.RawUI.BackgroundColor = "DarkBlue"
       clear-host
       }
    else
       {
       # We are not running "as Administrator" - so relaunch as administrator
       
       # Create a new process object that starts PowerShell
       $newProcess = new-object System.Diagnostics.ProcessStartInfo "PowerShell";
       
       # Specify the current script path and name as a parameter
       $newProcess.Arguments = $myInvocation.MyCommand.Definition;
       
       # Indicate that the process should be elevated
       $newProcess.Verb = "runas";
       
       # Start the new process
       [System.Diagnostics.Process]::Start($newProcess);
       
       # Exit from the current, unelevated, process
       exit
    }
}
catch {
    echo "Failure"
    echo $_.Exception.Message
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

################
### LOGGING ####
################

# SET THE LOG FILE
$LOG = "$(Get-Location)\CookieCutterInstall.log"

function log($msg){
    $time = Get-Date
    echo "$time :: $msg" >> $LOG
}

#####################
#### PERMISSIONS ####
#####################

# SET THE COMPUTER EXECUTION POLICY
log 'Setting Execution Policy'
$curPolicy = Get-ExecutionPolicy
if($curPolicy -ne 'RemoteSigned'){
    Set-ExecutionPolicy RemoteSigned -Force
    log 'Set Execution Policy to Remote Signed'
}
else{
    log 'Policy is already Remote Signed'
}



try{

    ## CHANGE TO C: DRIVE
    cd C:\

    ###################
    #### VARIABLES ####
    ###################

    log 'Setting Local Variables'

    $PROGRAMS_DIR = "C:\Program Files (x86)"
    $RCS_PROGRAMS_DIR = "$PROGRAMS_DIR\Recursion"
    $RCS_COOKIE_CUTTER_DIR = "$RCS_PROGRAMS_DIR\CookieCutter"

    $STARTUP_DIR = "C:\Users\$Env:USERNAME\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup"
    $STARTUP_FILE = "$STARTUP_DIR\StartCookieCutter.bat"

    $REPO_URL = "https://github.com/BrandonCookeDev/RCSCookieCutter.git"

    $rcsProgramsDirExists = Test-Path $RCS_PROGRAMS_DIR
    $cookieCutterDirExists = Test-Path $RCS_COOKIE_CUTTER_DIR


    ##############
    #### MAIN ####
    ##############

    ##INSTALL CHOCOLATEY
    $hasChoco = choco
    if($hasChoco -contains 'is not a recognized cmdlet'){
        log 'Installing Chocolatey'
        iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    }



    ##INSTALL DEPENDENCIES WITH CHOCOLATEY

    #Check for Git
    $hasGit = git
    if($hasGit -contains 'is not a recognized cmdlet'){
        log 'Installing Git'
        choco install -y git
    }

    #Check for nodejs
    $hadNode = node -v
    if($hasNode -contains 'is not a recognized cmdlet'){
        log 'Installing NodeJS'
        choco install -y nodejs
    }

    #Check for FFMPEG
    $hasFfmpeg = ffmpeg -version
    if($hasFfmpef -contains 'is not a recognized cmdlet'){
        log 'Installing FFMPEG'
        choco install -y ffmpeg
    }



    ## SET UP FILE SYSTEM
    if(! $rcsProgramsDirExists ){
        log "Creating Directory $($RCS_PROGRAMS_DIR)"
        New-Item -ItemType directory -Path $RCS_PROGRAMS_DIR
    }

    if(! $cookieCutterDirExists ){
        log "Creating Directory $($RCS_COOKIE_CUTTER_DIR)"
        New-Item -ItemType directory -Path $RCS_COOKIE_CUTTER_DIR
    }



    ## DOWNLOAD THE REPOSITORY FROM GIT
    log "Cloning the repository at $($REPO_URL) into $RCS_COOKIE_CUTTER_DIR"
    git clone $REPO_URL $RCS_COOKIE_CUTTER_DIR
    

    ## SETUP AND RUN SERVER
    log '#### STARTED SERVER FROM Install ####'
    log "Setting up and running server"
    cd $RCS_COOKIE_CUTTER_DIR
    npm run-script installAll | Out-File -Filepath $LOG -Append
    node server | Out-File -Filepath $LOG -Append
    
    log "Done."
}
catch{
    log "!!!!!!!!!!!!!!! Failure !!!!!!!!!!!!!!!"
    log $_.Exception.Message
    exit
}