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
  
    this.idList = [];
  
    // TODO - prob don't need
    //this.dataEntry; // user data entry
}

function getGoalIndexFromArray(goal)
{
    for (var i = 0; i < goals.length; i++) {
        if (goals[i].title.localeCompare(goal.title) == 0) {
            return i;
        }
    }
    return -1; // not found
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
  
    var isUniqueTitle = addGoal(goal);
  
    if (isUniqueTitle) {
        addGoalEvent(goal);
        goals.push(goal);
    }
}

// add to goal list local
function addGoal(goal) {
    var success = false;
  
    // check if goal title already exists
    var titleExists = false;
    var index = getGoalIndexFromArray(goal);
    
    if (index != -1) {
        titleExists = true;
    }
    
    if (titleExists) {
//        // actually nvm too many problems associated with updating a goal
//        if (new Date() > sameGoal.end) { // so the same goal was completed already and can be replaced
//            // TODO delete?
//        }
        alert("Goal title already exists! Choose another title");
    } else {
        success = true;
        alert("Goal created/added!");
    }
  
    return success;
}

function addGoalEvent(goal) {
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
                goal.idList.push(data.id);
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
}

// args: goal obj from server that is to be deleted
function deleteGoalClick(goal) {
    deleteGoalEvent(goal.id);
    deleteGoal(goal);
}

// local delete
function deleteGoal(goal) {
    var success = false;
  
    var index = getGoalIndexFromArray(goal);
    
    if (index != -1) {
        delete goals[index];
        success = true;
    }
    
    if (success) {
        alert("Goal deleted!");
    } else {
        alert("Error deleting goal");
    }
    return success;
}

function deleteGoalEvent(eventId)
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

// update goal based on a change in the end date
// TODO change the fields as well
function updateGoalClick(oldGoal, title, description, start, end) {
  
    updatedGoal = new Goal(title, description, null, null, start, end);
  
    var index = getGoalIndexFromArray(oldGoal);
    
    if (updatedGoal.end > oldGoal.end) { // goal has its end date extended so add more events
        // goal is split daily so it occupies a slot for each day until its end date
        var startDate = new Date(oldGoal.end); // TODO maybe +1 day
        while (startDate <= updatedGoal.end) {

            client.addEvent(calendarID, { title: updatedGoal.title, start: startDate, description: updatedGoal.description, status: updatedGoal.dataEntryType, location: updatedGoal.comboBoxFields },

                /**
                 * onSuccess callback
                 * @param res: response
                 * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
                 */
                function(res, data) {
                    console.log(res);
                    console.log(data);
                    alert('Succeeded. Event id: ' + data.id);
                    goals[index].idList.push(data.id);
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
    } else if (updatedGoal.end < oldGoal.end) { // goal has its end date shortened so delete those extra events
        var today = new Date();
        var idList = oldGoal.idList;
        for (var i = 0; i < idList.length; i++) {
            client.getEvent(calendarID, idList[i],
                /**
                * onSuccess callback
                * @param res: response
                * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
                */
                function(res, data) {
                    console.log(res);
                    console.log(data);
                    alert('Succeeded. Event id: ' + data.id);

                    if (data.start > updatedGoal.end) { // this goal event is latter
                        deleteGoalEvent(data.id);
                        delete goals[index].idList[i];
                    } else if (data.start >= today && data.start < updatedGoal.end) { // this goal event is before
                        // now update the goals from today's date to updatedGoal.end
                        client.updateEvent(calendarID, idList[i], { title: updatedGoal.title, start: data.start, description: updatedGoal.description },
                            /**
                            * onSuccess callback
                            * @param res: response
                            * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
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
                                alert('Failed to update data entry');
                            }
                        );
                    }
                },

                /**
                * onError callback
                * @param res: response
                */
                function(res, data) {
                    alert('Failed to get event');
                }
            );
        }
    }
  
    // update the local oldGoal fields to updated
    goals[index].title = updatedGoal.title;
    goals[index].description = updatedGoal.description;
    goals[index].end = updatedGoal.end;
}

// update local TODO deprecated
//function updateGoal(oldGoal, updatedGoal) {
//    var success = false;
//    
//    var addedGoal = addGoal(updatedGoal);
//    if (addedGoal)
//        success = deleteGoal(oldGoal);
//  
//    if (success) {
//        alert("Goal updated!");
//    } else {
//        alert("Error updating goal");
//    }
//    return success;
//}

// goal is the goal data from the server
// dataEntry is from the client input
function updateDataEntryClick(goal, dataEntry) {
    if (goal.start.getDate() == new Date().getDate()) {
        updateDataEntry(goal, dataEntry);
    } else {
        alert("You may only input data for today's goals!");
    }
}

// update data entry for today
function updateDataEntry(goal, data) {  
    client.updateEvent(calendarID, goal.id, { title: goal.title, start: goal.start, summary: dataEntry },
        /**
        * onSuccess callback
        * @param res: response
        * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
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
            alert('Failed to update data entry');
        }
    );
}