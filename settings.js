angular.module('settings', []);

angular.module('settings')
	.controller('settings', ['$scope', function($scope) {

		$scope.viewKey = [true, false, false]; // players, team, game settings
	
		$scope.changeView = function(index) {
			console.log('changeView fired. key: ', index);
			if ($scope.viewKey[index] == true) {
				return;
			} else {
				$scope.viewKey = [false, false, false];
				$scope.viewKey[index] = true;
			}
			console.log($scope.viewKey);
		}

	}])