/**
 * Get the weather
 *
 * Add your name to the user var
 */
var http          = require( "http" );
var user          = "Adam";
var currentTime   = new Date().getTime() / 1000;
var date          = "";
var hours         = "";
var minutes       = "";
var seconds       = "";
var formattedTime = "";

/**
 * Convert UNIX timestamp to time
 *
 * @return time int
 */
var theTime = function( time ) {

	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	date = new Date( time * 1000 );
	// Hours part from the timestamp
	hours = date.getHours();
	// Minutes part from the timestamp
	minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	seconds = "0" + date.getSeconds();
	// Will display time in 10:30:23 format
	formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}

/**
 * Sunrise and sunset filter
 *
 * @return time string
 */
var sunTime = function( time, currentTime ) {

	if( hours <= 12 ) {

		var time = "The sunrise is at " + formattedTime + " AM.";

	}

	if( hours > 12 ) {

		formattedTime = hours - 12 + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		var time = "Remember to catch the sunset at " + formattedTime + " PM tonight!";

	}

	return time;
}

/** 
 * Function to print the current weather conditions
 */
var currentWeather = function( temp, wind, user, currentTime ) {

	var ct = function( currentTime ) {

		date = new Date( currentTime * 1000 );
		hours = date.getHours();

		return hours;

	}

	var num   = ct( currentTime );
	var greet = "";

	if( num < 12  ) {

		greet = "Good Morning, ";

	}

	if( num > 11 && num < 17 ) {

		greet = "Good afternoon, ";

	}

	if( num > 16 ) {

		greet = "Good evening, ";

	}

	var greeting = greet + user + "! It's a beautiful day.";
	var weather  = "The current temperature is " + temp + " degrees Fahrenheit. The wind is blowing at " + wind + " mph.";

	console.log( greeting, weather );
}

/**
 * Ping open weather API
 */
var response = http.get( "http://api.openweathermap.org/data/2.5/weather?id=4407010&units=imperial&APPID=980117ded5b9b9d9f7731cba4c1d0957", function( response ) {
	//console.log( response.statusCode );

	//Get body
	var body = "";

	response.on( "data", function( chunk ) {

		body += chunk;

	});

	response.on( "end", function() {

		var conditions = JSON.parse( body );

		//console.log( conditions );

		var wind    = conditions.wind.speed;
		var temp    = conditions.main.temp;
		var sunrise = conditions.sys.sunrise;
		var sunset  = conditions.sys.sunset;
		var sun     = [sunrise, sunset ];

		//Print temp
		currentWeather( temp, wind, user, currentTime );

		for( var i = 0; i < sun.length; i++ ) {

			var time = theTime( sun[i] );

			var st = sunTime( time );

			console.log( st );

		}

	});
});
