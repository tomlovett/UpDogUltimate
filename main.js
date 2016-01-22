angular.module('UpDog', []);

angular.module('UpDog')
	.controller('gameManager', ['$scope', function($scope) {

/* initial values */
/* -------------- */
		$scope.us = 0;
		$scope.them = 0;
		$scope.substitutionMode = true;

		$scope.undoHistory = [];

		$scope.pointHistory = [];

/* object models */
/* ------------- */
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
			players: 	['player1', 'player2'],
			game: 		[0, 0, 0],
			history: 	[0, 0, 0]
		};

		$scope.team = {
			men: 		[],
			women: 		[],
			bench: 		[],
			field: 		[]
		};

/* recording score */
/* --------------- */
		$scope.recordScore = function(weScored) {
			var val;
			if (weScored) {
				$scope.us += 1
				val = 1;
			} else {
				$scope.them += 1
				val = -1;
			}
			scorePlayers(val);
			scoreTeamLinkages(val);
			$scope.substitutionMode = true;
		}

		var scorePlayers = function(val) {
			for (player in $scope.team.field) {
					markScore(player, val)
				} 
		}

		var markScore = function(player, score) {
			player.game[0] += score;
			player.game[1] += score;
			player.history[0] += score;
			player.history[1] += score;
		}

		var scoreTeamLinkages = function(weScored) {
			var length = $scope.team.field.length
			for (var x = 0; x < length-1; x++) {
				var player1 = $scope.team.field[x];
				for (var y = 1; y < length; y++) {
					var player2 = $scope.team.field[y];

				}
			}
		}

		var scoreLinkage = function(player1, player2, val)

/* handling substitutions */
/* ---------------------- */
		$scope.doneSubstitutions = function() {
			$scope.substitutionMode = false;
		}

		$scope.subOn = function(player) {
			var index = $scope.team.bench.indexOf(player)
			$scope.team.bench.splice(index, 1)
			$scope.team.field.push()
		}

		$scope.subOff = function(player) {
			var index = $scope.team.field.indexOf(player)
			$scope.team.field.splice(index, 1)
			$scope.team.bench.push()		}

		$scope.clearLine = function() {
			for (player in $scope.team.field) {
				$scope.subOff(player);
			}
		}

	}
])