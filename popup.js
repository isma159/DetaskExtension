let signInBtn = document.getElementById("signInBtn");
let signInUserField = document.getElementById("signInUserField");
let signInPassField = document.getElementById("signInPassField")
const MOCK_USER = "worker";
const MOCK_PASS = "worker123"


signInBtn.addEventListener('click', () => {

    if (signInUserField.value == MOCK_USER && signInPassField.value == MOCK_PASS) {

        console.log("LOGGED IN")
        window.location.href = "./main_page.html"
        window.close();
    }
    else {

        console.log("INCORRECT CREDENTIALS" + signInPassField.value)

    }

})