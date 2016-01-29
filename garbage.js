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