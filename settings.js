angular.module('settings', []);

angular.module('settings')
	.controller('settings', ['$scope', function($scope) {
		$scope.players = true;
		$scope.teams = false;
		$scope.game = false;

		$scope.masterKey = [$scope.players, $scope.teams, $scope.game];

		$scope.viewPlayers = function() {
			if ($scope.players == true) { 
				return;
			} else {
				$scope.masterKey = [true, false, false];
			}
		}

		$scope.changeView = function(index) {
			console.log('changeView fired. key: ', index);
			if ($scope.masterKey[index] == true) {
				return;
			} else {
				$scope.masterKey = [false, false, false];
				$scope.masterKey[index] = true;
			}
		}

	}])