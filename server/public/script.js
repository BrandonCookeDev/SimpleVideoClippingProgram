var myApp = angular.module('myApp', []);

myApp.controller('homeCtrl', function($scope, $http){
    var id = 0;
    var statuses = ['notCreated', 'creating', 'created', 'uploading', 'uploaded', 'failed'];

	$scope.test = 'Hello World';
	$scope.uploadTF = true;
	$scope.videoQueue = [];

	$scope.file = {
	    id: '',
		inputFile : '',
		inputFileName:'',
		inputFileDirectory:'',
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
		bracketUrl: '',
		fileSize:'',
		bytesUploaded:''
	};

	$scope.characterData = characterData; //FROM characterData.js
	
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

        file.inputFileName = $scope.file.inputFile.name;
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
					$http.get(statusUrl)
						.then(function(response){
							var complete = response.data.complete;
							if(!complete)
								video.file.bytesUploaded = response.data.bytesUploaded;
							else
								setStatus('uploaded', video);
						})
						.catch(function(err){
							if(err)console.error(err);
							setStatus('created', video);
						})
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
			console.error(err.stack);
		}
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
		var char = _.filter(characterData, {Name: character});
		return char.colors;
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

	/*
	Dropzone.options.myDropzone({
	  init: function() {
		this.on("error", function(file, message) { alert(message); });
	  }
	});	
	*/
/*
    $http.get('/cache')
        .then(function(clipsArr){
            $scope.videoQueue = clipsArr;
        })
        .catch(function(err){
            console.warn('Cache is empty');
        });
*/
});

// Add Dropzone into page for automation file drop.
//var myDropzone = Dropzone.forElement("div#my-awesome-dropzone");
//myDropzone.on("error", function(file, message) { alert(message); });

myApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}]);

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

