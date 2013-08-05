 
 /**
 * An annoying pinger.
 */
var pinger = function (onConnect, onDisconnect)
{
	// self-reference
	var self = this;
	//connection
	var socket = null;
	//timer
	var timer = null;
	//timestamp
	var timestamp = null;
	//auto-generated id of the pinger
	self.id = randomId();

	/**
	 * Ping!!
	 */
	 function ping()
	 {
	 	timestamp = new Date().getTime();
	 	info ("pinging from id: " + self.id);
	 	socket.emit("ping",{clientId: self.id});
	 }

	/**
	 * Starts pinging with a given period
	 */
	self.start = function(period)
	{
		info ("Start function called for id: " + self.id);
		if (socket === null)
		{
			info ("Connecting websocket");
			socket = io.connect('http://54.246.80.107:8080',{"force new connection" : true});
			//connected event
			socket.on("connected", function(data){
				onConnect(self);
				info ("I am connected!!");
			});
			//notification event
			socket.on("notification", function(data){
				info ("Notification: " + data);
			});
			//disconnect event - when I am voluntarely disconnected
			socket.on("disconnect", function(data){
				onDisconnect(self.id);
				info ("Disconnected!!! Stopping timer.");
				self.stopTimer();
			});
			//pong event
			socket.on("pong", function(data){
				var delay = new Date().getTime() - timestamp;
				info ("Pong received: " + data.clientId + " - delay in ms: " + delay);
				pinger.stats.addDelay(delay);
				info ("Stats updated. Delays length: " + pinger.stats.delays.length + " - Average: " + pinger.stats.average);
				$('#averageDelay').html(pinger.stats.average);
			});
		}
		if (timer === null)
		{
			info ("Starting high resolution timer");
			timer = new highResolutionTimer(period, ping);
		}
	}
	/**
	 * Stops pinging
	 */
	self.stopTimer = function()
	{
		timer.stop();
	}
	/**
	 * Disconnects socket
	 */
	self.disconnect = function()
	{
		info ("Disconnect was called inside id: " + self.id);
		socket.disconnect();
		//self.stopTimer();
	}
}

//static variable to write the delays
pinger.stats = {
	delays:[],
	average: 0,
	addDelay: function(delay){
		this.delays.push(delay);
		var newlength = this.delays.length;
		this.average = (this.average*(newlength - 1) + delay)/newlength;
	}
};
