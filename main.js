var UpDog = angular.module('UpDog', ['ngRoute']);

UpDog.config(function($routeProvider) { 
	$routeProvider
		.when('/', {
			templateUrl : 'game.html',
			controller  : 'gameManager'
		})

		.when('/settings', {
			templateUrl : 'settings.html',
			controller  : 'settingsController'
		})

		.when('/stats', {
			templateUrl : 'stats.html',
			controller  : 'statsController'
		});
});

UpDog.controller('gameManager', ['$scope', '$timeout', 'playerUtil', function($scope, $timeout, playerUtil) {

/* initial values */
/* -------------- */
	$scope.us = 0;
	$scope.them = 0;
	$scope.subMode = true;

	$scope.undoHistory = [];

	$scope.pointHistory = [];

	$scope.team = playerUtil.darkSide;
	console.log($scope.team);

/* object models */
/* ------------- */
	$scope.point = {
		pulling: 	null, // bool
		playersOn:  null, // array
		weScored: 	null, // bool
		time: 		null, // number
	};



	$scope.linkage = function(player1, player2) {
		return {
			players: 	[player1, player2],
			game: 		[0, 0, 0],
			history: 	[0, 0, 0]
		}
	};

/* team generation */
/* --------------- */
	var genLinkages = function(player, roster) {
		for (var i=0; i<roster.length; i++) {
			var link = $scope.linkage(player, roster[i]);
			player.linkages[roster[i].name.slice(0)] = link; // .slice(0) to call name as a string, rather than the player object
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
		console.log($scope.team.field[0].linkages)
		$scope.subMode = true;
	}

	var scorePlayers = function(score) {
		for (var i=0; i < $scope.team.field.length; i++) {
			markScore($scope.team.field[i], score)
			}
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

	$scope.undoScore = function(){
		return 'nada, kid';
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


}]);

UpDog.factory('playerUtil', function() {
	var service = {};

	service.newPlayer = function(name, gender, handle) {
		return {
			name: 		name,
			gender: 	gender,		// 'm' or 'f'
			handle: 	(handle || name),
			game: 		[0, 0, 0],
			history: 	[0, 0, 0],
			linkages: 	{},
			teams: 		null
		}
	};

	service.markScore = function(player, score) {
		player.game[0] += score;
		player.game[1] += score;
		player.history[0] += score;
		player.history[1] += score;
	}

	service.newTeam = function() {
		return {
			permaRoster:[],
			benchMen: 	[],
			benchWomen: [],
			field: 		[]
		}
	};

	service.addTo = function(player, team) {
		team.permaRoster.push(player);
		if (player.gender == 'f') {
			team.benchWomen.push(player);
		} else {
			team.benchMen.push(player);
		}
		refreshTeam(team);
	}

	service.refreshTeam = function(team) {
		var masterList = [team.permaRoster, team.benchMen, team.benchMen]
		masterList.forEach(function(list) {
			list.sort(sortPlayers);
		})
	}

	service.sortPlayers = function(a, b) {
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

/* Pre-loading team */
/* ---------------- */
	service.darkSide = newTeam();

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


	ds.forEach(function(person) {
		var player = service.newPlayer(person.name, person.gender)
		service.addTo(player, darkSide)
	})


	return service;
});

	