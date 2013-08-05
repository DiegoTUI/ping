/**
 * Requirements.
 */  
	var log = require('./util/log.js');
	var pinger = require('./robot/pinger.js').pinger;
	var debug = log.debug;
	var error = log.error;
	var info = log.info;

/**
 * Constants.
 */
process.title = 'client_pinger';

/**
 * Globals.
 */
 var numberOfPingers = 10;
 var period = 1000;
 processArguments(process.argv.slice(2));
 debug ("Arguments. numberOfPingers: " + numberOfPingers + " - period: " + period);

/**
 * Process command line arguments.
 * Usage: client [-d] [-n][numberofpingers] [-p][period]
 */
function processArguments(args)
{
	debug ("Processing args: " + args.toString());
	while (args.length > 0)
	{
		var arg = args.shift();
		debug("arg: " + arg);
		if (arg.startsWith("-n"))
		{
			numberOfPingers = parseInt(arg.substringFrom("n"))
		}
		else if (arg.startsWith("-p"))
		{
			period = parseInt(arg.substringFrom("p"))
		}
		else if (arg == '-d')
		{
			log.activateDebugMode();
			debug('Debug mode on');
		}
		else
		{
			error('Usage: client [-n][numberofpingers] [-p][period]');
			return;
		}
	}
}

/**
 * Create one pinger with the given period
 */
function createPinger()
{
	debug("Creating new pinger");
	var p = new pinger();
	p.start(period);
}

/**
 * Create pingers
 */
for (var i=0; i<numberOfPingers; i++)
{
		setTimeout(createPinger, 500 * i);
}

