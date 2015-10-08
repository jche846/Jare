var client = new UoACalendarClient({ apiToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmlnX2lhdCI6MTQyMjQ5ODk0OSwiZXhwIjoxNDIyNDk5MjQ5LCJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImRldmVsb3BlciIsImVtYWlsIjoidGVzdEBhdWNrbGFuZC5hYy5ueiJ9.7jLkEBovT2HvT2noL4xdIhddaY8wpZpEVYEDHnnNm1Y"});
var calendarID = 77;

// array of existing goals
var goals = [];

// load and store using localStorage
//goals = JSON.parse(localStorage["goals"]);
//localStorage["goals"] = JSON.stringify(goals);

// Goal constructor
function Goal(title, description, dataEntryType, comboBoxFields, start, end) {
    this.title = title; // string
    this.description = description; // string
    this.dataEntryType = dataEntryType; // string
    this.comboBoxFields = comboBoxFields; // string array
    this.start = start; //datetime
    
    // TODO
    if (end == null) {
        // create endDate to be +1? years from now (endless goal)
        end = new Date();
        end.setDate(end.getDate() + 365);
    }
    this.end = end;
  
    this.IDs = [];
  
    // TODO - prob don't need
    //this.dataEntry; // user data entry
}

function getGoalFromArray(title)
{
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].title.localeCompare(goal.title) == 0) {
            return i;
        }
    }
}

function getCalendarClick()
{
	client.getCalendar(calendarID,
			/**
			* onSuccess callback
			* @param res: response
			* @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
			*/
			function(res, data) {
					console.log(res);
					console.log(data);
					calendarID = data.id; //Sign new calendar id to global
					alert('Succeeded. Calendar id: ' + data.id);
			},

			/**
			* onError callback
			* @param res: response
			*/
			function(res, data) {
					alert('Failed to get calendar');
			}
	);
}

function createGoalClick(title, description, dataEntryType, comboBoxFields, start, end) {
  
    // TODO test data
    title = "testing";
    description = "testing description";
    dataEntryType = "combobox";
    start = new Date();
    end = new Date(2015, 9, 10);
    
    var goal = new Goal(title, description, dataEntryType, comboBoxFields, start, end);
  
    // TODO
    //addGoal(goal);
    
    // goal is split daily so it occupies a slot for each day until its end date
    var startDate = start;
    console.log(goal);
    while (startDate <= goal.end) { // TODO if goal end is not specified go +1 year

        client.addEvent(calendarID, { title: goal.title, start: startDate, description: goal.description, status: goal.dataEntryType, location: goal.comboBoxFields },

            /**
             * onSuccess callback
             * @param res: response
             * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
             */
            function(res, data) {
                console.log(res);
                console.log(data);
                alert('Succeeded. Event id: ' + data.id);
                goal.IDs.push(data.id);
            },

            /**
             * onError callback
             * @param res: response
             */
            function(res, data) {
                alert('Failed to add goal');
            }
        );
        // to the next day
        startDate.setDate(startDate.getDate() + 1);
    }
    
    goals.push(goal);
}

// add
function addGoal(goal) {
    var success = false;
  
    // check if goal title already exists
    var titleExists = false;
    var sameGoal = null;
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].title.localeCompare(goal.title) == 0) {
            titleExists = true;
            sameGoal = goals[i];
            break;
        }
    }
    
    if (titleExists) {
        if (new Date() > sameGoal.end) { // so the same goal was completed already and can be replaced
            // TODO delete?
        }
        alert("Goal title already exists! Choose another title");
    } else {
        success = true;
        alert("Goal created/added!");
    }
  
    return success;
}

// args: goal obj from server that is to be deleted
function deleteGoalClick(goal) {
    deleteEvent(goal.id);
    deleteGoal(goal);
}

// delete
function deleteGoal(goal) {
    var success = false;
  
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].title.localeCompare(goal.title) == 0) {
            delete goals[i];
            success = true;
            break;
        }
    }
    
    if (success) {
        alert("Goal deleted!");
    } else {
        alert("Error deleting goal");
    }
    return success;
}

function deleteEvent(eventId)
{
    client.deleteEvent(calendarID, eventId,

        /**
         * onSuccess callback
         * @param res: response
         * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
         */
        function(res, data) {
            console.log(res);
            console.log(data);
            alert('Succeeded. Event id: ' + data.id);
        },

        /**
         * onError callback
         * @param res: response
         */
        function(res, data) {
            alert('Failed to delete event');
        }
    );
}

// update
function updateGoal(oldGoal, updatedGoal) {
    var success = false;
    
    var addedGoal = addGoal(updatedGoal);
    if (addedGoal)
        success = deleteGoal(oldGoal);
  
    /* TODO maybe
    // replace each field one by one
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].title == oldGoal.title) {
            
            success = true;
            break;
        }
    }*/
  
    if (success) {
        alert("Goal updated!");
    } else {
        alert("Error updating goal");
    }
    return success;
}

// update data entry for today
function updateDataEntry(goal, data) {
    var success = false;
  
    // The API expects an ISO8601 datetime with a time and timezone part.
    // check if data for goal is TODAY (just need date, not time)
    if (goal.startDate.getDate() == new Date().getDate()) { // TODO
        goal.dataEntry = data;
        success = true;
    }
  
    if (success) {
        alert("Data entry updated!");
    } else {
        alert("Error updating data entry");
    }
    return success;
}