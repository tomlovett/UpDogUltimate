var UpDog = angular.module('UpDog', []);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {
		$scope.utility = utility; // not really necessary, more for troubleshooting

		$scope.team = utility.darkSide;

		$scope.subMode = true;
		$scope.us = 0;
		$scope.them = 0;

		$scope.recordScore = function(val) {
			if (val == 1) {
				$scope.us += 1
			} else {
				$scope.them += 1
			}
			$scope.subMode = true;
		} 

		$scope.doneSubbing = function() {
			$scope.subMode = false;
			// initializing Point objects?
		}

		$scope.subOnM = function(index) {
			var player = $scope.team.men.bench.splice(index, 1)
			$scope.team.men.field.push(player);
			$scope.team.sortMen()
		}

		$scope.subonW = function(index) {

		}

/*
		$scope.subOn = function(index, event) {
			$scope.team.roster[index].onField = true;
			console.log($scope.team.roster[index])
		};

		$scope.subOff = function(index) {
			$scope.team.roster[index].onField = false;
		}

		$scope.benchMen   = { gender: 'm', onField: false };
		$scope.fieldMen   = { gender: 'm', onField: true  };
		$scope.benchWomen = { gender: 'f', onField: false };
		$scope.fieldWomen = { gender: 'f', onField: true  };
*/

}]);

UpDog.factory('utility', function() {
	var service = {};

	service.Player = function(name, gender, handle) {
		return {
			name   :  name,
			gender :  gender,
			handle :  (handle || name),
			onField:  false,
			game   :  [0, 0, 0],
			career :  [0, 0, 0],
			points :  []
		}
	}

	service.markPoint = function(player, point) {
		player.game[0] += point.result;
		player.game[1] += 1;
		player.career[0] += point.result;
		player.career[1] += 1;
	}


	service.Point = function(receivedPull) {
		return {
			receivedPull : receivedPull,
			time 		 : undefined,
			playersOn 	 : [],
			result 		 : undefined
		}
	}

	service.parsePoint = function(player, point) {
		point.playersOn.forEach(function(player) {
			player.markPoint(point);
			player.points.push(point);
		})
	}

	service.Team = function(name) {
		return {
			name  : name,
			men	  : { bench: [], field: [] },
			women : { bench: [], field: [] }
			}
		}

	function Team(name) {
		this.name = name;
		this.men = { bench: [], field: [] }
		this.women = { bench: [], field: [] }
	}

	Team.prototype = {
		constructor: Team,
		sortMen : function() {
			this.men.bench.sort();
			this.men.field.sort();
		},
		sortWomen : function () {
			this.women.bench.sort();
			this.women.field.sort();
		}
	}

	service.addToRoster = function(player, team) {
		if (player.gender == 'm') {
			team.men.bench.push(player);
			team.men.bench.sort()
		} else {
			team.women.bench.push(player);
			team.women.bench.sort()
		}
	}

// isolating all of this in another factory

	service.Team.prototype.sort = function() {
		var sortFunc = function(a, b) {
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
		this.men.bench.sort(sortFunc);
		this.women.bench.sort(sortFunc);
		this.men.field.sort(sortFunc);
		this.women.field.sort(sortFunc);
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

	var ds = [
		{ name: 'Court', 	gender: 'f'	},
		{ name: 'Scout', 	gender: 'f' },
		{ name: 'Hammy', 	gender: 'f' },
		{ name: 'Allie', 	gender: 'f' },
		{ name: 'Caitlin',	gender: 'f' },
		{ name: 'Laurel', 	gender: 'f' },
		{ name: 'Stan', 	gender: 'm' },
		{ name: 'Kosti', 	gender: 'm' },
		{ name: 'Tom', 		gender: 'm' },
		{ name: 'Micro', 	gender: 'm' },
		{ name: 'Jake', 	gender: 'm' },
		{ name: 'Zybert', 	gender: 'm' },
		{ name: 'Johnny', 	gender: 'm' },
		{ name: 'David', 	gender: 'm' }
	];

	service.darkSide = new Team('Dark Side');

	ds.forEach(function(player) {
		player = service.Player(player.name, player.gender);
		service.addToRoster(player, service.darkSide)
	});

	// service.darkSide.sort()

	return service;

});