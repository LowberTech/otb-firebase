// *********************************************************************************************** //
// BEGIN INITIALIZATION
// *********************************************************************************************** //

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../src/css/custom.css';

import { initializeApp } from 'firebase/app';
import { 
    getFirestore, collection, addDoc, setDoc, updateDoc, getDoc, serverTimestamp, onSnapshot, doc,
    query, where, getDocs, orderBy, Timestamp, increment, documentId
} from 'firebase/firestore';

import { 
    getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword, sendPasswordResetEmail
} from 'firebase/auth'

import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";

import { 
    showCreate, showLogin, showReset, acceptWaiver, toggleSidebar, setDateTime, addDateTime,
    deleteDateTime, createEvents, searchEvents, goNext, goBack
} from './app/app';

const firebaseConfig = require('./app/config');

// INITILIZE
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// FIREBASE CLOUD MESSAGING
let messageToken;
// Check if browser supports all APIs
async function checkBrowser() {
    let supported = await isSupported();

    if (supported) {
        let messaging = getMessaging();
        messageToken = await getToken(messaging, {vapidKey: 'BLJ1Xu9vWjpuuXTkxSQTz7qjIiv2HzzhgQjd-cHT6zsASns5bx_2Yrwm9icu_h0dkU8gLf2yUS-ajuRw4Kex-HI'});       
    } else {
        messageToken = "unsupported";
    }

    return messageToken;
}

messageToken = await checkBrowser();

// RECEIVING FOREGROUND MESSAGES
// onMessage(messaging, (payload) => {
//     console.log('Message received', payload);
// });

// RECEIVING BACKGROUND MESSAGES



var body = document.body
body.style.display = "block"
var url = new URL(window.location.href)
var loc = window.location.pathname;
var today = new Date();

// *********************************************************************************************** //
// END INITIALIZATION
// *********************************************************************************************** //



// *********************************************************************************************** //
// BEGIN INDEX
// *********************************************************************************************** //
const indexPage = document.getElementById('index')
if (indexPage) {
    // LOAD APP.JS FUNCTIONS
    window.showCreate = showCreate;
    window.showLogin = showLogin;
    window.showReset = showReset;
    window.goNext = goNext;
    window.goBack = goBack;

    // VALIDATE SIGN UP
    let unInput = document.getElementById("un");
    unInput.addEventListener("input", function() {
        let un = unInput.value;

        let nextBtn = document.getElementById("nextBtn1");
        nextBtn.classList.add("disabled");

        let unError = document.getElementById("unError");
        unError.innerHTML = "";
        unError.classList.add("d-none");

        // LENGTH
        if ( un.length < 5 ) { unError.innerHTML = "minimum character required"; }

        // SPECIAL CHARACTER
        const specialChars = `\`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`;
        specialChars.split('').some(specialChar => {
            if (un.includes(specialChar)) {
                unError.innerHTML = "username cannot contain special characters";
                unError.classList.remove("d-none");
            }
        });

        // FIRST CHARACTER
        let firstChar = un.charAt()
        const numbers = "123456789";
        numbers.split('').some(number => {
            if (firstChar == number) {
                unError.innerHTML = "first character cannot be a number";
                unError.classList.remove("d-none");
            }
        });
    });

    unInput.addEventListener("change", function() {
        let un = unInput.value;

        let nextBtn = document.getElementById("nextBtn1");
        nextBtn.classList.add("disabled");

        var unError = document.getElementById("unError");
        unError.innerHTML = "";
        unError.classList.add("d-none");

        // USERNAME EXISTANCE
        let userDoc = query(collection(db, 'users'), where("username","==", un));
        async function validateUsername() {
            let result = "";

            await getDocs(userDoc).then((snap) => {
                snap.docs.forEach((doc) => { 
                    result = doc.data().username
                });
            });

            if (result) {
                unError.innerHTML = "username unavailable";
                unError.classList.remove("d-none");
            } else {
                nextBtn.classList.remove("disabled");
            }
        }

        validateUsername();
    });

    // VALIDATE BIRTH DATE
    let dobInput = document.getElementById("dob");
    dobInput.addEventListener("input", function() {
        let dob = new Date(dobInput.value);

        let today = new Date();
        today.setFullYear(today.getFullYear() - 16);
    
        let nextBtn = document.getElementById("nextBtn2");
        nextBtn.classList.add("disabled");
    
        let dobError = document.getElementById("dobError");
        dobError.innerHTML = "";
        dobError.classList.add("d-none");
    
        if (dob > today) {
            dobError.innerHTML = "You must be 16 years or older.";
            dobError.classList.remove("d-none");
        }
    
        if (dobError.innerHTML == "") { nextBtn.classList.remove("disabled"); }
    });

    // VALIDATE ZIP
    let zipInput = document.getElementById("zip");
    zipInput.addEventListener("input", function() {
        let zip = zipInput.value;

        let zipError = document.getElementById("zipError");
        zipError.innerHTML = "";
        zipError.classList.add("d-none");

        let nextBtn = document.getElementById("nextBtn3");
        nextBtn.classList.add("disabled");

        let alphabet = "abcdefghijklmnopqrstuvwxyz"
        alphabet.split('').some(letter => {
            if (zip.includes(letter)) {
                zipError.innerHTML = "numeric values only";
                zipError.classList.remove("d-none");
            }
        });

        if (zipError.innerHTML == "") { nextBtn.classList.remove("disabled"); }
    });

    // VALIDATE CREDENTIALS
    let emailInput = document.getElementById("emailAddress");
    emailInput.addEventListener("input", function() {
        let email = emailInput.value;

        let emailError = document.getElementById("emailError");
        emailError.innerHTML = "";
        emailError.classList.add("d-none");

        // EMAIL FORMAT
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) == false) 
        {
            emailError.innerHTML = "invalid email format";
            emailError.classList.remove("d-none");
        }
    });

    let pwdInput = document.getElementById("pwd");
    pwdInput.addEventListener("input", function() {
        let pwd = pwdInput.value;

        let pwdError = document.getElementById("pwdError");
        pwdError.innerHTML = "";
        pwdError.classList.add("d-none");

        if (pwd.length < 7) {
            pwdError.innerHTML = "minimum 7 characters required";
            pwdError.classList.remove("d-none");
        }
        if (pwd.length > 15) {
            pwdError.innerHTML = "character limit reached";
            pwdError.classList.remove("d-none");
        }
    });

    let conInput = document.getElementById("con");
    conInput.addEventListener("input", function() {
        let pwd = pwdInput.value;
        let con = conInput.value;

        let submitBtn = document.getElementById("submitBtn");
        submitBtn.classList.add("disabled");

        let emailError = document.getElementById("emailError");
        let pwdError = document.getElementById("pwdError");
        let conError = document.getElementById("conError");
        conError.innerHTML = "";
        conError.classList.add("d-none");

        if (con.length > 15) {
            conError.innerHTML = "character limit reached";
            conError.classList.remove("d-none");
        }

        if (pwd != con) {
            conError.innerHTML = "password mismatch";
            conError.classList.remove("d-none");
        }

        if (emailError.innerHTML == "" && pwdError.innerHTML == "" && conError.innerHTML == "") {
            submitBtn.classList.remove("disabled");
        }
    })
    

    // SIGN UP
    let signupForm = document.getElementById('signup')
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let email = signupForm.emailAddress.value.toLowerCase();
        let password = signupForm.pwd.value;
        
        let credError = document.getElementById("credError");
        credError.innerHTML = ""

        createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            // create a user doc record
            const docData = {
                userType: signupForm.userType.value,
                username: signupForm.un.value.toLowerCase(),
                firstName: '',
                lastName: '',
                emailAddress: email,
                dateOfBirth: signupForm.dob.value,
                zip: parseInt(signupForm.zip.value),
                updatedDate: serverTimestamp(),
                totalRating: parseInt(0),
                numberOfRates: parseInt(0),
                deviceToken: '',
                waiver: false
            }

            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition((position) => {
                    docData.latitude = position.coords.latitude;
                    docData.longitude = position.coords.longitude;
                    docData.locationDate = serverTimestamp();

                    setDoc(doc(db,"users",cred.user.uid), docData).then(() => {

                        let logMessage = document.getElementById('loginMessage');
                        logMessage.classList.add("text-success");
                        logMessage.innerHTML = "Account created, please login.";
                        signupForm.reset();
                        signupForm.classList.add('d-none');
                        document.getElementById('login').classList.remove('d-none');

                    }).catch((err) => { credError.innerHTML = err; });
                });

            } else {

                setDoc(doc(db,"users",cred.user.uid), docData).then(() => {
                    let logMessage = document.getElementById('loginMessage');
                    logMessage.classList.add("text-success");
                    logMessage.innerHTML = "Account created, please login.";
                    signupForm.reset();
                    signupForm.classList.add('d-none');
                    document.getElementById('login').classList.remove('d-none');
                }).catch((err) => { credError.innerHTML = err; });

            }
        }).catch((err) => {
            credError.innerHTML = err;
        });
    });


    // LOG IN
    let loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        Notification.requestPermission().then((permission) => {
            
            let email = loginForm.email.value;
            let password = loginForm.ps.value;

            if (permission !== 'granted') { alert('Enhance your experience by enabling push notifications in your brower') };

            // UPDATE USER ACCOUNT WITH TOKEN
            signInWithEmailAndPassword(auth, email, password).then((cred) => {

                let update = {deviceToken: messageToken};

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        update = {
                            deviceToken: messageToken,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            locationDate: serverTimestamp()
                        }

                        updateDoc(doc(db,"users",cred.user.uid),update).then(() => {
                            window.location.replace('main.html?id=' + cred.user.uid);
                        });


                    });
                } else {
                    updateDoc(doc(db,"users",cred.user.uid),update).then(() => {
                        window.location.replace('main.html?id=' + cred.user.uid);
                    });
                }
            }).catch((err) => {
                document.getElementById('loginMessage').innerHTML = err;
            });
        });
    });

    // RESET
    let resetForm = document.getElementById('reset')
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault()

        let email = resetForm.emailReset.value
        let m = document.getElementById('resetMessage')

        sendPasswordResetEmail(auth, email).then(() => {
            m.classList.remove("text-danger")
            m.classList.add("text-success")
            m.innerHTML = "Password reset email sent."
        }).catch((err) => {
            m.innerText = err
        })
    })


} else {
    // LOAD APP.JS FUNCTIONS
    window.acceptWaiver = acceptWaiver;
    window.toggleSidebar = toggleSidebar;

    // GET ID (id)
    var id = url.searchParams.get("id")
    if (!id) {
        signOut(auth).then(() => {
            window.location.replace("index.html");
        })        
    }

    // LOG OUT
    let logoutBtn = document.getElementById('logoutBtn')
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.replace("index.html");
        })
    })

    // GET USER (userData)
    var userData;
    async function getUserData(id) {
    
        return await getDoc(doc(db, "users", id)).then((doc) => {
    
            userData = doc.data()
            userData.id = id
    
            return userData
        })
    }
    userData = await getUserData(id);

    // GET USER EVENTS (userEvents)
    var userEvents = [];
    async function getUserEvents(id) {
        let eventsColl = query(collection(db, 'events'), where("userId","==",userData.id), orderBy("creationDate", "desc"));

        return await getDocs(eventsColl).then((snap) => {
            snap.docs.forEach((doc) => {
                
                let add = true

                doc.data().dateTimes.forEach ( datetime => { 
                    if (datetime.toDate() < today) { add = false }
                })

                if (add) { 
                    userEvents.push({ ...doc.data(), id: doc.id }) 
                }
            })

            return userEvents
        })
    }
    userEvents = await getUserEvents(id)
    
    // SET USER EVENT NAVIGATION
    let eventNav = document.getElementById('eventNav')

    userEvents.forEach((event) => {
        let dateTimesArray = [];
        event.dateTimes.forEach((dt) => {
            let d = dt.toDate()
            d = d.toLocaleDateString("en-CA")
            dateTimesArray.push(d)
        })

        dateTimesArray.sort()
        let dateFormat = dateTimesArray[0]

        let sport = event.sport;
        let level = event.level
        let value = dateFormat + " " + sport.charAt(0).toUpperCase() + sport.slice(1) + " - " +  level.charAt(0).toUpperCase() + level.slice(1)

        let li = document.createElement('li')
        li.classList.add('list-group-item')

        let aHref = document.createElement('a')
        aHref.classList.add("calendarBtn")
        aHref.setAttribute('href','event.html?id='+ userData.id + "&event=" + event.id)

        let h4 = document.createElement('h4')
        h4.classList.add('fs-6','py-3','m-0')
        h4.innerHTML = value

        eventNav.appendChild(li)
        li.appendChild(aHref)
        aHref.appendChild(h4)
    })

    // SET SENT AND RECEIVED REQUESTS
    const urRef = doc(db,"userRequests",userData.id)
    const sentColl = collection(urRef,"sent")
    const recColl = collection(urRef,"received")

    function createRequest(type, request) {

        let date = request.creationDate.toDate()
        let timeFormat = date.toLocaleTimeString()
        date = date.toISOString()
        let dateFormat = date.split('T')[0]

        let startDate = request.startDate.toDate()
        startDate = startDate.toISOString()
        let startDateFormat = startDate.split('T')[0]

        let sport = request.sport;
        let li = document.createElement('li')
        li.classList.add('list-group-item','py-2')
        if (request.read == false) {
            li.classList.add('new-request')
        }
        let aHref = document.createElement('a')
        aHref.classList.add("notiBtn")

        // console.log(type, typeof request.id)
        let nav
        switch (type) {
            case "sent":
                nav = document.getElementById('sentReq')
                // let href = 'main.html?id=' + userData.id + "#" + request.id
                aHref.setAttribute('href','main.html?id=' + userData.id + "#" + request.id)
            break
            case "received":
                nav = document.getElementById('recReq')
                aHref.setAttribute('href','event.html?id='+ userData.id + "&event=" + request.eventId)
            break
        }

        let h4 = document.createElement('h4')
        h4.classList.add('fs-6','p-0','m-0')
        if (request.status == "sent" || request.status =="new") {
            h4.innerHTML = request.username + " ( " + dateFormat + " " + timeFormat + " )"
        } else {
            h4.innerHTML = request.username + " ( " + request.status + " )"
        }

        let p = document.createElement('p')
        let value = sport.charAt(0).toUpperCase() + sport.slice(1) + " on " + startDateFormat
        p.classList.add('fs-6','p-0','m-0','text-dark')
        p.innerHTML = value

        let p2 = document.createElement('p')
        p2.classList.add('fs-6','p-0','m-0','text-dark')
        p2.innerHTML = request.location

        nav.appendChild(li)
        li.appendChild(aHref)
        aHref.append(h4, p, p2)
    }

    // SENT
    onSnapshot(sentColl, (snap) => {        
        let listItem = document.querySelectorAll('#sentReq li')
        for (let i=0; i < listItem.length; i++) {
            listItem[i].remove()
        }

        let sentRequests = [];
        let sentCount = 0;
        
        snap.forEach((sent) => {
            if (sent.data().startDate.toDate() > today) {
                sentRequests.push({ ...sent.data(), id: sent.id})
            }            
        })

        sentRequests = sentRequests.sort((a, b) => {
            if (a.createDate > b.createDate) {
                return 1
            } else {
                return -1
            }
        });

        sentRequests.forEach((record) => {
            // console.log(record.startDate);
            createRequest("sent", record);
            if (record.read == false) { sentCount++; }
        })

        if (sentCount > 0) {
            let sentCountSpan = document.getElementById('sentCount');
            sentCountSpan.classList.remove('d-none');
            sentCountSpan.innerHTML = sentCount;
        }
    })

    // RECEIVED
    onSnapshot(recColl, (snap) => {
        // DELETE EVERYTHING IN THE UL LIST
        let listItem = document.querySelectorAll('#recReq li')
        for (let i=0; i < listItem.length; i++) {
            listItem[i].remove()
        }
        // CREATE UL LIST
        let recRequests = [];
        let recCount = 0;

        snap.forEach((received) => {
            if (received.data().status != "declined" && received.data().status != "cancelled" && received.data().startDate.toDate() > today) {
                recRequests.push({ ...received.data() })
            }
        })

        recRequests.forEach((record) => {
            createRequest("received", record)
            if (record.read == false) { recCount++ }
        })

        if (recCount > 0) {
            let reqCountSpan = document.getElementById('reqCount')
            reqCountSpan.classList.remove('d-none')
            reqCountSpan.innerHTML = recCount
        }
    })


    // AUTH CHECK
    onAuthStateChanged(auth, (user) => {
        let valid = false;
        if (user) { valid = true; }
    
        if (!valid && loc.search('/index.html') == -1) { 
            window.location.replace('index.html');
        }
    
        if (valid) {
            if (user.uid != id || !userData) {
                signOut(auth).then(() => {
                    window.location.replace('index.html');
                })
            }
        }
    })
    
    // SET NAVIGATION LINKS
    // let logo = document.getElementsByClassName('logo-link');
    // let h = logo[0].href + "?id=" + userData.id;
    // logo[0].setAttribute('href',h)

    let navItems = document.getElementsByClassName('nav-link');
    for (let i = 0; i < navItems.length; i++) {
        let a = navItems[i]
        let n = a.href + "?id=" + userData.id
        a.setAttribute('href', n)
    }
}
// *********************************************************************************************** //
// END INDEX
// *********************************************************************************************** //



// *********************************************************************************************** //
// BEGIN MAIN
// *********************************************************************************************** //
const mainPage = document.getElementById('main')
if (mainPage) {
    // LOAD APP.JS FUNCTIONS
    window.searchEvents = searchEvents;
    window.createEvents = createEvents;

    // GET LOCATOIN BASED EVENTS
    async function mainPage() {

        var events = [];
        let sZip = parseInt((userData.zip.toString()).substring(0,3) + "00") - 100;
        let eZip = parseInt((userData.zip.toString()).substring(0,3) + "00") + 200;

        let eventsColl = query(collection(db, 'events'), where("zip",">=",sZip), where("zip","<=",eZip), orderBy("zip","desc"), orderBy("creationDate", "desc"));

        await getDocs(eventsColl).then((snapshot) => {    
            snapshot.docs.forEach((doc) => {
                let add = true;

                doc.data().dateTimes.forEach ( datetime => { if (datetime.toDate() < today) { add = false; } });

                if (doc.data().status != "active") { add = false; }

                if (add) { events.push({ ...doc.data(), id: doc.id }); }
            });
        });

        events = events.sort((a, b) => {
            if (a.createDate > b.createDate) { return 1; } else { return -1; }
        });

        // CREATE EVENTS
        const eventsDiv = document.getElementById('eventsDiv')
        if (eventsDiv) { createEvents(eventsDiv, events, userData); }

        
    }

    mainPage();

    // GET BENCH
    const benchDiv = document.getElementById('benchDiv');
    if (benchDiv) {
        let benchColl = collection(doc(db, "userRelations", userData.id),"bench");
        
        getDocs(benchColl).then((snapshot) => {
            snapshot.docs.forEach((doc) => {

                let colDiv = document.createElement('div');
                colDiv.classList.add('col-3');
                benchDiv.append(colDiv);

                let proRef = document.createElement('a');
                proRef.classList.add('btn', 'btn-outline-dark','m-1');
                proRef.setAttribute('href','profile.html?id='+ userData.id + '&profileId='+ doc.id);
                proRef.innerHTML = doc.data().username;
                colDiv.append(proRef);

            });
        });
    }

    // REQUESTS FUNCTIONS
    function requestHandler(eventId, typeBool) {

        let sentColl = collection(doc(db, "userRequests", userData.id),"sent")
        getDoc(doc(sentColl, eventId)).then((snap) => {
            let valid = true
            if (snap.data()) { 
                alert("Notification was sent.")
                valid = false 
            }

            if (valid) {
                // // Update event and set userRequests (received, sent)
                let eventsRef = doc(db,"events", eventId)

                if (typeBool == "approved") {
                    let eventData = { attending: increment(1) }
                    updateDoc(eventsRef, eventData)
                }

                // Add userRequests (received)
                getDoc(eventsRef).then((event) => {
                    let userId = event.data().userId
                    let eventLoc = event.data().location
                    let sport = event.data().sport
                    let username = event.data().username
                    let dateTimes = event.data().dateTimes
                    dateTimes.sort()
                    let startDate = dateTimes[0]
                    

                    let sentData = {
                        username: username,
                        sport: sport,
                        location: eventLoc,
                        startDate: startDate,
                        creationDate: serverTimestamp(),
                        status: typeBool,
                        read: false
                    }

                    if (typeBool == "sent") { typeBool = "new"}

                    let score = Math.round(userData.totalRating / userData.numberOfRates)

                    let receivedData = {
                        reqId: userData.id,
                        eventId: eventId,
                        username: userData.username,
                        sport: sport,
                        location: eventLoc,
                        startDate: startDate,
                        creationDate: serverTimestamp(),
                        status: typeBool,
                        rating: parseInt(score),
                        read: false
                    }

                    // Add to userRequests (sent)
                    let sentColl = collection(doc(db,"userRequests",userData.id),"sent")
                    setDoc(doc(sentColl, eventId), sentData)

                    // Add to userRequests (received)
                    let receivedColl = collection(doc(db,"userRequests",userId),"received")
                    // setDoc(doc(receivedColl, userData.id), receivedData).then(() => {
                    addDoc(receivedColl, receivedData).then(() => {
                        alert("Notification sent.")
                    })
                    
                })
            }
        })

        // Check if request was already sent
        // let reqColl = collection(doc(db,"eventRequests",eventId),"requests")
        // getDocs(reqColl).then((snapshot) => {
        //     let valid = true

        //     snapshot.docs.forEach((record) => {
        //         if (userData.id == record.id) {
        //             alert("Notification was sent.")
        //             valid = false
        //         }
        //     })

        
        // })
    }

    window.joinEvent = function(eventId) {
        requestHandler(eventId, "approved")
    }

    window.sendRequest = function(eventId) {
        // SEND CLOUD PUSH NOTIFICATION
        requestHandler(eventId, "sent")
    }

    window.follow = function(followedId, followedUsername) {
        // followId is the userId to the account being followed

        // Create follower for followId
        let followerColl = collection(doc(db,"userRelations",followedId),"followers");
        let newFollower = {
            username: userData.username,
            followDate: serverTimestamp()
        };

        setDoc(doc(followerColl, userData.id), newFollower);

        // Create following for userId
        let followingColl = collection(doc(db,"userRelations",userData.id),"following");
        let newFollowing = {
            username: followedUsername,
            followDate: serverTimestamp()
        };

        setDoc(doc(followingColl, followedId), newFollowing);

        alert("Following: " + followedUsername);
    }

    window.bench = function(benchId, benchedUsername) {
        let benchColl = collection(doc(db,"userRelations",userData.id),"bench");
        let newBencher = {
            username: benchedUsername,
            benchedDate: serverTimestamp()
        }

        setDoc(doc(benchColl, benchId), newBencher);

        alert("Following: " + benchedUsername);
    }

}
// *********************************************************************************************** //
// END MAIN
// *********************************************************************************************** //



// *********************************************************************************************** //
// BEGIN PROFILE
// *********************************************************************************************** //
const profilePage = document.getElementById('profile')
if (profilePage) {

    // SET PROFILE FORM
    // let un = document.getElementById("un")
    // let first = document.getElementById("fName")
    // let last = document.getElementById("lName")
    // let email = document.getElementById("email")
    // let zip = document.getElementById("zip")

    // un.innerHTML = userData.username
    // first.value = userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1)
    // last.value = userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1)
    // email.value = userData.emailAddress
    // zip.value = userData.zip

    // // EDIT PROFILE
    // window.editProfile = function() {
    //     let checkBox = document.getElementById("editCheck")
    //     let first = document.getElementById("fName")
    //     let last = document.getElementById("lName")
    //     let email = document.getElementById("email")
    //     let zip = document.getElementById("zip")
    
    //     if (checkBox.checked) {
    //         first.disabled = false
    //         last.disabled = false
    //         email.disabled = false
    //         zip.disabled = false
    //     } else {
    //         let m = document.getElementById("profileMessage")
    //         let valid = true
    
    //         if (first.value == "") { valid = false;}
    //         if (last.value == "") { valid = false;}
    //         if (email.value == "") { valid = false;}
    //         if (zip.value == "") { valid = false;}
    
    //         if (valid) {
    //             let data = {
    //                 firstName: first.value,
    //                 lastName: last.value,
    //                 emailAddress: email.value,
    //                 zip: parseInt(zip.value),
    //                 updatedDate: serverTimestamp()
    //             }
        
    //             let userDoc = doc(db,"users", userData.id)
        
    //             updateDoc(userDoc, data).then(() => {
        
    //                 first.disabled = true
    //                 last.disabled = true
    //                 email.disabled = true
    //                 zip.disabled = true
        
    //                 m.classList.add('success-message')
    //                 m.innerHTML = "Profile has been updated"
        
    //             }).catch((err) => {
    //                 m.classList.add('error-message')
    //                 m.innerHTML = err.code
    //                 checkBox.checked = true
    //             })
    //         } else {
    //             m.classList.add('error-message')
    //             m.innerHTML = "Field cannot be blank"
    //             checkBox.checked = true
    //         }
    //     }
        
    // }

    // username and options will be based off of userData.id
    // We are going to get all the details according to the profileId.
    let profileId = url.searchParams.get("profileId");
    let unDiv = document.getElementById('profileUsername');
    if (profileId) { 
        getDoc(doc(db,"users",profileId)).then((snapshot) => { unDiv.innerHTML = snapshot.data().username; });
    } else {
        unDiv.innerHTML = userData.username;
        profileId = userData.id;
    }
    
    // EVENTS NAV/TAB
    let eventsDiv = document.getElementById('eventRow');
    let eventsColl = query(collection(db, 'events'), where("userId","==",profileId), orderBy("creationDate", "desc"));
    getDocs(eventsColl).then((snapshot) => {
        snapshot.docs.forEach((doc) => {

            let cDate = doc.data().creationDate.toDate();

            let eventsCol = document.createElement('div');
            eventsCol.classList.add('col-12','p-2','border-bottom','border-dark','bg-light');
            eventsCol.innerHTML = doc.data().sport + '<br>' + doc.data().location + '<br>' + doc.data().level + '<br>' + cDate.toLocaleDateString();
            eventsDiv.append(eventsCol);

        });
    });


    // FOLLOWING NAV/TAB
    let followingDiv = document.getElementById('followingRow');

    let followingColl = collection(doc(db,"userRelations", profileId),"following");
    getDocs(followingColl).then((snapshot) => {
        snapshot.docs.forEach((doc) => {

            // username
            let followingCol = document.createElement('div');
            followingCol.classList.add('col-12');
            followingDiv.append(followingCol);

            let followingBtn = document.createElement('a');
            followingBtn.classList.add('btn','btn-light','text-start','my-1');
            followingBtn.setAttribute('href','profile.html?id=' + userData.id + '&profileId=' + doc.id)
            followingBtn.innerHTML = doc.data().username;
            followingCol.append(followingBtn);
            
        });
    });



    // BENCHED NAV/TAB
    let benchdiv = document.getElementById('benchRow');

    let benchColl = collection(doc(db,"userRelations", profileId),"bench");
    getDocs(benchColl).then((snapshot) => {
        snapshot.docs.forEach((doc) => {

            // username
            let benchCol = document.createElement('div');
            benchCol.classList.add('col-12');
            benchdiv.append(benchCol);

            let benchBtn = document.createElement('a');
            benchBtn.classList.add('btn','btn-light','text-start','my-1');
            benchBtn.setAttribute('href','profile.html?id=' + userData.id + '&profileId=' + doc.id)
            benchBtn.innerHTML = doc.data().username;
            benchCol.append(benchBtn);
            
        });
    });

}
// *********************************************************************************************** //
// END PROFILE
// *********************************************************************************************** //



// *********************************************************************************************** //
// BEGIN EVENT
// *********************************************************************************************** //
let eventPage = document.getElementById('event')
if (eventPage) {
    // LOAD APP.JS FUNCTIONS
    window.goNext = goNext;
    window.goBack = goBack;
    window.setDateTime = setDateTime;
    window.addDateTime = addDateTime;
    window.deleteDateTime = deleteDateTime;

    // ACTION: ADD CODE TO HIDE OTHER OPTIONS BASED ON EVENT ID AVAILABILITY
    // NO ID, SHOW FORM: newEventForm
    // ID AVAILABLE AND USER ID MATCH SHOW FORM: <edit>
    // ID AVAILABLE AND USER ID DOESN'T MATCH SHOW FORM <view event>




    

    // EVENT SUBMITTING FORM
    let eventId = url.searchParams.get('event')
    let eventForm = document.getElementById('eventForm')
    let message = document.getElementById('eventMessage')
    message.textContent = ""
    
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault()

        // datetime handling
        let dt = document.querySelectorAll("#eventForm input[name='eventDates[]']")
        let t = document.querySelectorAll("#eventForm input[name='eventTimes[]']")
        let dateTimes = []
        let valid = true
        let today = new Date();

        for (let i=0; i < dt.length; i++) {
            let dateTime = dt[i].value.toString() + " " + t[i].value.toString() + ":00"
            let date = new Date(dateTime)
            let seconds = date.getTime() / 1000
            let timestamp = new Timestamp(seconds,0)

            if (date > today) {
                dateTimes.push(timestamp)
            } else {
                valid = false
            }
            
        }

        if (valid) {
            let docData = {
                userId: userData.id,
                username: userData.username,
                emailAddress: userData.emailAddress,
                sport: eventForm.sport.value,
                level: eventForm.level.value,
                description: eventForm.description.value,
                availability: parseInt(eventForm.availability.value),
                attending: parseInt(eventForm.attending.value),
                location: eventForm.location.value,
                zip: parseInt(userData.zip),
                type: eventForm.type.value,
                creationDate: serverTimestamp(),
                dateTimes: dateTimes,
                status: "active"
            }
    
            message.classList.toggle("d-none")
            if (eventId) {
                message.textContent = "updating..."
                
                updateDoc(doc(db,"events", eventId), docData).then(() => {
                    location.reload()
                })
    
            } else {
                message.textContent = "adding..."
                addDoc(collection(db,"events"), docData).then(() => {
                    window.location.replace('main.html?id=' + userData.id)
                })
            }
        } else {
            message.classList.remove("d-none")
            message.classList.add("text-danger")
            message.textContent = "Only future dates allowed."
        }
        
    })


    // EVENT CREATE FORM
    let dateTimesDiv = document.getElementById('dateTimesDiv')

    if (eventId) {

        let eventDiv = document.getElementById("eventDiv");
        eventDiv.classList.remove("d-none");

        let docEvent = doc(db,"events", eventId)
        // query where eventId is used to identify
        // let collMembers = collection(doc(db,"eventRequests",eventId),"requests")
        
        let members = [];

        // update userRequests
        let userRequest = collection(doc(db, "userRequests", userData.id), "received")
        let collMembers = query(userRequest, where("eventId","==",eventId))
        let data = { read: true }

        // SOMETHING WRONG HERE
        // getDocs(userRequest, eventId).then((snapshot) => {
        getDocs(collMembers).then((snapshot) => {
            let request = [];
            snapshot.docs.forEach((rec) => {
                request.push(rec.data().reqId)
                updateDoc(doc(userRequest, rec.id), data)
            })

            request.forEach((req) => {
                let sentColl = collection(doc(db, "userRequests", req), "sent")
                updateDoc(doc(sentColl, eventId), data)
            })
            
        })
        

        getDoc(docEvent).then((doc) => {
            let event = doc.data()
    
            let eventStatus = document.getElementById('status')
            eventStatus.innerHTML = event.status

            if (event.status == "cancelled") {
                eventStatus.classList.add('text-danger')
            } else {
                let delEventBtn = document.getElementById('deleteEventBtn')
                delEventBtn.setAttribute('onclick','deleteEvent("'+ eventId +'")')
                delEventBtn.classList.remove('d-none')
                eventStatus.classList.add('text-success')
            }

            if (userData.id == event.userId) {
                let updateBtn = document.getElementById('updateBtn')
                updateBtn.style.display = "block";

                let sport = document.getElementById('sport')
                sport.setAttribute('value',event.sport)
    
                let availability = document.getElementById('availability')
                availability.setAttribute('value',event.availability)

                // let attending = document.getElementById('attending')
                // attending.setAttribute('value',event.attending)

                let level = document.getElementById('level')
                for (let i = 0; i < level.length; i++) {
                    if (event.level == level[i].value) {
                        level[i].setAttribute('selected',true)
                    }
                }

                let type = document.getElementById('type')
                for (let i = 0; i < type.length; i++) {
                    if (event.type == type[i].value)
                    type[i].setAttribute('selected',true)
                }
    
                let description = document.getElementById('description')
                description.innerHTML = event.description
    
                let location = document.getElementById('location')
                location.setAttribute('value',event.location)
                
                // DATETIME
                if (event.dateTimes.length > 0) {
                    // create editable date start time
                    let i = 0
                    event.dateTimes.forEach((dt) => {
                        let date = dt.toDate()

                        let timeFormat = date.toLocaleTimeString('en-GB')
                        let dateFormat = date.toLocaleDateString('en-CA')

                        let dateTimeRow = document.createElement('div')
                        dateTimeRow.classList.add('row')
                        let dateCol = document.createElement('div')
                        dateCol.classList.add('col-6','my-2')

                        let dateInput = document.createElement('input')
                        dateInput.classList.add('form-control')
                        dateInput.setAttribute('type','date')
                        dateInput.setAttribute('title','eventDates')
                        dateInput.setAttribute('name','eventDates[]')
                        dateInput.setAttribute('value',dateFormat)
    
                        let timeCol = document.createElement('div')
                        timeCol.classList.add('col-6','my-2')

                        let timeInput = document.createElement('input')
                        timeInput.classList.add('form-control')
                        timeInput.setAttribute('type','time')
                        timeInput.setAttribute('title','eventTimes')
                        timeInput.setAttribute('name','eventTimes[]')
                        timeInput.setAttribute('value',timeFormat)

                        dateTimesDiv.appendChild(dateTimeRow)
                        dateTimeRow.append(dateCol, timeCol)
                        
                        // LABELS
                        if (i == 0) {
                            let dateLbl = document.createElement('label')
                            dateLbl.setAttribute('for','eventDates')
                            dateLbl.classList.add('control-label')
                            dateLbl.innerHTML = "Date"
                            let timeLbl = document.createElement('label')
                            timeLbl.setAttribute('for','eventDates')
                            timeLbl.classList.add('control-label')
                            timeLbl.innerHTML = "Time"

                            // dateCol.appendChild(dateLbl)
                            // timeCol.appendChild(timeLbl)
                        }
    
                        dateCol.appendChild(dateInput)
                        timeCol.appendChild(timeInput)

                        i++
                    })

                } else {
                    setDateTime(dateTimesDiv)
                }

                getDocs(collMembers).then((all) => {
                    all.docs.forEach((record) => {
                        members.push({ ...record.data(), id: record.id })
                    })

                    if (members.length > 0) {
                        let memberTable = document.getElementById('membershipTable');
    
                        let tHead = document.createElement('thead')
                        let trHead = document.createElement('tr')
                        let thHead1 = document.createElement('th')
                        thHead1.innerHTML = "user"
                        let thHead2 = document.createElement('th')
                        thHead2.innerHTML = "rating"
                        let thHead3 = document.createElement('th')
                        thHead3.innerHTML = "approval"

                        // let thHead4 = document.createElement('th')
                        // thHead4.innerHTML = "email"
    
                        let tBody = document.createElement('tbody')
    
                      
    
                        memberTable.append(tHead, tBody)
                        tHead.appendChild(trHead)
                        trHead.append(thHead1, thHead2, thHead3)
                        
                        
                        let i = 1;
                        members.forEach((member) => {
                            
                            if (member.status != "cancelled") {
                                let trBody = document.createElement('tr')
                                tBody.appendChild(trBody)
                                let tdBody1 = document.createElement('td')
                                let tdBody2 = document.createElement('td')
                                let tdBody3 = document.createElement('td')
                                // let tdBody4 = document.createElement('td')
                                tdBody3.classList.add('text-center')
                                let tdBtn = document.createElement('button')
                                tdBtn.classList.add('btn', 'btn-sm')  
        
                                tdBody1.innerHTML = member.username
                                // tdBody2.innerHTML = member.emailAddress
                                trBody.append(tdBody1, tdBody2, tdBody3)
    
                                let tdDiv = document.createElement('div')
                                tdDiv.classList.add('form-check','form-switch','d-inline-block')
    
                                let tdSwitch = document.createElement('input')
                                tdSwitch.setAttribute('id','checkbox'+ i)
                                tdSwitch.setAttribute('type','checkbox')
                                tdSwitch.setAttribute('onclick',"approvalHandler(checkbox" + i + ",'" + member.id + "')")
                                tdSwitch.classList.add('form-check-input')
                                tdSwitch.style.cursor = 'pointer'
                                if (member.status =="approved") { tdSwitch.checked = true }
                                    
                                tdBody3.appendChild(tdDiv)
                                tdDiv.appendChild(tdSwitch)
                                i++
                            }
                        })
                    }
    
                })

            } else {
                window.location.replace('event.html?id=' + userData.id);
            }            
        })
    } else {
        // SHOW NEW EVENT FORM
        let newEventDiv = document.getElementById("newEventDiv");
        newEventDiv.classList.remove("d-none");

        // NEW EVENT FORM
        let who = document.getElementById("who");
        who.addEventListener("change", function() {
            let limitDiv = document.getElementById("limitDiv");
            if (who.value == 'approval') {
                limitDiv.classList.remove("d-none");
            } else {
                limitDiv.classList.add("d-none");
            }
        });

        
    }

    // CANCEL EVENT
    window.deleteEvent = function(eventId) {
        let data = { status: "cancelled" }
        // update userRequest received
        let recColl = collection(doc(db,"userRequests",userData.id),"received")
        
        getDocs(recColl).then((snap) => {
            snap.docs.forEach((record) => {
                let sentColl = collection(doc(db,"userRequests",record.data().reqId),"sent")
                updateDoc(doc(recColl, record.id), data)
                updateDoc(doc(sentColl, eventId), data)
            })
        })

        // Cancel event
        updateDoc(doc(db,'events',eventId), data).then(()=>{
            alert("Event Cancelled.")
            window.location.replace('main.html?id=' + userData.id);
        })

        // Keeping this for future clean up
        // deleteDoc(doc(db,'events',eventId)).then(()=>{
        //     window.location.replace('main.html?id=' + user.uid);
        // })
    }
      
    function acceptRequest(reqId) {

        let eventId = url.searchParams.get("event")
        let recColl = collection(doc(db,"userRequests",userData.id),"received")
        let recDoc = doc(recColl, reqId)
        let data = { status: "approved" }

        getDoc(recDoc).then((record) => {
            // UPDATE RECEIVED
            updateDoc(recDoc, data)

            // UPDATE SENT
            let sentColl = collection(doc(db,"userRequests",record.data().reqId),"sent")
            updateDoc(doc(sentColl, eventId), data)
        })
        
        // increment event
        let eventRef = doc(db,"events", eventId)

        let eventData = {
            availability: increment(-1),
            attending: increment(1)
        }

        updateDoc(eventRef, eventData).then(() => {
            // SEND CLOUD PUSH NOTIFICATION
        })
    }

    function declineRequest(reqId) {
        
        
        let eventId = url.searchParams.get("event")
        let recColl = collection(doc(db,"userRequests",userData.id),"received")
        let recDoc = doc(recColl, reqId)
        let data = { status: "declined" }

        getDoc(recDoc).then((record) => {
            // UPDATE RECEIVED
            updateDoc(recDoc, data)

            // UPDATE SENT
            let sentColl = collection(doc(db,"userRequests",record.data().reqId),"sent")
            updateDoc(doc(sentColl, eventId), data)
        })

        // increment event
        let eventRef = doc(db,"events", eventId)

        let eventData = {
            availability: increment(1),
            attending: increment(-1)
        }

        updateDoc(eventRef, eventData).then(() => {
            // SEND CLOUD PUSH NOTIFICATION
        })

    }

    window.approvalHandler = function(elementId,reqId) {
        let isChecked = elementId.checked

        if (isChecked) {
            acceptRequest(reqId)
        } else {
            declineRequest(reqId)
        }
    }

}

// *********************************************************************************************** //
// END EVENT
// *********************************************************************************************** //
