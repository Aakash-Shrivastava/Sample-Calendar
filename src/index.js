window.onload = function () {


    window.CurrentCalDate = new Date();
    window.createTable = function (nextdate) {
        var todayDate = new Date();
        var newdate;

        var table = document.createElement("table");
        table.className = "cal-table";

        var tableRow = document.createElement("tr");
        tableRow.setAttribute("id", "table-header");
        table.appendChild(tableRow)

        var emptyTableHeader = document.createElement("th");
        tableRow.appendChild(emptyTableHeader)

        var calendarSection = document.getElementById("calendar");
        calendarSection.appendChild(table);

        for (var i = 0; i < 10; i++) {
            nextdate ? newdate = new Date(nextdate) : newdate = new Date();
            newdate.setHours(nextdate.getHours() + 24 * i);
            var tableHeaderElem = document.createElement('th');

            var convertDateToString = newdate;
            var dayHeader = document.createElement('div');
            dayHeader.classList.add("day-header");
            dayHeader.innerHTML = convertDateToString.toDateString().substr(0, 3);

            convertDateToString = newdate;
            var dateHeader = document.createElement('div');
            dateHeader.classList.add("date-header");
            dateHeader.innerHTML = convertDateToString.toDateString().substr(8, 2);

            convertDateToString = newdate;
            var monthHeader = document.createElement('div');
            monthHeader.classList.add("month-header");
            monthHeader.innerHTML = convertDateToString.toDateString().substr(4, 3);

            tableHeaderElem.appendChild(dayHeader);
            tableHeaderElem.appendChild(dateHeader);
            tableHeaderElem.appendChild(monthHeader);

            tableHeaderElem.className = 'table-header';
            if (todayDate.getDate() == newdate.getDate() && todayDate.getMonth() == newdate.getMonth()) {
                tableHeaderElem.classList.add("color-blue");
            }

            tableRow.appendChild(tableHeaderElem);
        }


        for (var i = 0; i < 24; i++) {
            var tableRow = document.createElement('tr');

            var tableRowElm = document.createElement('th');
            // tableRowElm.setAttribute('class','tuple');
            if (i <= 12) {
                tableRowElm.innerHTML = i + " am";
            } else {
                tableRowElm.innerHTML = (i - 12) + " pm";
            }
            tableRow.appendChild(tableRowElm);
            for (var j = 0; j < 10; j++) {
                var tableRowElm = document.createElement('th');
                tableRowElm.setAttribute('class', 'tuple');
                tableRowElm.onclick = eventCreate;
                tableRowElm.innerHTML = "";
                tableRow.appendChild(tableRowElm);
            }
            table.appendChild(tableRow);
        }
        if (window.localStorage) {
            var existingEvent = localStorage.getItem("eventData");
            if (existingEvent) {
                setEventAtCell(existingEvent, true)
            }
        }
    }
    createTable(new Date());


}

function nextDates(nextdate) {
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";
    var tableHeader = document.createElement('th');
    tableHeader.innerHTML = "";

    CurrentCalDate.setDate(CurrentCalDate.getDate() + 10);
    createTable(new Date(CurrentCalDate));
}

function prevDates(nextdate) {
    var calendar = document.getElementById("calendar");
    calendar.innerHTML = "";
    var tableHeader = document.createElement('th');
    tableHeader.innerHTML = "";

    CurrentCalDate.setDate(CurrentCalDate.getDate() - 10);
    createTable(new Date(CurrentCalDate));
}

function eventCreate(event) {
    var modal = document.getElementById("modal");
    removeClass(document.getElementById("modal"), 'nodisplay');
    addClass(document.getElementById("modal"), 'display');

    var time = event.target.parentElement.innerText.trim();
    var table = document.getElementById('table-header');
    var date = table.children[event.target.cellIndex].textContent.trim().substr(3, 2);
    var day = table.children[event.target.cellIndex].textContent.trim().substr(0, 3);
    var month = table.children[event.target.cellIndex].textContent.trim().substr(5, 3);

    var dateDiv = document.getElementById("dateDiv");
    dateDiv.innerHTML = day + " " + date + " " + month + ", " + time;

    if (window.localStorage) {
        localStorage.setItem("OpenedCellCol", JSON.stringify(event.target.cellIndex));
        localStorage.setItem("OpenedCellRow", JSON.stringify(event.target.parentNode.rowIndex));
    }
    addClass(event.target, 'event1');
}

function submitEvent() {
    var eventName = document.getElementById("title").value;
    var eventDate = document.getElementById("dateDiv").innerHTML.trim();

    var eventGuests = document.getElementById("guest").value;
    if (window.localStorage) {
        var eventCellRow = localStorage.getItem("OpenedCellRow");
        var eventCellCol = localStorage.getItem("OpenedCellCol");
        // var eventData = JSON.parse(localStorage.getItem("eventData"))||[];

    }
    var eventDetails = {
        eventCellRow,
        eventCellCol,
        eventName,
        eventDate,
        eventGuests
    };

    if (window.localStorage) {
        localStorage.setItem("eventData", JSON.stringify(eventDetails));
        setEventAtCell(eventDetails, false);
    }
    closeModal();
}
function setEventAtCell(eventDetails, afterRefresh) {
    if (afterRefresh) {
        var table = document.getElementById('table-header');
        var existingEvent = JSON.parse(eventDetails);

        var tableHeaders = document.getElementsByClassName('table-header')


        //To check if cell to update is there in current table or not. It may not be in this table beacuse on prev and next btn table is populating automatically.
        if (existingEvent.eventDate.substr(4, 6).split(' ').join('') === tableHeaders[+existingEvent.eventCellCol - 1].textContent.substr(3, 5)) {
            var eventNameDiv = document.createElement('div');
            eventNameDiv.innerHTML = existingEvent.eventName;
            eventNameDiv.classList.add('cell-eventName');

            var guestNameDiv = document.createElement('div');
            guestNameDiv.innerHTML = existingEvent.eventGuests;
            guestNameDiv.classList.add('cell-eventGuests');

            var rows = document.getElementsByTagName('tr')
            var cell = rows[+existingEvent.eventCellRow].cells[+existingEvent.eventCellCol];
            cell.appendChild(eventNameDiv).appendChild(guestNameDiv);
        }



    } else {
        var selectedCell = document.getElementsByClassName("event1")[0];
        var eventNameDiv = document.createElement('div');
        eventNameDiv.innerHTML = eventDetails.eventName;
        eventNameDiv.classList.add('cell-eventName');

        var guestNameDiv = document.createElement('div');
        guestNameDiv.innerHTML = eventDetails.eventGuests;
        guestNameDiv.classList.add('cell-eventGuests');
        selectedCell.appendChild(eventNameDiv).appendChild(guestNameDiv);
        removeClass(selectedCell, 'event1');
    }
}
function closeModal() {
    var modal = document.getElementById("modal");
    removeClass(document.getElementById("modal"), 'display');
    addClass(document.getElementById("modal"), 'nodisplay');
    document.getElementById("title").value = "";
    document.getElementById("guest").value = "";
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className = el.className.replace(reg, ' ')
    }
}