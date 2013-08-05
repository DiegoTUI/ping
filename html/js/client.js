

/**
 * PingerClient.
 */
 var pingerClient = new function(){
 	// self-reference
	var self = this;
	//number of active pingers
	var activePingers = {
		clients:{},
		length: function(){
			return Object.keys(this.clients).length;
		}
	};
	//array of timeouts
	var timeouts = [];
	//number of pingers to create
	self.numberOfPingers = 100;
	//period for each pinger
	self.period = 100;
	//delay between the creation of each pinger
	self.delay = 1000;


	/**
 	 * Set Params
 	 */
 	 self.setParams = function(numberofpingers, period, delay){
 	 	self.numberOfPingers = numberofpingers;
 	 	self.period = period;
 	 	self.delay = delay;
 	 }

	/**
 	 * Create pingers
 	 */
 	self.createPingers = function(){
 		$('#message').html('<p>Trying to create ' + self.numberOfPingers + ' pingers with a period of ' + self.period + 'ms and a delay between pingers of ' + self.delay +  'ms</p>');
 	 	for (var i=0; i<self.numberOfPingers; i++)
		{
			timeouts.push(setTimeout(createPinger, self.delay * i));
		}
 	 }

 	 /**
 	  * Disconnect all pingers
 	  */
 	self.disconnectAll = function(){
 		info ("DisconnectAll");
 		self.clearAllTimeouts();
 		for (id in activePingers.clients)
 		{
 			info ("Disconnecting client: " + id);
 			var currentPinger = activePingers.clients[id];
 			currentPinger.disconnect();
 		}
		//clear pinger stats
		pinger.stats.delays = [];
		pinger.stats.average = 0;
 	}

 	/**
 	  * Clear all timeouts
 	  */
 	self.clearAllTimeouts = function(){
 		for (var i = 0; i < timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
		//quick reset of the timer array you just cleared
		timeouts = [];
 	}

 	 /**
	  * Create one pinger with the given period
	  */
	function createPinger()
	{
		info("Creating new pinger");
		var p = new pinger(onConnect,onDisconnect);
		p.start(self.period);
	}

	/**
	 * Callback when a pinger has connected
	 */
	function onConnect(pinger)
	{
		$('#message').html("<p>Client " + pinger.id + " has connected</p>");
		activePingers.clients[pinger.id] = pinger; 
		$('#activePingers').html(activePingers.length());
	}

	/**
	 * Callback when a pinger has disconnected
	 */
	function onDisconnect(id)
	{
		$('#message').html("<p>Client " + id + " has disconnected</p>");
		delete activePingers.clients[id];
		$('#activePingers').html(activePingers.length());
	}
 }

 /**
  * Other UI functions
  */
  var showValue = function (title, value)
  {
  	$('#'+title).html(value);
  }

