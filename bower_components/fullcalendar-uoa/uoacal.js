/*!
 * FullCalendar v2.2.5 UoA Calendar Plugin
 * (c) 2015 University of Auckland
 */

var sOptions;

function getSourceOptions() {
	return sOptions;
}
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery' ], factory);
	}
	else {
		factory(jQuery);
	}
})(function($) {

var fc = $.fullCalendar;
var applyAll = fc.applyAll;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

fc.sourceNormalizers.push(function(sourceOptions) {
	var uoaCalendarId = sourceOptions.uoaCalendarId;
	var uoaCalendarHost = sourceOptions.uoaCalendarHost;
	var uoaCalendarPort = sourceOptions.uoaCalendarPort;
	var url = sourceOptions.url;
	var match;

    if(!uoaCalendarHost)
        sourceOptions.uoaCalendarHost = window.location.protocol + '//' + window.location.hostname;
    else if(uoaCalendarHost.substring(0,7) != "https://" && uoaCalendarHost.substring(0,6)!= "http://")
    	sourceOptions.uoaCalendarHost = "http://" + uoaCalendarHost;


    if(!uoaCalendarPort)
        sourceOptions.uoaCalendarPort = 80;

	// Use the Url parameter if none was specified
	if (!uoaCalendarId) {
		uoaCalendarId = getParameterByName('uoaCalendarId');
	}

	if (uoaCalendarId) {

		sourceOptions.uoaCalendarId = uoaCalendarId;
	}
	sOptions = $.extend(sOptions, sourceOptions);
});


fc.sourceFetchers.push(function(sourceOptions, start, end, timezone) {
	if (sourceOptions.uoaCalendarId) {
		var test = transformOptions(sourceOptions, start, end, timezone, this); // `this` is the calendar
		return test;
	}
});


function transformOptions(sourceOptions, start, end, timezone, calendar) {
	var url = sourceOptions.uoaCalendarHost + ':' + sourceOptions.uoaCalendarPort +  '/calendars/' + sourceOptions.uoaCalendarId + '/find_events/'; // jsonp
	var apiKey = sourceOptions.uoaCalendarApiToken || calendar.options.uoaCalendarApiToken;
	var success = sourceOptions.success;
	var data;
	var timezoneArg; // populated when a specific timezone. escaped to Google's liking

	function reportError(message, apiErrorObjs) {
		var errorObjs = apiErrorObjs || [ { message: message } ]; // to be passed into error handlers
		var consoleObj = window.console;
		var consoleWarnFunc = consoleObj ? (consoleObj.warn || consoleObj.log) : null;

		// call error handlers
		(sourceOptions.uoaCalendarError || $.noop).apply(calendar, errorObjs);
		(calendar.options.uoaCalendarError || $.noop).apply(calendar, errorObjs);

		// print error to debug console
		if (consoleWarnFunc) {
			consoleWarnFunc.apply(consoleObj, [ message ].concat(apiErrorObjs || []));
		}
	}

	if (!apiKey) {
		console.log("'uoaCalendarApiToken' has not been specified. User authentication won't be sent in the request!");
	}

	// The API expects an ISO8601 datetime with a time and timezone part.
	// Since the calendar's timezone offset isn't always known, request the date in UTC and pad it by a day on each
	// side, guaranteeing we will receive all events in the desired range, albeit a superset.
	// .utc() will set a zone and give it a 00:00:00 time.
	if (!start.hasZone()) {
		start = start.clone().utc().add(-1, 'day');
	}
	if (!end.hasZone()) {
		end = end.clone().utc().add(1, 'day');
	}

	// when sending timezone names to Google, only accepts underscores, not spaces
	if (timezone && timezone != 'local') {
		timezoneArg = timezone.replace(' ', '_');
	}

	data = $.extend({}, sourceOptions.data || {}, {
		startAfter: start.format(),
		endBefore: end.format()
	});

	headers = {'Content-Type': 'application/json; charset=utf-8'}
	if(apiKey)
		$.extend(headers, {'Authorization': 'JWT ' + apiKey });

	return $.extend({}, sourceOptions, {
		headers: headers,
		uoaCalendarId: null, // prevents source-normalizing from happening again
		url: url,
		data: data,
		success: function(data) {
			var events = [];
			var successArgs;
			var successRes;

			if (data.error) {
				reportError('UoA Calendar API: ' + data.error.message, data.error.errors);
			}
			else if (data) {
				$.each(data, function(i, entry) {
					var url = entry.htmlLink;

					// make the URLs for each event show times in the correct timezone
					if (timezoneArg) {
						//url = injectQsComponent(url, 'ctz=' + timezoneArg);
					}

					events.push({
						id: entry.id,
						calendar: sourceOptions.uoaCalendarId,
						title: entry.title,
						description: entry.description,
						location: entry.location,
						summary: entry.summary,
						lastUpdate: entry.lastUpdate,
						start: entry.start, // try timed. will fall back to all-day
						end: entry.end, // same
						status: entry.status,
						reminder: entry.reminder,
						todo: entry.todo,
						allDay: entry.allDay,
						url: entry.url
					});
				});

				// call the success handler(s) and allow it to return a new events array
				successArgs = [ events ].concat(Array.prototype.slice.call(arguments, 1)); // forward other jq args
				successRes = applyAll(success, this, successArgs);
				if ($.isArray(successRes)) {
					return successRes;
				}
			}

			return events;
		}
	});
}


// Injects a string like "arg=value" into the querystring of a URL
function injectQsComponent(url, component) {
	// inject it after the querystring but before the fragment
	return url.replace(/(\?.*?)?(#|$)/, function(whole, qs, hash) {
		return (qs ? qs + '&' : '?') + component + hash;
	});
}


});
