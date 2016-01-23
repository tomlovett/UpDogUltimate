angular.module('UpDog', []);

angular.module('UpDog')
	.controller('gameManager', ['$scope', '$timeout', function($scope, $timeout) {

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

/* team generation */
/* --------------- */
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
		team.benchWomen.sort(sortPlayers)
		team.benchMen.sort(sortPlayers)
		team.field.sort(sortPlayers)
		return team;
	}

	var genLinkages = function(player, roster) {
		for (var i=0; i<roster.length; i++) {
			var link = $scope.linkage(player, roster[i]);
			player.linkages[roster[i].name.slice(0)] = link; // .slice(0) to call name as a string, rather than the player object
			roster[i].linkages[player.name.slice(0)] = link;
		}
	}

	var sortPlayers = function(a, b) {
		if (a.gender === 'f' && b.gender === 'm') {
			return -1;
		} else if (a.gender === 'm' && b.gender === 'f') {
			return 1;
		} else if (a.name.toLowerCase() < b.name.toLowerCase()) {
			return -1;
		} else if (a.name.toLowerCase() > b.name.toLowerCase()) {
			return 1;
		} else {
			return 0;
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
		console.log($scope.team.field[0].linkages)
		$scope.subMode = true;
	}

	var scorePlayers = function(score) {
		for (var i=0; i < $scope.team.field.length; i++) {
			markScore($scope.team.field[i], score)
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

	$scope.subOn = function(i, gender, subMode) {
		if (!subMode) { return; }
		var player;
		var bench;
		if (gender === 'm') {
			player = $scope.team.benchMen[i]
			bench = $scope.team.benchMen;
		} else {
			player = $scope.team.benchWomen[i]
			bench = $scope.team.benchWomen;
		}
		bench.splice(i, 1);
		bench.sort(sortPlayers);
		$scope.team.field.push(player);
		$scope.team.field.sort(sortPlayers);
		// sub in a way that players are inherently sorted?
	}

	$scope.subOff = function(i, subMode) {
		if (!subMode) { return; }
		var player = $scope.team.field[i];
		$scope.team.field.splice(i, 1)
		if (player.gender == 'm') {
			var bench = $scope.team.benchMen;
		} else {
			var bench = $scope.team.benchWomen;

		}
		bench.push(player);
		bench.sort(sortPlayers);
		$scope.team.field.sort(sortPlayers);
	}

	$scope.clearLine = function() {
		while ($scope.team.field.length > 0) {
			$scope.subOff(0, true);
		}
	}

	var ds = [
		{ 	name: 	'Court', 	gender: 'f'	},
		{ 	name: 	'Scout', 	gender: 'f' },
		{ 	name: 	'Hammy', 	gender: 'f' },
		{ 	name: 	'Allie', 	gender: 'f' },
		{ 	name: 	'Caitlin',	gender: 'f' },
		{ 	name: 	'Laurel', 	gender: 'f' },
		{ 	name: 	'Stan', 	gender: 'm' },
		{ 	name: 	'Kosti', 	gender: 'm' },
		{ 	name: 	'Tom', 		gender: 'm' },
		{ 	name: 	'Micro', 	gender: 'm' },
		{ 	name: 	'Jake', 	gender: 'm' },
		{ 	name: 	'Zybert', 	gender: 'm' },
		{ 	name: 	'Johnny', 	gender: 'm' },
		{ 	name: 	'David', 	gender: 'm' }
	];

	$scope.darkSide = genTeam($scope.team, ds);

}]);
