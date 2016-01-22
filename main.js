angular.module('UpDog', []);

angular.module('UpDog')
	.controller('gameManager', ['$scope', function($scope) {

		$scope.us = 0;
		$scope.them = 0;
		$scope.substitutionMode = true;

		$scope.undoHistory = [];

		$scope.pointHistory = [];

		$scope.point = {
			pulling: 	null, // bool
			playersOn:  null, // array
			weScored: 	null, // bool
			time: 		null, // number
		};

		$scope.player = {
			name: 		'',
			gender: 	'',
			handle: 	'',
			game: 		[0, 0, 0],
			history: 	[0, 0, 0],
 			linkages: 	{}
		};

		$scope.linkage = {
			players: ['player1', 'player2']
			game: 		[0, 0, 0],
			history: 	[0, 0, 0]
		};

		$scope.team = {
			men: 		[],
			women: 		[],
			bench: 		[],
			field: 		[]
		};

		$scope.recordScore = function(weScored) {
			if (weScored) {
				$scope.us += 1
			} else {
				$scope.them += 1
			}
			scorePlayers(weScored);
			scoreLinkages(weScored);
			$scope.substitutionMode = true;
		}

		$scope.doneSubstitutions = function() {
			$scope.substitutionMode = false;
		}

		var scorePlayers = function(weScored) {
			for (player in $scope.team.field) {
				if (weScored) {
					markScore(player, 1)
				} else {
					markScore(player, -1)
				}
			}
		}

		var markScore = function(player, score) {
			player.game[0] += score;
			player.game[1] += score;
			player.history[0] += score;
			player.history[1] += score;
		}

	}
])