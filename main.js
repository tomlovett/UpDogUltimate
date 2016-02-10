var UpDog = angular.module('UpDog', []);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {
		$scope.utility = utility

		$scope.team = utility.darkSide
		$scope.game = new utility.Game()
		// cutting down HTML with $scope.men and $scope.women

		$scope.subMode = true

		$scope.selected = ''
		$scope.metric   = ''

		$scope.score = function(result) {
			$scope.game.recordPoint(result)
			$scope.subMode = true
			console.log($scope.game)
		} 

		$scope.doneSubbing = function() {
			$scope.subMode = false
			$scope.logOnField()
			$scope.game.currentPoint.startTime = Date.now()
		}

// could combine team.men.field and team.women.field with a pointer array
		$scope.logOnField = function() {
			$scope.team.men.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player)
			})
			$scope.team.women.field.forEach(function(player) {
				$scope.game.currentPoint.playersOn.push(player)
			})
		}

		$scope.fire = function(index, from, to) {
			if ($scope.subMode) { 
				sub(index, from, to)
			} else {
				select(index, from)
			}
		}

		var sub = function(index, from, to) {
			var player = from.splice(index, 1)
			to.push(player[0])
			$scope.team.sort()
		}

		var select = function(index, group) {
			if ($scope.selected) {
				$scope.selected = ''
			} else {
				$scope.selected = group[index]
				if ($scope.metric) {
					recordStat($scope.selected, $scope.metric)
				}
			}
		}
				// very similar models, condense to one function?
		$scope.bonusStat = function(metric) {
			if ($scope.metric) {
				$scope.metric = ''
			} else {
				$scope.metric = metric
				if ($scope.selected) {
					recordStat($scope.selected, metric)
				}
			}
		}

		var recordStat = function(player, metric) {
			$scope.game.currentPoint.addMetric(player, metric)
			console.log($scope.game.currentPoint.stats)
			$scope.selected = ''
			$scope.metric   = ''
		}

		$scope.clearLine = function() {
			while ($scope.team.men.field.length > 0) {
				sub(0, $scope.team.men.field, $scope.team.men.bench)
			}
			while ($scope.team.women.field.length > 0) {
				sub(0, $scope.team.women.field, $scope.team.women.bench)
			}
		}

}])

UpDog.controller('gameStats', ['$scope', 'utility', function($scope, utility) {

	$scope.game = utility.dummyGame

	$scope.expandPoints = {}

	$scope.expand = function(index) {
		if ($scope.expandPoints[index]) {
			delete $scope.expandPoints[index]
		} else {
			$scope.expandPoints[index] = true
		}
		console.log('expand: ', $scope.expandPoints)
	}

}])

UpDog.controller('settings', ['$scope', 'utility', function($scope, utility) {
	$scope.player = {}
	$scope.nameError = false

	$scope.team = utility.darkSide

	$scope.submitPlayer = function(gender) {
		if ($scope.player.name === undefined) {
			$scope.nameError = true
			return
		}
		$scope.nameError = false
		var player = new utility.Player($scope.player.name, gender, $scope.player.handle)
		$scope.team.addToRoster(player) // change to team
		$scope.player = {}
	}

	$scope.edit = function(player) {
		if (player == $scope.player) {
			$scope.player = {}
		} else {
			$scope.player = player
		}
	}

	$scope.removePlayer = function() {
		if ($scope.player.gender == 'm') {
			line = $scope.team.men.bench
		} else {
			line = $scope.team.women.bench
		}
		var index = line.indexOf($scope.player)
		if (index == -1) { return }
		$scope.player = {}
		line.splice(index, 1)  // change to team
	}

}])

UpDog.factory('utility', function() {
// record stats and interpret stats separately

// Player \\
	 function Player(name, gender, handle) {
		this.name   =  name
		this.gender =  gender
		this.handle =  handle || name
		this.games  =  []
		this.points =  []
	}

// Team \\
// this.game?
	function Team(name) {
		this.name  = name || 'US'
		this.men   = { bench: [], field: [] }
		this.women = { bench: [], field: [] }
	}

	Team.prototype = {
		constructor: Team,
		sort : function() {
			this.men.bench   = _.sortBy(this.men.bench,   'handle')
			this.men.field   = _.sortBy(this.men.field,   'handle')
			this.women.bench = _.sortBy(this.women.bench, 'handle')
			this.women.field = _.sortBy(this.women.field, 'handle')
		},
		addToRoster : function(player) {
			if (player.gender == 'm') { this.men.bench.push(player) }
			else { this.women.bench.push(player) }
			this.sort()
		}
	}

// Game \\
// this.team?
	function Game() {
		this.score = [0, 0]
		this.pointHistory = []
		this.currentPoint = new Point(1)
	}

	Game.prototype = {
		constructor: Game,
		recordPoint: function(result) {
			this.updateScoreboard(result)
			this.currentPoint.recordResult(result)
			this.currentPoint.score = this.score.slice()
			this.pointHistory.push(this.currentPoint)
			this.updatePlayerPoints(this.currentPoint)
			this.currentPoint = new Point(result)
		},
		updateScoreboard: function(result) {
			if (result == 1) { this.score[0] += 1 }
			else { this.score[1] += 1 } 
		},
		updatePlayerPoints: function(point) {
			point.playersOn.forEach(function(player) {
				player.points.push(point)
			});
		}
	}

// Point \\
	function Point(pulling) {
		this.pulling   = pulling	// 1 or -1
		this.startTime = Date.now()
		this.endTime   = undefined
		this.totalTime = undefined
		this.playersOn = []
		this.result    = undefined	// 1 or -1
		this.stats	   = []
		this.score 	   = []
	}

	Point.prototype = {
		constructor: Point,
		recordResult: function(result) {
			this.result = result
			this.endTime = Date.now()
			this.totalTime = this.endTime - this.startTime
		},
		addMetric: function(player, metric) {
			this.stats.push(new Metric(player, metric))
		},
		shallowString: function() {
			return 'stuff I want for this view'
		},
		deepString: function() {
			var output = ''
			

		}
	}

// Bonus Metrics \\
	function Metric(player, type) {
		this.player = player
		this.type   = type
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
		{ name: 'Zy',	 	gender: 'm' },
		{ name: 'Johnny', 	gender: 'm' },
		{ name: 'David', 	gender: 'm' }
	];

	var darkSide = new Team('Dark Side')

	ds.forEach(function(person) {
		person = new Player(person.name, person.gender)
		darkSide.addToRoster(person)
	})

	var dummyGame = new Game()
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}

	dummyGame.recordPoint(0)
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}
	dummyGame.recordPoint(1)
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}
	dummyGame.recordPoint(1)
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}
	dummyGame.recordPoint(0)
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}
	dummyGame.recordPoint(0)
	for (var i = 0; i < 3; i++) {
		dummyGame.currentPoint.playersOn.push(darkSide.men.bench[i])
		dummyGame.currentPoint.playersOn.push(darkSide.women.bench[i])
	}
	dummyGame.recordPoint(1)
	dummyGame.recordPoint(1)
	dummyGame.recordPoint(0)
	dummyGame.recordPoint(1)

	console.log(dummyGame)

	return {
		Player 	 : Player,
		Team 	 : Team,
		Game 	 : Game,
		Point 	 : Point,
		darkSide : darkSide,
		dummyGame: dummyGame
	}

})