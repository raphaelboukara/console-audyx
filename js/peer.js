angular

.module('app', [])

.controller('main', function($scope) {

	var peer = new Peer({
		host:'console-audyx.herokuapp.com',
		secure:true, 
		port:443,
		debug:4
	});

	var connectedPeers = {};
	connect = function (c) {
		console.log(c.peer);
		c.on('data', function(data) {
			console.log(c.peer);
	  		console.log(data);
		});
		c.on('close', function() {
	  		console.log(c.peer + ' has left the chat.');
	  		delete connectedPeers[c.peer];
		});
		connectedPeers[c.peer] = 1;
	};
	close = function () {
		eachActiveConnection(function(c) {
			c.close();
	    });
	};
	eachActiveConnection = function (fn) {
		for (var peerId in connectedPeers) {
		   	var conns = peer.connections[peerId];
	        for (var i = 0, ii = conns.length; i < ii; i += 1) {
	          var conn = conns[i];
	          fn(conn);
	        }
		};
	};
	peer.on('open', function(id){
		console.log(id);
	});
	peer.on('connection', connect);
	peer.on('error', function(err) {console.log(err);});



	

	

	

    $scope.send = function (msg) {
		eachActiveConnection(function(c) {
			c.send(msg);
		});
    };

    $scope.connect = function (requestedPeer){
    	var c = peer.connect(requestedPeer, {
				serialization: 'none',
				metadata: {message: 'hi i want to chat with you!'}
			});
		c.on('open', function() {
			connect(c);
		});
		c.on('error', function(err) { alert(err); });
		connectedPeers[requestedPeer] = 1;
    }

    window.onunload = window.onbeforeunload = function(e) {
	  if (!!peer && !peer.destroyed) {
	    peer.destroy();
	  }
	};

});

