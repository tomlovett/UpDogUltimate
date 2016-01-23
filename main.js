angular.module('UpDog', []);

angular.module('UpDog')
	.controller('gameManager', ['$scope', function($scope) {

/* initial values */
/* -------------- */
	$scope.us = 0;
	$scope.them = 0;
	$scope.subMode = true;

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

	$scope.newTeam = function() {
		return {
			roster: 	[],
			benchMen: 	[],
			benchWomen: [],
			field: 		[]
		}
	};

	$scope.team = $scope.newTeam()
	var genTeam = function(team, roster) {
		for (var i=0; i<roster.length; i++) {
			var player = roster[i];
			player = $scope.player(player.name, player.gender)
			if (team.roster.length > 0) {
				genLinkages(player, team.roster);
			}
			team.roster.push(player);
			if (player.gender == 'm') {
				team.benchMen.push(player);
			} else {
				team.benchWomen.push(player);
			}
		}
		return team;
	}

	var genLinkages = function(player, roster) {
		for (var i=0; i<roster.length; i++) {
			var link = $scope.linkage(player, roster[i]);
			player.linkages[roster[i].name.slice(0)] = link; // .slice(0) to workaround 
			roster[i].linkages[player.name.slice(0)] = link;
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
		$scope.subMode = true;
	}

	var scorePlayers = function(score) {
		for (player in $scope.team.field) {
				console.log(player)
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
	$scope.doneSubbing = function() {
		$scope.subMode = false;
	}

	$scope.subOn = function(player, gender, subMode) {
		if (!subMode) { return; }
		console.log('subOn!')
		if (gender === 'm') {
			var bench = $scope.team.benchMen;
		} else {
			var bench = $scope.team.benchWomen;
		}
		var index = bench.indexOf(player)
		bench.splice(index, 1)
		$scope.team.field.push(player)
		// sub in a way that players are inherently sorted?
	}

	$scope.subOff = function(player, subMode) {
		if (!subMode) { return; }
		var index = $scope.team.field.indexOf(player)
		$scope.team.field.splice(index, 1)
		if (player.gender == 'm') {
			var bench = $scope.team.benchMen;
		} else {
			var bench = $scope.team.benchWomen;

		}
		bench.push(player)
	}

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

	$scope.darkSide = genTeam($scope.team, ds);
	$scope.subOn($scope.darkSide.benchMen[0], 'm', true);
	console.log($scope.darkSide.benchMen[0]);
	console.log($scope.darkSide.roster[0].name.slice(0))

}]);
