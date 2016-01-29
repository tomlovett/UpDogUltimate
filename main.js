var UpDog = angular.module('UpDog', []);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {
		$scope.utility = utility; 

		$scope.team = utility.darkSide;
		$scope.game = new utility.Game()

		$scope.subMode = true;

		$scope.score = function(result) {
			$scope.game.recordPoint(result);
			$scope.subMode = true;
			console.log($scope.game);
		} 

		$scope.doneSubbing = function() {
			$scope.subMode = false;
			$scope.logOnField();
			$scope.game.currentPoint.time = Date.now();
		}

// could combine team.men.field and team.women.field with a pointer array
		$scope.logOnField = function() {
			$scope.team.men.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player);
			})
			$scope.team.women.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player);
			})
		}

// can collapse into one function in future, when more functionality added
		$scope.sub = function(index, from, to) {
			if (!$scope.subMode) { return; }
			var player = from.splice(index, 1);
			to.push(player[0]);
			$scope.team.sort()
		}

		$scope.clearLine = function() {
			while ($scope.team.men.field.length > 0) {
				$scope.sub(0, $scope.team.men.field, $scope.team.men.bench);
			}
			while ($scope.team.women.field.length > 0) {
				$scope.sub(0, $scope.team.women.field, $scope.team.women.bench);
			}
		}

}]);

UpDog.controller('settings', ['$scope', 'utility', function($scope, utility) {
	$scope.player = {};
	$scope.nameError = false;



	var allPlayers = utility.darkSide.men.bench.concat(utility.darkSide.women.bench);

	$scope.allPlayers = allPlayers;
	$scope.chicksOnly = { 'gender': 'f' };
	$scope.dudesOnly = { 'gender' : 'm' };

	$scope.submitPlayer = function(gender) {
		$scope.nameError = !/\w+/.test($scope.player.name)
		if ($scope.nameError) {
			console.log('failed verification');
			return;
		}
		var player = new utility.Player($scope.player.name, gender, $scope.player.handle);
		console.log(player);
		$scope.allPlayers.push(player);
		$scope.player = {};
	}

	$scope.edit = function(player) {
		$scope.player = player;
	}

	$scope.removePlayer = function() {
		var index = $scope.allPlayers.indexOf($scope.player)
		if (index == -1) { return; }
		$scope.player = {};
		$scope.allPlayers.splice(index, 1);
		// can modify fairly easily to remove from roster
	}

}]);

UpDog.factory('utility', function() {

// cross-recording data is a little less than intuitive, but otherwise leads to less code

// Player \\
	 function Player(name, gender, handle) {
		this.name   =  name;
		this.gender =  gender;
		this.handle =  handle || name;
		this.game   =  [0, 0, 0];
		this.career =  [0, 0, 0];
		this.points =  []
	}

	Player.prototype = {
		markPoint : function(result) {
			this.game[0]   += result;
			this.game[1]   += 1;
			this.career[0] += result;
			this.career[1] += 1;
		}
	}

// Team \\
// this.game?
	function Team(name) {
		this.name  = name || 'US';
		this.men   = { bench: [], field: [] }
		this.women = { bench: [], field: [] }
	}

	Team.prototype = {
		constructor: Team,
		sort : function() {
			this.men.bench = _.sortBy(this.men.bench, 'handle');
			this.men.field = _.sortBy(this.men.field, 'handle');
			this.women.bench = _.sortBy(this.women.bench, 'handle');
			this.women.field = _.sortBy(this.women.field, 'handle');
		},
		addToRoster : function(player) {
			if (player.gender == 'm') { this.men.bench.push(player); }
			else { this.women.bench.push(player); }
			this.sort()
		}
	}

// Game \\
// this.team?
	function Game() {
		this.score = [0, 0];
		this.pointHistory = [];
		this.currentPoint = new Point(1);
	}

	Game.prototype = {
		constructor: Game,
		recordPoint: function(result) {
			this.updateScoreboard(result)
			this.currentPoint.recordResult(result);
			this.pointHistory.push(this.currentPoint);
			this.updatePlayerPoints(this.currentPoint);
			this.currentPoint = new Point(result);
		},
		updateScoreboard: function(result) {
			if (result == 1) { this.score[0] += 1; }
			else { this.score[1] += 1; } 
		},
		updatePlayerPoints: function(point) {
			point.playersOn.forEach(function(player) {
				player.points.push(point);
			});
		}
	}

// Point \\
	function Point(pulling) {
		this.pulling   = pulling;		// 1 or -1
		this.time 	   = undefined;
		this.playersOn = [];
		this.result    = undefined;		// 1 or -1
	}

	Point.prototype = {
		constructor: Point,
		recordResult: function(result) {
			this.result = result;
			this.recordTime();
			this.playersOn.forEach(function(player) {
				player.markPoint(result);
			});
		},
		recordTime: function() {
			this.time = Date.now() - this.time;
			this.time = (this.time / 1000); // convert to mins & seconds
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

	return {
		Player 	 : Player,
		Team 	 : Team,
		Game 	 : Game,
		Point 	 : Point,
		darkSide : darkSide
	};

});