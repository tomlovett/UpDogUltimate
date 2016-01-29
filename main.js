var UpDog = angular.module('UpDog', []);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {
		$scope.utility = utility; // not really necessary, more for troubleshooting

		$scope.team = utility.darkSide;

		$scope.subMode = true;  // converting to an object for later
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


// moving these three to Team object?
		$scope.subOn = function(index, roster) {
			var player = roster.bench.splice(index, 1);
			roster.field.push(player[0]);
			$scope.team.sort()
		}

		$scope.subOff = function(index, roster) {
			var player = roster.field.splice(index, 1);
			roster.bench.push(player[0]);
			$scope.team.sort();
		}

		$scope.clearLine = function() {
			while ($scope.team.men.field.length > 0) {
				$scope.subOff(0, $scope.team.men);
			}
			while ($scope.team.women.field.length > 0) {
				$scope.subOff(0, $scope.team.women);
			}
		}

}]);

UpDog.factory('utility', function() {
	var service = {};

	 function Player(name, gender, handle) {
		this.name   =  name;
		this.gender =  gender;
		this.handle =  (handle || name);
		this.game   =  [0, 0, 0];
		this.career =  [0, 0, 0];
		this.points =  []
	}

	Player.prototype = {
		markPoint : function(point) {
			this.game[0]   += point.result; // eh, point or not
			this.game[1]   += 1;
			this.career[0] += point.result;
			this.career[1] += 1;
		}
	}

	function Point(pulling) {
		this.pulling   = pulling;
		this.time 	   = Date.now();
		this.playersOn = [];
		// this.result    = undefined add when recording point
	}

	service.parsePoint = function(player, point) {
		point.playersOn.forEach(function(player) {
			player.markPoint(point);
			player.points.push(point);
		})
	}

	function Team(name) {
		this.name  = name;
		this.men   = { bench: [], field: [] }
		this.women = { bench: [], field: [] }
	}

	Team.prototype = {
		constructor: Team,
		sortFunc : function(a, b) {
			if (a.handle > b.handle) {
				return 1;
			} else if (a.handle < b.handle) {
				return -1;
			} else {
				return 0;
			}
		},
		sort : function() {
			this.men.bench.sort(this.sortFunc);
			this.men.field.sort(this.sortFunc);
			this.women.bench.sort(this.sortFunc);
			this.women.field.sort(this.sortFunc);
		},
		addToRoster : function(player) {
			if (player.gender == 'm') {
				this.men.bench.push(player);
				this.sort()
			} else {
				this.women.bench.push(player);
				this.sort()
			}
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

	var darkSide = new Team('Dark Side');

	ds.forEach(function(person) {
		person = new Player(person.name, person.gender);
		darkSide.addToRoster(person)
	});

	darkSide.sort()

	service.darkSide = darkSide;

	return service;

});