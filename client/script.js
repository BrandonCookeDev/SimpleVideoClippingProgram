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
		end: {
	    	timeStr: '',
            time: {
                Hour: 0,
                Minute: 0,
                Second: 0
            }
        },
		start: {
            timeStr: '',
            time: {
                Hour: 0,
                Minute: 0,
                Second: 0
            },
        },
		tournamentName: '',
		round : '',
		player1 : {
			sponsor: '',
	    	smashtag: '',
			character: '',
			color: ''
		},
		player2 : {
			sponsor: '',
            smashtag: '',
            character: '',
            color: ''
		},
		crf: '',
		vcodec: '',
		acodec: '',
		outputFileName : '',
        outputFileDirectory: '',
		videoDescription: '',
		bracketUrl: '',
		fileSize:'',
		bytesUploaded:'',
		percentUploaded:0
	};

    $scope.setDefaultDescription = function(){ $scope.file.videoDescription =
		$scope.file.tournamentName + '! Brackets and event info at ' + $scope.file.bracketUrl + '. \n \
			Watch live and follow us at: \n \
			http://twitch.tv/RecursionGG \n \
			http://twitter.com/RecursionGG \n \
			http://facebook.com/RecursionGG'; };

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
		$scope.file.start.timeStr =
			$scope.file.start.time.Hour + ':' + $scope.file.start.time.Minute + ':' + $scope.file.start.time.Second;
		$scope.file.end.timeStr =
			$scope.file.end.time.Hour + ':' + $scope.file.end.time.Minute + ':' + $scope.file.end.time.Second;
	};

	$scope.getTimestamp = function(timeObj){
		var timestamp = angular.copy($scope.timestamp);

		timeObj.timeStr = timestamp;
		var split = timestamp.split(':');

		timeObj.time.Hour = parseInt(split[0]);
        timeObj.time.Minute = parseInt(split[1]);
        timeObj.time.Second = Math.floor(parseInt(split[2]));
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
		let before = moment(new Date(0, 0, 0, $scope.file.start.time.Hour, 
											 $scope.file.start.time.Minute,
											 $scope.file.start.time.Second));
		let after  = moment(new Date(0, 0, 0, $scope.file.end.time.Hour, 
											 $scope.file.end.time.Minute,
											 $scope.file.end.time.Second));
		if(!after.isAfter(before)){
			alert("End time cannot be before start time");
			return;
		}
			
		
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

		$http.post('/cache', {video: element})
			.then(function(res){
				console.log(res.status);
			})
			.catch(function(err){
				console.error(err);
			})

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
									console.log(response);
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
		});

		$http.post('/cache/delete', {video: videoToDelete})
			.then(function(data){
				console.log(data);
			})
			.catch(function(err){
				console.error(err);
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
	};

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
	
	$http.get('/cache')
		.then(function(res){
			$scope.videoQueue = res.data;
		})
		.catch(function(err){
			console.error(err);
		})
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
                    scope.timestamp = el[0].currentTime.toHHMMSS();
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
});

myApp.directive('exportToCsv',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	var table = e.target.nextElementSibling;
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length;j++){
	        			csvString = csvString + rowData[j].innerHTML.trim() + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1);
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'tournament.csv'
		        }).appendTo('body')
		        a[0].click()
		        a.remove();
	        });
    	}
  	}
	});
	
myApp.directive('exportToCsvDoubles',function(){
  	return {
    	restrict: 'A',
    	link: function (scope, element, attrs) {
    		var el = element[0];
	        element.bind('click', function(e){
	        	var table = e.target.nextElementSibling;
	        	var csvString = '';
	        	for(var i=0; i<table.rows.length;i++){
	        		var rowData = table.rows[i].cells;
	        		for(var j=0; j<rowData.length;j++){
						var val = rowData[j].innerHTML.trim();
	        			csvString = csvString + rowData[j].innerHTML.trim() + ",";
	        		}
	        		csvString = csvString.substring(0,csvString.length - 1);
	        		csvString = csvString + "\n";
			    }
	         	csvString = csvString.substring(0, csvString.length - 1);
	         	var a = $('<a/>', {
		            style:'display:none',
		            href:'data:application/octet-stream;base64,'+btoa(csvString),
		            download:'tournament.csv'
		        }).appendTo('body');
		        a[0].click();
		        a.remove();
	        });
    	}
  	}
});

myApp.directive('videoClipForm', function(){
    return{
        templateUrl: 'partials/clipForm.partial.html'
    }
});

myApp.directive('videoClipTable', function(){
	return{
		templateUrl: 'partials/clipTable.partial.html'
	}
});

myApp.directive('videoClipSidePanel', function(){
	return{
		templateUrl: 'partials/clipPanel.partial.html'
	}
});

$(function () {
    $("#clickme").toggle(function () {
        $(this).parent().animate({right:'0px'}, {queue: false, duration: 500});
    }, function () {
        $(this).parent().animate({right:'-280px'}, {queue: false, duration: 500});
    });
});


$(function () {
    $(".rightSidePanel").toggle(function () {
        $(this).parent().animate({right:'0px'}, {queue: false, duration: 500});
    }, function () {
        $(this).parent().animate({right:'-280px'}, {queue: false, duration: 500});
    });
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Number.prototype.toHHMMSS = function(){
	var sec_num = this;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};