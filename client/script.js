var myApp = angular.module('myApp', [
	'characterData'
]);

var URL = window.URL || window.webkitURL;

myApp.controller('homeCtrl', function($scope, $http, $window, CharacterDataSvc){
    var id = 0;
    var statuses = ['notCreated', 'creating', 'created', 'uploading', 'uploaded', 'failed'];

    $scope.CharacterDataSvc = CharacterDataSvc;
	$scope.selectVideos 	= [];
    $scope.videoURL 	 	= '';
    $scope.timestamp		= '';

	$scope.test 			= 'Hello World';
	$scope.uploadTF 		= true;
	$scope.videoQueue 		= [];


	$scope.file = {
	    id: '',
		inputFileName:'',
		ss : {
			Hour : 0,
			Minute : 0,
			Second : 0
		},
		ssString : '',
		end : {
			Hour : 0,
			Minute : 0,
			Second : 0
		},
		endString : '',
		tournamentName: '',
		round : '',
		player1 : {
	    	smashtag: '',
			character: '',
			color: ''
		},
		player2 : {
            smashtag: '',
            character: '',
            color: ''
		},
		yesAudio : true,
		noAudio : false,
		outputFileName : '',
        outputFileDirectory: '',
		bracketUrl: '',
		fileSize:'',
		bytesUploaded:'',
		percentUploaded:0
	};

	/*
	$scope.videoChanged = function(event){
		var file = event.files[0];
		var fileURL = window.URL.createObjectURL(file);
		$scope.videoURL = fileURL;
	};
	*/

	$scope.characterData = $scope.CharacterDataSvc.data; //FROM characterData.js
	
	$scope.sanitizeObjectInputs = function(){
		/*
		$scope.file.tournamentName = $scope.file.tournamentName.replace(" ", "_");
		$scope.file.round = $scope.file.round.replace(" ", "_");
		$scope.file.player1.replace(" ", "_");
		$scope.file.player2.replace(" ", "_");		
		*/
		$scope.file.ssString =
			$scope.file.ss.Hour + ':' + $scope.file.ss.Minute + ':' + $scope.file.ss.Second;
		$scope.file.endString = 
			$scope.file.end.Hour + ':' + $scope.file.end.Minute + ':' + $scope.file.end.Second;
	};

	$scope.getTimestamp = function(startTF){
		var time;
		if(startTF)
			time = $scope.file.ssString;
		else
			time = $scope.file.endString;

		time = $scope.timestamp;
		var timestampSplit = time.split(':');
		console.log(timestampSplit);
	};

    $scope.listDirectory = function(){
        var url = '/listVideoDirectory';

        $http.get(url)
			.then(function(res){
                $scope.selectVideos = res.data;
				console.log($scope.selectVideos);
			})
			.catch(function(err){
                console.error(err);
			})
    };


    $scope.getFile = function(){
    	$scope.file.inputFileName = $scope.selectedVideo.selected;
    	$scope.videoURL = 'videos/' + $scope.selectedVideo.selected;
	};

	$scope.changeOutputFilename = function(){
		$scope.sanitizeObjectInputs();
		
		var name = $scope.file.tournamentName + '-' + $scope.file.round + '-' + 
					$scope.file.player1.smashtag + '-' + $scope.file.player2.smashtag + '.mp4';
		$scope.file.outputFileName = name.replaceAll(" ", "");
		$scope.file.outputFileName = $scope.file.outputFileName.replaceAll("&", "");
		
		document.getElementById('outputFileName').innerHTML = $scope.file.outputFileName;
	};
	
	$scope.submitClipRequest = function(){
		var file = angular.copy($scope.file);
        var uploadTF = angular.copy($scope.uploadTF);

        //file.inputFileName = $scope.file.inputFile.name;
		$scope.sanitizeObjectInputs();


		//var cmdPromise	  = clip(file, cmd);
		//var uploadPromise = upload(uploadTF, file);

        file.id = id;
        id++;

		var element = {
			file: file,
			createdTF: false,
			uploadedTF: false,
			status: 'notCreated'
		};
		$scope.videoQueue.push(element);

		/*
		cmdPromise.then(function(){
			uploadPromise.then(data=>{
				console.log('upload successful')
			}).catch(err=>{
				console.err(err);
			})
		});
		*/

		//window.setTimeout($scope.$apply(), 15000);
	};
	  
	$scope.sendFile = function(file){
		$http({
			method: 'POST',
			url: '/parseFile',
			data: {
				file: file		
				}
			}
		);
	};


	$scope.clip = function(video){
		try{
			$http({
				method: 'POST',
				url: '/createClip',
				data:{
					video: video
				}
			})
			.then(
				function(data, status, headers, config){
					//SUCCESS
					// TODO
					if(data.status == 202) {
						video.file.id = data.headers('queueid');
						var checkClipStatus = setInterval(function(){
                            var statusUrl = data.headers('Location');
							$http.get(statusUrl)
                                .then(function(response){
                                    if(response.data) {
                                        setStatus('created', video);
                                        clearInterval(checkClipStatus)
                                    }
                                })
								.catch(function(err){
									console.error(err);
									setStatus('notCreated', video);
									clearInterval(checkClipStatus);
								})
						}, 10000);
                    }
                    else{
						setStatus('notCreated', video);
					}
				},
				(err, status, headers, config) => {
					//FAILURE
					setStatus('notCreated', video);

				});
			setStatus('creating', video);
		}catch(err){
			console.error(err);
			reject(err.message);
		}
	};
	
	$scope.upload = function(video){
		try {
			$http({
				method: 'POST',
				url: '/upload',
				data: {
					file: video.file
				}
			})
			.then(function (data, status, headers, config) {
				if(data.status == 202){
					var statusUrl = data.headers('Location');
					var uploadStatusLoop = setInterval(function(){
						$http.get(statusUrl)
							.then(function(response){
								var complete = response.data.complete;
								if(!complete)
									video.file.bytesUploaded = response.data.bytesUploaded;
								else {
                                 	clearInterval(uploadStatusLoop);
                                    setStatus('uploaded', video);
                                }
							})
							.catch(function(err){
								if(err)console.error(err);
                                clearInterval(uploadStatusLoop);
								setStatus('created', video);
							})
                	}, 2000);
				}
				else{
                    setStatus('created', video);
				}
			}).catch(function(err){
				if(err)
					log.error(err.stack);
				setStatus('created', video);
			});

			setStatus('uploading', video);
		}catch(err){
			setStatus('created', video);
			console.error(err.stack);
		}
	};

	$scope.killClip = function(videoToKill){
		$http({
			method: 'GET',
			url: '/killClip?id='+videoToKill.file.id,
		}).then(function(success){
			if(success){
				setStatus('notCreated', videoToKill);
			}
		}).catch(function(err){
			//TODO
		})
	};

	$scope.delete = function(videoToDelete){
		$scope.videoQueue = _.reject($scope.videoQueue, function(video){
			return video.file.id == videoToDelete.file.id;
		})
	};

	$scope.loadToForm = function(videoToLoad){
		$scope.file = videoToLoad.file;
	};

	$scope.getColors = function(character, player){
		var char = _.filter($scope.CharacterDataSvc.data, {Name: character});
		return char.Colors;
	};

	$scope.reset = function(videoToReset){
		setStatus('notCreated', videoToReset);
	};

	function setStatus(status, video){
		if(statuses.indexOf(status) < 0)
			throw new Error('Status \'' + status + '\' is not valid. \nValid Statuses: ', statuses);
		video.status = status;
	}

	function notifyFailed(attemptedCreeatedVideo){
        var filtered = _.filter($scope.videoQueue, function(video){
            return video.file.id == createdVideo.file.id;
        });
        if(!filtered.length)
            throw new Error('No element in the current video queue found');
        else if(filtered.length && filtered.length == 1){
            var newElement = filtered[0];
            newElement.createdTF = true;
            _.extend(_.findWhere($scope.videoQueue, {outputFileName: newElement.outputFileName}), newElement);
        }
        else throw new Error('More than one element found');
	}

	$scope.switchToUpload = function(video){
		setStatus('created', video);
	}

	function notifyCreated(createdVideo){
		var filtered = _.filter($scope.videoQueue, function(video){
            return video.file.id == createdVideo.file.id;
        });
		if(!filtered.length)
			throw new Error('No element in the current video queue found');
		else if(filtered.length && filtered.length == 1){
			var newElement = filtered[0];
			newElement.createdTF = true;
			_.extend(_.findWhere($scope.videoQueue, {outputFileName: newElement.outputFileName}), newElement);
		}
		else throw new Error('More than one element found');
	}

	function notifyUploaded(uploadedVideo){
        var filtered = _.filter($scope.videoQueue, function(video){
            return video.file.id == uploadedVideo.file.id;
        });
        if(!filtered.length)
            throw new Error('No element in the current video queue found');
        else if(filtered.length && filtered.length == 1){
            var newElement = filtered[0];
            newElement.uploadedTF = true;
            _.extend(_.findWhere($scope.videoQueue, {outputFileName: newElement.outputFileName}), newElement);
        }
        else throw new Error('More than one element found');
	}
});

myApp.directive("fileread", function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.videoURL = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
});

myApp.directive("videoUrl", function () {
    return {
    	restrict: 'A',
        scope: {
            videoURL: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                /*
            	var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.videoURL = loadEvent.target.result;
                    });
                };
                //reader.readAsDataURL(changeEvent.target.files[0]);
                */

                scope.$apply(function(){
                	var file = changeEvent.target.files[0];
					scope.$parent.file.inputFileName = file.name;
                    scope.$parent.videoURL = window.URL.createObjectURL(file);
				});
            });
        }
    }
});

myApp.directive('trackTime', function(){
	return {
		restrict: 'A',
		link: function(scope, el){
			el.bind("timeupdate", function(e){
				scope.$apply(function(){
                    scope.$parent.timestamp = el[0].currentTime
				});
			})
		}
	}
});

myApp.directive('lowerVolume', function(){
	return {
		restrict:'A',
		scope:{
			lowerVolume: '='
		},
		link: function(scope, el){
			el[0].volume = scope.lowerVolume;
		}
	}
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


