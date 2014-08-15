angular

.module('app', [])

.controller('main', function($scope) {

	var socket = io.connect('https://services.audyx.com');

    $scope.yes = function () {
		socket.emit('audyx::console::yes', {
			code: $scope.code
		});
    };

    $scope.no = function () {
		socket.emit('audyx::console::no', {
			code: $scope.code
		});
    };

});