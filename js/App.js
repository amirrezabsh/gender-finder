//an error string fot times that you want to submit a name while input is empty
const ErrNameMustNotBeEmpty = "Name must not be empty"
//this function does the name submiting process
function submitName() {
    let name = document.forms["left-form"]["name"].value
    if (name == '') {
        notify(ErrNameMustNotBeEmpty)
        document.getElementById("save").disabled = true
        document.getElementById("gender").innerHTML = "No data!"
        document.getElementById("score").innerHTML = "No data!"
        document.getElementById("answer").innerHTML = "No name entered!"
        return false
    }
    if (!validateName(name)) {
        notify("Enter a valid name!")
        document.getElementById("save").disabled = true
        document.getElementById("gender").innerHTML = "No data!"
        document.getElementById("score").innerHTML = "No data!"
        document.getElementById("answer").innerHTML = "No name entered!"
        return false
    }
    if (localStorage.getItem(name) == null) {
        document.getElementById("answer").innerHTML = "No record found!"
    }
    else {
        document.getElementById("answer").innerHTML = localStorage.getItem(name)
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.genderize.io/?name=" + name, false); // false for synchronous request
    xmlHttp.send(null);
    let response = JSON.parse(xmlHttp.response)
    if (response.gender == null) {
        notify("No gender found!")
        document.getElementById("save").disabled = false
        document.getElementById("gender").innerHTML = "No data!"
        document.getElementById("score").innerHTML = "No data!"
        document.getElementById("answer").innerHTML = "No record found!"
        return false
    }
    document.getElementById("gender").innerHTML = response.gender
    document.getElementById("score").innerHTML = response.probability
    document.getElementById("save").disabled = false
    var ele = document.getElementsByName("radio-input");
    for (var i = 0; i < ele.length; i++) {
        ele[i].checked = false;
    }
    return false
}

//this function does saving the name process
function saveName() {
    let name = document.forms["left-form"]["name"].value
    if (name == '') {
        notify(ErrNameMustNotBeEmpty)
        return false
    }
    if (!document.forms["left-form"]["male-button"].checked && !document.forms["left-form"]["female-button"].checked && document.getElementById("gender").innerHTML == "No data!") {
        notify("Enter a name and submit")
        return false
    }
    if (document.forms["left-form"]["male-button"].checked) {
        localStorage.setItem(name, "Male")
        document.getElementById("answer").innerHTML = "Male"
    }
    else if (document.forms["left-form"]["female-button"].checked) {
        localStorage.setItem(name, "Female")
        document.getElementById("answer").innerHTML = "Female"
    }
    else {
        localStorage.setItem(name, document.getElementById("gender").innerHTML)
        document.getElementById("answer").innerHTML = document.getElementById("gender").innerHTML
    }
    notify("Saved!")
    return false
}

//this function does notifing the user process for errors and etc.
function notify(message) {
    document.getElementById("notifier").style.height = "5%";
    document.getElementById("notifyType").innerHTML = message;

    setTimeout(function () {
        document.getElementById("notifier").style.height = "0";
    }, 4000);

}

//this function does clearing the name form localstorage process
function clear() {
    let name = document.forms["left-form"]["name"].value
    if (name == '') {
        notify(ErrNameMustNotBeEmpty)
        return false
    }
    if (localStorage.getItem(name) != null) {
        localStorage.removeItem(name)
        document.getElementById("answer").innerHTML = "No record found!"
        notify("deleted!")
    }
    else {
        notify("No such name found!")
    }
    return false
}
//this line adds the clear function to clear button
document.getElementById("clear").addEventListener("click", clear);

//this function validates the name entered by user
function validateName(name) {
    var regex = /^[a-zA-Z ]{1,255}$/;
    return regex.test(name);
}