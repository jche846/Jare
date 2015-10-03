README
======

This project defines a module for the `fullcalendar` JavaScript library that extends its UI functionality.

You may install this module using bower:

```bash
$ bower install fullcalendar-uoa-ui --save
```

Dependencies
------------

Now you should have all the required js/css files. This includes the standard `fullcalendar.js` and `fullcalendar.css`, in addition to `uoacal.js` and `uoacal-ui.js`.

```
<link href="bower_components/fullcalendar/dist/fullcalendar.css" rel="stylesheet">
<link href="bower_components/fullcalendar/dist/fullcalendar.print.css" rel="stylesheet" media="print">
<link href="bower_components/datetimepicker/jquery.datetimepicker.css" rel="stylesheet">
<link href="bower_components/jquery-ui/themes/redmond/jquery-ui.css" rel="stylesheet">

<script src="bower_components/jquery/dist/jquery.js"></script>
<script src="bower_components/jquery-ui/jquery-ui.js"></script>
<script src="bower_components/moment/moment.js"></script>
<script src="bower_components/datetimepicker/jquery.datetimepicker.js"></script>
<script src="bower_components/fullcalendar/dist/fullcalendar.js"></script>
    
<script src="bower_components/uoacalendar-js/dist/uoacalendar.js"></script>
<script src="bower_components/fullcalendar-uoa/uoacal.js"></script>
<script src="bower_components/fullcalendar-uoa-ui/uoacal-ui.js"></script>
```

Writting the code
------------

It's time to initialize your calendar in JavaScript. You can do so as in this example:

```javascript
    $(document).ready(function() {
        uoaCalendar('#calendar', {
            events: {
                uoaCalendarId: '<YOUR CALENDAR ID>',
                uoaCalendarApiToken: '<YOUR API TOKEN>',
                uoaCalendarHost: 'diaryapi.auckland.ac.nz',
                uoaCalendarPort: '345'
            },
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            }
        });
    });
```

The UoA Calendar can be installed by calling the **uoaCalender(<ELEMENT>, <OPTIONS>)** function.  The first parameter **<ELEMENT>** represents
the ID of the HTML element the calendar belong to; the second parameter **<OPTIONS>** is an object that contains all the options.

The API token needs to be specified in the option **uoaCalendarApiToken**, which can be obtained by:

```bash
$ curl -X POST -d "username=<USERNAME>&password=<PASSWORD>" calendar.auckland.ac.nz:5000/api-token-auth
```

>> Note that this will generate a new token and invalidate your old one if you already have one.

The ID of the current calendar **uoaCalendarId** also needs to be specified in the **events** object, as illustrated in the above example.
 
When custom host and ports were to be used, they can also be specified in **uoaCalendarHost** and **uoaCalendarPort** respectively in the **events** object.
 
Other FullCalendar options can also be specified, and they are documented at:

http://fullcalendar.io/docs/




