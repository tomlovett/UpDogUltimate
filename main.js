var UpDog = angular.module('UpDog', ['ngRoute']);

UpDog.controller('gameManager', ['$scope', 'utility', function($scope, utility) {

}]);

UpDog.factory('utility', function() {
	var service = {};

	service.Player = function(name, handle, gender) {
		{
			this.name   =  name,
			this.handle =  (handle || name),
			this.gender =  gender,
			this.game   =  [0, 0, 0],
			this.career =  [0, 0, 0],
			this.points =  []
			this.markPoint = function(point) {
				this.points.push(point)
				this.game[0] += point.result;
				this.game[1] += 1;
				this.career[0] += point.result;
				this.career[1] += 1;
			}
		}
	}

	service.markPlayerPoint = function(player, point) {

	}

	service.parsePoint = function(point) {

	}

})