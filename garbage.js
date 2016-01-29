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