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
		outputFileName : ''
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
		
		$http({
			method: 'POST',
			url: '/createClip',
			data:{
				command: cmd
			}
		})
		.then(
		() => {
			//SUCCESS
			console.log('create clip was successful');
		}, 
		(err) => {
			//FAILURE
			console.log('create clip call failed: ' + err);
		});
	};
	
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/*
directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);*/