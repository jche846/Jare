/*!
 * FullCalendar v2.2.5 UoA Calendar Plugin
 * (c) 2015 University of Auckland
 */

function uoaCalendar(element, options) {
	/*
	eventType = options.eventType; // TODO more checking

	var events = options.events;
	var uoaCalendarHost = options.uoaCalendarHost;
	var uoaCalendarPort = options.uoaCalendarPort;
	//var url = sourceOptions.url;
*/

	var stdFields = ['title', 'description', 'location', 'summary', 'start', 'end', 'status', 'reminder', 'todo', 'allDay', 'url'];

	// Create the REST client with the provided options



	function addDialogForm(newEvent) {


	}


	console.log("datetimepickers called")
	jQuery("#start").datetimepicker({
		format:'d.m.Y H:i',
		step:30
	}
	);
	jQuery("#end").datetimepicker({
		format:'d.m.Y H:i',
		step:30
	});
	jQuery("#edit-start").datetimepicker({
		format:'d.m.Y H:i',
		step:30
	});
	jQuery("#edit-end").datetimepicker({
		format:'d.m.Y H:i',
		step:30
	});


	function addEvent(){
		var msg = {};
		var s = getSourceOptions();
		var eventType = options.eventType;
		var events = options.events;

		for (builtinField in stdFields) {
			msg[stdFields[builtinField]] = $("#" + stdFields[builtinField]).val();
		}

		msg['todo'] = $('#todo:checked').val() ? true : false;
		msg['allDay'] = $('#allDay:checked').val() ? true : false;

		if ($.inArray("start", stdFields)) {
			if ('' == msg['start']) {
				delete msg['start'];
				delete event['start'];
				delete event['_start'];
			} else {
				msg['start'] = $.fullCalendar.moment.utc(msg['start'],'DD.MM.YYYY HH:mm').format();
			}
		}

		if ($.inArray("end", stdFields)) {
			if ('' == msg['end']) {
				delete msg['end'];
				delete event['end'];
				delete event['_end'];
			} else {
				msg['end'] = $.fullCalendar.moment.utc(msg['end'],'DD.MM.YYYY HH:mm').format();
			}
		}
		console.log(msg);
		client.addEvent(events.uoaCalendarId, msg,
			function(res, data) {
				calendar.fullCalendar('renderEvent', data);
			},
			function(res, data) {
				alert("Failed to add event");
			}
		);

		dialog.dialog( "close" );
		return true;
	}


	dialog = $( "#dialog-form" ).dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: {
			"Create an event": addEvent,
			Cancel: function() {
				dialog.dialog( "close" );
			}
		},
		close: function() {
			form[0].reset();
		}
	});

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		addEvent();
	});


	function updateEvent(){
		var event = edit_dialog.event;
		var s = getSourceOptions();
		var eventType = options.eventType;
		var events = options.events;
		var msg= {}; // msg only for Django, event contains extra stuff for fullCalendar

		for (builtinField in stdFields) {
			msg[stdFields[builtinField]] = $("#edit-" + stdFields[builtinField]).val();
		}

		msg['todo'] = $('#edit-todo:checked').val() ? true : false;
		msg['allDay'] = $('#edit-allDay:checked').val() ? true : false;

		if ($.inArray("start", stdFields)) {
			if ('' == msg['start']) {
				delete msg['start'];
				delete event['start'];
				delete event['_start'];
			} else {
				msg['start'] = $.fullCalendar.moment.utc(msg['start'],'DD.MM.YYYY HH:mm').format();
			}
		}

		if ($.inArray("end", stdFields)) {
			if ('' == msg['end']) {
				delete msg['end'];
				delete event['end'];
				delete event['_end'];
			} else {
				msg['end'] = $.fullCalendar.moment.utc(msg['end'],'DD.MM.YYYY HH:mm').format();
			}
		}

		$.extend(event, msg);

		client.updateEvent(events.uoaCalendarId, event._id, msg,
			function(res, data) {
				calendar.fullCalendar('updateEvent', event);
			},
			function(res, data) {
				alert("Failed to update event");
			}
		);

		edit_dialog.dialog( "close" );
		return true;
	}



	function deleteEvent(){
		var event = edit_dialog.event;
		var events = options.events;
		var s = getSourceOptions();

		client.deleteEvent(events.uoaCalendarId, event._id,
			function(res, data) {
				calendar.fullCalendar('removeEvents',event._id);
			},
			function(res, data) {
				alert("Failed to delete event");
			}
		);

		edit_dialog.dialog( "close" );
		return true;
	}

	edit_dialog = $( "#edit-dialog-form" ).dialog({
		autoOpen: false,
		width: 400,
		modal: true,
		buttons: {
			"Update event": updateEvent,
			"Delete": deleteEvent,
			Cancel: function() {
				edit_dialog.dialog( "close" );
			}
		},
		close: function() {
			form[0].reset();
		}
	});

	edit_form = edit_dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		updateEvent();
	});




	options.selectable = true;
	options.selectHelper = true;
	options.editable = true;

	options.eventDrop = options.eventResize = function(event, delta, revertFunc) {
		var s = getSourceOptions();

	    var data = {}

		for (builtinField in stdFields) {
			data[stdFields[builtinField]] = event[stdFields[builtinField]];
		}

		data.start = event.start.format("YYYY-MM-DD[T]HH:mm:ss");
		data.end =
(null==event.end)?null:event.end.format("YYYY-MM-DD[T]HH:mm:ss");
		if (null == event.end) {
			delete event.end;
			delete event._end;
			delete data.end;
		}

		client.updateEvent(s.uoaCalendarId, event._id, data,
			function(res, data) {
				calendar.fullCalendar('updateEvent', event);
			},
			function(res, data) {
				alert("Failed to update event");
				revertFunc();
			}
		);
	};


	options.eventClick = function(event) {
		console.log(event);
		if (event.url && confirm("Do you want to open " + event.url + " ?")) {
			window.open(event.url, "_blank");
		} else {
			edit_dialog.event = event;
			for (builtinField in stdFields) {
				$("#edit-" + stdFields[builtinField]).val(event[stdFields[builtinField]]);
			}


			event["todo"] ? $('#edit-todo').prop('checked', true) : $('#edit-todo').prop('checked', false);
			event["allDay"] ? $('#edit-allDay').prop('checked', true) : $('#edit-allDay').prop('checked', false);

			if(null!=event.start) {
				$( "#edit-start" ).val(event.start.format('DD.MM.YYYY HH:mm'));
			}
			if(null!=event.end) {
				$( "#edit-end" ).val(event.end.format('DD.MM.YYYY HH:mm'));
			}
			edit_dialog.dialog( "open" );
		}
		return false;
	};

	options.select = function(start, end, jsEvent, view) {
		dialog.start = start;
		dialog.end = end;
		dialog.allDay = !(start.hasTime());
		dialog.dialog( "open" );
		calendar.fullCalendar('unselect');
	};

	options.eventLimit = true; // allow "more" link when too many events


	options.loading = function(bool) {
		$('#loading').toggle(bool);
	};
	calendar = $(element).fullCalendar(options);

	var clientOptions = {};

	if(options.events.uoaCalendarHost) clientOptions.host = options.events.uoaCalendarHost;
	if(options.events.uoaCalendarPort) clientOptions.port = options.events.uoaCalendarPort;
	if(options.events.uoaCalendarApiToken) clientOptions.apiToken = options.events.uoaCalendarApiToken;

	var client = new UoACalendarClient(clientOptions);
}
