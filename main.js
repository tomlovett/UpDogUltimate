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

	$scope.player = function(name, gender, handle) {
		return {
			name: 		name,
			gender: 	gender,		// 'm' or 'f'
			handle: 	(handle || name),
			game: 		[0, 0, 0],
			history: 	[0, 0, 0],
			linkages: 	{}
		}
	};

	$scope.linkage = function(player1, player2) {
		return {
			players: 	[player1, player2],
			game: 		[0, 0, 0],
			history: 	[0, 0, 0]
		}
	};

	$scope.team = function() {
		return {
			roster: 	[],
			bench: 		[],
			field: 		[]
		}
	};

	var genTeam = function(roster) {
		console.log('loading team');
		var team = $scope.team();
		console.log(team);
		for (var i=0; i<roster.length; i++) {
			var player = roster[i];
			player = $scope.player(player.name, player.gender)
			genLinkages(player, team.roster);
			team.roster.push(player);
			team.bench.push(player);
			console.log('player added');
		}
		return team;
	}

	var genLinkages = function(player, bench) {
		for (teammate in bench) {
			var link = $scope.linkage(player, teammate);
			player.linkages[teammate.name] = link;
			teammate.linkages[player.name] = link;
		}
	}

/* recording score */
/* --------------- */
	$scope.recordScore = function(weScored) {
		var score;
		if (weScored) {
			$scope.us += 1
			score = 1;
		} else {
			$scope.them += 1
			score = -1;
		}
		scorePlayers(score);
		scoreTeamLinkages(score);
		$scope.substitutionMode = true;
	}

	var scorePlayers = function(score) {
		for (player in $scope.team.field) {
				markScore(player, score)
			}
	}

	var markScore = function(player, score) {
		player.game[0] += score;
		player.game[1] += score;
		player.history[0] += score;
		player.history[1] += score;
	}

	var scoreTeamLinkages = function(score) {
		var length = $scope.team.field.length
		for (var x = 0; x < length-1; x++) {
			var player1 = $scope.team.field[x];
			for (var y = 1; y < length; y++) {
				var player2 = $scope.team.field[y].name;
				player1.linkages[player2] += score;
			}
		}
	}

/* handling substitutions */
/* ---------------------- */
	$scope.doneSubstitutions = function() {
		$scope.substitutionMode = false;
	}

	$scope.subOn = function(player) {
		var index = $scope.team.bench.indexOf(player)
		$scope.team.bench.splice(index, 1)
		$scope.team.field.push()
		// sub in a way that players are inherently sorted?
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

	var ds = [
		{ 	name: 	'Court',
			gender: 'f'
		},
		{ 	name: 	'Scout',
			gender: 'f'
		},
		{ 	name: 	'Hammy',	
			gender: 'f'
		},
		{ 	name: 	'Allie',
			gender: 'f'
		},
		{ 	name: 	'Tom',
			gender: 'm'
		},
		{ 	name: 	'Micro',
			gender: 'm'
		},
		{ 	name: 	'Jake',
			gender: 'm'
		},
		{ 	name: 	'Zybert',
			gender: 'm'
		},
		{ 	name: 	'Johnny',
			gender: 'm'
		},
		{ 	name: 	'David',
			gender: 'm'
		}
	];

	var darkSide = genTeam(ds);

}]);
