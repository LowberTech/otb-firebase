// make sure to export your FUNCTIONS

export function showLogin() {
    const loginForm = document.getElementById('login')
    const signupForm = document.getElementById('signup')
    const resetForm = document.getElementById('reset')

    loginForm.classList.remove("d-none")
    signupForm.classList.add("d-none")
    resetForm.classList.add("d-none")

    document.getElementById('loginMessage').innerHTML = ""
}

export function showCreate() {
    const loginForm = document.getElementById('login')
    const signupForm = document.getElementById('signup')
    const resetForm = document.getElementById('reset')

    loginForm.classList.add("d-none")
    signupForm.classList.remove("d-none")
    resetForm.classList.add("d-none")

    // document.getElementById('signupMessage').innerHTML = ""
}

export function showReset() {
    const loginForm = document.getElementById('login')
    const signupForm = document.getElementById('signup')
    const resetForm = document.getElementById('reset')

    loginForm.classList.add("d-none")
    signupForm.classList.add("d-none")
    resetForm.classList.remove("d-none")

    // document.getElementById('signupMessage').innerHTML = ""
}

export function acceptWaiver() {

    let docData = {
        waiver: true
    }

    updateDoc(doc(db,"users", userData.id), docData).then(() => {
        window.location.replace('main.html?id=' + userData.id)
    })
}

export function toggleSidebar() {
    let sb = document.getElementById("sidebar")
    sb.classList.toggle('d-none')
}

export function setDateTime(startRow) {
    let dateTimeRow = document.createElement('div')
    dateTimeRow.classList.add('row')

    let dateCol = document.createElement('div')
    dateCol.classList.add('col-6','my-2')
    let dateLbl = document.createElement('label')
    dateLbl.setAttribute('for','eventDates')
    dateLbl.classList.add('control-label')
    dateLbl.innerHTML = "Date"
    let dateInput = document.createElement('input')
    dateInput.classList.add('form-control')
    dateInput.required = true
    dateInput.setAttribute('type','date')
    dateInput.setAttribute('title','eventDates')
    dateInput.setAttribute('name','eventDates[]')

    let timeCol = document.createElement('div')
    timeCol.classList.add('col-6','my-2')
    let timeLbl = document.createElement('label')
    timeLbl.setAttribute('for','eventTimes')
    timeLbl.classList.add('control-label')
    timeLbl.innerHTML = "Time"
    let timeInput = document.createElement('input')
    timeInput.classList.add('form-control')
    timeInput.required = true
    timeInput.setAttribute('type','time')
    timeInput.setAttribute('title','eventTimes')
    timeInput.setAttribute('name','eventTimes[]')

    startRow.append(dateTimeRow)
    dateTimeRow.append(dateCol, timeCol)
    dateCol.append(dateLbl, dateInput)
    timeCol.append(timeLbl, timeInput)
}

export function createEvents(startDiv, events, userData) {
    events.forEach((event) => {
        // EVENT ROW (eventRow, eventCol)
        let eventRow = document.createElement('div');
        eventRow.classList.add('row','event','my-3');
        eventRow.setAttribute('id',event.id);

        if (event.userId == userData.id) {
            eventRow.classList.add('eventOwner');
        } else {
            eventRow.classList.add('eventRow');
        }

        let eventCol = document.createElement('div');
        eventCol.classList.add('col-12');

        startDiv.appendChild(eventRow);
        eventRow.appendChild(eventCol);


        // HEADER ROW (headRow, headCol1, headCol2)
        let headRow = document.createElement('div');
        headRow.classList.add('row','my-1');
        eventCol.appendChild(headRow);

        let headCol1 = document.createElement('div');
        headCol1.classList.add('col-md-6');
        let headCol2 = document.createElement('div');
        headCol2.classList.add('col-md-6');
        headRow.append(headCol1, headCol2);

            // HEADER TEXT/H4 (userH4, sportH4)
            let userRef = document.createElement('a');
            userRef.classList.add('text-decoration-none','text-dark');
            userRef.setAttribute('href','profile.html?id=' + userData.id + '&profileId=' + event.userId);
            headCol1.appendChild(userRef);

            let userH4 = document.createElement('h4');
            userH4.classList.add('fw-bold');
            userH4.innerHTML = event.username;
            userRef.appendChild(userH4);

            let sportH4 = document.createElement('h5');
            sportH4.innerHTML = event.sport.charAt(0).toUpperCase() + event.sport.slice(1) + " " + event.level.charAt(0).toUpperCase() + event.level.slice(1);
            sportH4.classList.add('text-md-end');
            headCol2.appendChild(sportH4);


        // BODY ROW (bodyRow1, descCol, descP, bodyRow2,dateTime)
        let bodyRow1 = document.createElement('div');
        bodyRow1.classList.add('row');
        eventCol.appendChild(bodyRow1);

        let descCol = document.createElement('div');
        descCol.classList.add('col-12');
        bodyRow1.append(descCol);

        let descPar = document.createElement('div');
        descPar.classList.add('p');
        descPar.innerHTML = event.description + "<br><span class='fst-italic'>" + event.location + '</span>';
        descCol.append(descPar);
        
            
        // ATTENDANCE
        let bodyRow2 = document.createElement('div');
        bodyRow2.classList.add("row","my-2");
        descCol.append(bodyRow2);

        let row2Col1 = document.createElement('div');
        row2Col1.classList.add('col-6');
        row2Col1.innerHTML = 'Open: ' + event.availability;
        let row2Col2 = document.createElement('div');
        row2Col2.classList.add('col-6','text-end');
        row2Col2.innerHTML = 'Going: ' + event.attending;
        bodyRow2.append(row2Col1,row2Col2);       

        // DATETIMES
        let tbRow = document.createElement('div');
        tbRow.classList.add("row");

        let tableDiv = document.createElement('div');
        tableDiv.classList.add('table-responsive');

        let table = document.createElement('table');
        table.classList.add('table','table-bordered');

        let tHead = document.createElement('thead');
        let tBody = document.createElement('tbody');
        
        eventCol.appendChild(tbRow);
        tbRow.appendChild(tableDiv);
        tableDiv.appendChild(table);
        table.append(tHead, tBody);

            // DATES TEXT (trHead, th1, th2, trBody, td1, td2)
            let trHead = document.createElement('tr');
            let th1 = document.createElement('th');
            th1.innerHTML = "Date";
            let th2 = document.createElement('th');
            th2.innerHTML = "Time";
            
            tHead.appendChild(trHead);
            trHead.append(th1,th2);

            event.dateTimes.forEach((sched) => {
                let date = sched.toDate();

                let trBody = document.createElement('tr');

                let td1 = document.createElement('td');
                td1.innerHTML = date.toDateString();

                let td2 = document.createElement('td');
                td2.innerHTML = date.toLocaleTimeString();

                tBody.appendChild(trBody);
                trBody.append(td1, td2);
            });

        // FOOTER
        let btnRow = document.createElement('div');
        btnRow.classList.add('row');
        eventCol.append(btnRow);

        // ACTION BUTTON
        let actionDiv = document.createElement('div');
        actionDiv.classList.add('col-4');
        let actionBtn = document.createElement('a');
        actionBtn.classList.add('btn', 'btn-sm', 'my-1','btn-primary');
        actionDiv.append(actionBtn);

        // FOLLOW BUTTON
        let followDiv = document.createElement('div');
        followDiv.classList.add('col-4');
        let followBtn = document.createElement('a');
        followBtn.classList.add('btn', 'btn-sm', 'my-1','btn-outline-secondary');
        followBtn.innerHTML = 'Follow';
        followBtn.setAttribute('onClick',"follow('" + event.userId + "','"+ event.username + "')");
        followDiv.append(followBtn);

        // BENCH BUTTON
        let benchDiv = document.createElement('div');
        benchDiv.classList.add('col-4');
        let benchBtn = document.createElement('a');
        benchBtn.classList.add('btn', 'btn-sm', 'my-1','btn-outline-dark');
        benchBtn.innerHTML = 'Bench';
        benchBtn.setAttribute('onClick',"bench('"+ event.userId + "','"+ event.username + "')");
        benchDiv.append(benchBtn);

        // EDIT/VIEW BUTTON
        let editViewDiv = document.createElement('div');
        editViewDiv.classList.add('col-12');
        let editViewhBtn = document.createElement('a');
        editViewhBtn.classList.add('btn', 'btn-sm', 'my-1','btn-outline-primary');
        editViewhBtn.innerHTML = 'Edit/View';
        editViewhBtn.setAttribute("href","event.html?id=" + userData.id + "&event=" + event.id);
        editViewDiv.append(editViewhBtn);

        // SET ACTION BUTTON 
        if (event.type == "public") {
            actionBtn.innerHTML = "Join";
            actionBtn.setAttribute('onClick',"joinEvent('" + event.id + "')");
        } else {
            actionBtn.innerHTML = "Send request";
            actionBtn.setAttribute('onClick',"sendRequest('" + event.id + "')");
        }

        // SET FOOTER BUTTONS
        if (event.userId == userData.id) {
            btnRow.appendChild(editViewDiv);
        } else {
            btnRow.append(actionDiv, followDiv, benchDiv);
        }

    })
}

export function addDateTime() {
    let c = 1
    if (c < 7) {
        let dateTimesDiv = document.getElementById('dateTimesDiv')

        let row = document.createElement("div")
        row.classList.add('row')

        let col1 = document.createElement("div")
        col1.classList.add('col-6','my-2')
        let col2 = document.createElement("div")
        col2.classList.add('col-6','my-2')

        let dateInput = document.createElement("input")
        dateInput.classList.add("form-control")
        dateInput.setAttribute("type","date")
        dateInput.setAttribute("title","eventDates")
        dateInput.setAttribute("name","eventDates[]")

        let timeInput = document.createElement("input")
        timeInput.classList.add("form-control")
        timeInput.setAttribute("id","eventTimes")
        timeInput.setAttribute("type","time")
        timeInput.setAttribute("title","eventTimes")
        timeInput.setAttribute("name","eventTimes[]")

        dateTimesDiv.appendChild(row)
        row.append(col1, col2)
        col1.appendChild(dateInput)
        col2.appendChild(timeInput)

        c++
    }
}

export function deleteDateTime() {
    let dateTimes = document.getElementById('dateTimesDiv').getElementsByClassName('row')

    for (let i=0; i < dateTimes.length; i++) {
        if (i != 0 && i == dateTimes.length - 1) {
            dateTimes[i].remove()
        }            
    }        
}

export function searchEvents() {
    let searchInput = document.getElementById('search')
    let input = searchInput.value.toLowerCase()
    let events = document.getElementsByClassName('event');

    for (let i=0; i < events.length; i++) {
        if( events[i].innerText.toLowerCase().includes(input)) {
            events[i].style.display = "block"
        } else {
            events[i].style.display = "none"
        }
    }
}


export function goNext(stepId) {
    let activeStep = document.getElementById(stepId);
    activeStep.classList.add("d-none");
    let nextId;

    switch (stepId) {
        case "step1":
            nextId = "step2";
        break;
        case "step2":
            nextId = "step3";
        break;
        case "step3":
            nextId = "step4";
        break;
    }

    let nextStep = document.getElementById(nextId);
    nextStep.classList.remove("d-none");
}

export function goBack(stepId) {
    let activeStep = document.getElementById(stepId);
    activeStep.classList.add("d-none");
    let backId;

    switch (stepId) {
        case "step2":
            backId = "step1";
        break;
        case "step3":
            backId = "step2";
        break;
        case "step4":
            backId = "step3";
        break;
    }

    let backStep = document.getElementById(backId);
    backStep.classList.remove("d-none");
}
