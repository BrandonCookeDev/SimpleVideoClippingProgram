var myApp = angular.module('myApp', []);

myApp.controller('homeCtrl', function($scope, $http){
	$scope.test = 'Hello World';
	$scope.file = {
		inputFile : '',
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
		player1 : '',
		player2 : '',
		yesAudio : true,
		noAudio : false,
		outputFileName : '',
		bracketUrl: ''
	};
	
	$scope.sanitizeObjectInputs = function(){
		$scope.file.tournamentName = $scope.file.tournamentName.replace(" ", "_");
		$scope.file.round = $scope.file.round.replace(" ", "_");
		$scope.file.player1.replace(" ", "_");
		$scope.file.player2.replace(" ", "_");		
		$scope.file.ssString = 
			$scope.file.ss.Hour + ':' + $scope.file.ss.Minute + ':' + $scope.file.ss.Second;
		$scope.file.endString = 
			$scope.file.end.Hour + ':' + $scope.file.end.Minute + ':' + $scope.file.end.Second;
	};
	
	$scope.changeOutputFilename = function(){
		$scope.sanitizeObjectInputs();
		
		var name = $scope.file.tournamentName + '-' + $scope.file.round + '-' + 
					$scope.file.player1 + '-' + $scope.file.player2 + '.mp4';
		$scope.file.outputFileName = name.replaceAll(" ", "");
		$scope.file.outputFileName = $scope.file.outputFileName.replaceAll("&", "");
		
		document.getElementById('outputFileName').innerHTML = $scope.file.outputFileName;
	};
	
	$scope.submitClipRequest = function(){
		$scope.sanitizeObjectInputs();
		var cmd = createClipWithObject($scope.file);
		
		var messageArea = document.getElementById('statusMessage');
		messageArea.innerHTML = 'Creating ' + $scope.file.outputFileName + '...';
		$http({
			method: 'POST',
			url: '/createClip',
			data:{
				command: cmd
			}
		})
		.then( 
		function(data, status, headers, config){
			//SUCCESS
			console.log('create clip was successful');
			messageArea.innerHTML = 'Creating ' + $scope.file.outputFileName + '...' + 'Created!';
		}, 
		(err, status, headers, config) => {
			//FAILURE
			console.log('create clip call failed: ' + err);
			messageArea.innerHTML = 'Creating clip failed...';
		});
		
		window.setTimeout($scope.$apply(), 15000);
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
	
	var myDropzone = new Dropzone("div#myDropzone", { 
		url: "/uploadFile",
		autoProcessQueue : true,
		dictDefaultMessage: "Drop files or click here to upload a new DICOM series ...",
		init : function() {

			myDropzone = this;

			//Restore initial message when queue has been completed
			this.on("drop", function(event) {
				console.log(myDropzone.files);            
				var target = myDropzone.files[0];
				
			});

		}
	});
	
	
	/*
	Dropzone.options.myDropzone({
	  init: function() {
		this.on("error", function(file, message) { alert(message); });
	  }
	});	
	*/
});

// Add Dropzone into page for automation file drop.
//var myDropzone = Dropzone.forElement("div#my-awesome-dropzone");
//myDropzone.on("error", function(file, message) { alert(message); });



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

