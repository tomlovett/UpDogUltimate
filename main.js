var UpDog = angular.module('UpDog', []);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {
		$scope.utility = utility; 

		$scope.team = utility.darkSide;
		$scope.game = new utility.Game()

		$scope.subMode = true;

		$scope.score = function(result) {
			$scope.game.recordPoint(result);
			$scope.subMode = true;
		} 

		$scope.doneSubbing = function() {
			$scope.subMode = false;
			console.log('game: ', $scope.game);
			$scope.logOnField();
		}

		$scope.logOnField = function() {
			$scope.team.men.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player);
			})
			$scope.team.women.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player);
			})
		}

// can collapse into one function in future, when more functionality added
		$scope.subOn = function(index, roster) {
			if (!$scope.subMode) { return; }
			var player = roster.bench.splice(index, 1);
			roster.field.push(player[0]);
			$scope.team.sort()
		}

		$scope.subOff = function(index, roster) {
			if (!$scope.subMode) { return; }
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
// Player \\
	 function Player(name, gender, handle) {
		this.name   =  name;
		this.gender =  gender;
		this.handle =  (handle || name);
		this.game   =  [0, 0, 0];
		this.career =  [0, 0, 0];
		this.points =  []
	}

	Player.prototype = {
		markPoint : function(result) {
			this.game[0]   += result; // eh, point or not
			this.game[1]   += 1;
			this.career[0] += result;
			this.career[1] += 1;
		}
	}

// Team \\
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
			} else {
				this.women.bench.push(player);
			}
			this.sort()
		}
	}

// Game \\
	function Game() {
		this.score = [0,0];
		this.pointHistory = [];
		this.currentPoint = new Point(1);
	}

	Game.prototype = {
		constructor: Game,
		recordPoint: function(result) {
			this.updateScoreboard(result)
			this.currentPoint.recordResult(result)
			this.pointHistory.push(this.currentPoint);
			this.updatePlayerPoints(this.currentPoint);
			this.currentPoint = new Point(result);
		},
		updateScoreboard: function(result) {
			if (result == 1) {
				this.score[0] += 1;
			} else {
				this.score[1] += 1;
			} 
		},
		updatePlayerPoints: function(point) {
			point.playersOn.forEach(function(player) {
				player.points.push(point);
			});
		}
	}

// Point \\
	function Point(pulling) {
		this.pulling   = pulling;
		this.time 	   = Date.now();
		this.playersOn = [];
		this.result    = undefined
	}

	Point.prototype = {
		constructor: Point,
		recordResult: function(result) {
			this.result = result;
			this.playersOn.forEach(function(player) {
				player.markPoint(result);
			});
		}
	}
/* pre-loads */
/* --------- */
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

	return {
		Player 	 : Player,
		Team 	 : Team,
		Game 	 : Game,
		Point 	 : Point,
		darkSide : darkSide
	};

});