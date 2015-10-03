Overview
========

The UoACalendar system consists of a backend, which hosts your calendars, and a frontend which is the calendar displayed in your website.
To facilitate the implementation of your calendar, we provide the bower javascript module **fullcalendar-uoa-ui**, which has the basic calendar functionality and is ready to go.  
Alternatively, you can use this module as a template, and implement your own with extra features.  In this case, you can make use of the base libraries **fullcalendar** and **uoacalendar**.

Getting your API token and making new calendars
---------------------------------------------

First, you need to log into the the backend on your browser:

http://diaryapi.auckland.ac.nz

with your UPI and password.

Then on the top right corner of the menu bar, click on your email address, and then click "API Token" in the dropdown menu. 
You will see your unique API token in a green box (about 100+characters), which you use in your website.  Take a copy of this.

The next step is to create a new calendar.  Click the calendar icon on the top left side of the menu bar, and then click  "+ New calendar" on the dropdown menu.
Type the name for your new calendar, and click "create".  Then the calendar is created, and you will be switch to this new calendar.

On the url field of your web browser, a link to your calendar will be displayed, such as:

http://diaryapi.auckland.ac.nz/?calendar=20

In the above case, the value of calendar is 20, which is the calendar ID for your new calendar.  Write it down, as you need to specify it in your website.

In the calendar dropdown menu, you can also switch to a different calendar or delete a calendar.

To list all calendars you have, visit:

http://diaryapi.auckland.ac.nz/calendars/

And to list all events in a given calendar, visit:

    http://diaryapi.auckland.ac.nz/calendars/   _____calendar_ID _____/events/
    eg http://diaryapi.auckland.ac.nz/calendars/20/events/

Finally, you can find the API of the backend at:

http://diaryapi.auckland.ac.nz/docs/

After getting your API key and calendar ID, you can start working on your website.


Setting up a calendar in your website
-------------------------------------

First, download the zipfile at:
 
https://github.com/UoA-CompSci/fullcalendar-uoa-ui/raw/master/scripts.zip

Then in the Windows Explorer, or a similar file manager, move the file to the directory containing your HTML code, and double click the file.  Then unzip the file into the directory containing the HTML code.

You will also find **simple.html**, which shows you how to use the basic functions of the calendar.

Now you can follow the instructions at:

https://github.com/UoA-CompSci/fullcalendar-uoa-ui/blob/master/README.md

to get your calendar working on the website.

If you want to modify the calendar or add functionality, you can consult the **fullcalendar** API:

http://fullcalendar.io/docs/
