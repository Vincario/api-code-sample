/**
 * Redirect to URL with decode results
 */
function decodeAction(event) {
    event.preventDefault();

    const errors = validateInput();

    const vinInput = document.getElementById('vinDecodeInput');
    if (vinInput.value.length !== 17)
        return;

    if (errors.length === 0) {
        window.location.href = "https://vindecoder.eu/check-vin/" + vinInput.value;
    } else {
        showErrors(true, errors);
    }
}

/**
 * Validate input function
 * @returns {any[]}
 */
function validateInput() {
    const vinInput = document.getElementById('vinDecodeInput');
    const errors = Array();
    const regExp = new RegExp("^[abcdefghjklmnprstuvwxyzABCDEFGHJKLMNPRSTUVWXYZ0123456789]{1,17}$");

    if (vinInput.value === "") {
        errors.push('Input can´t be empty.');
    } else if (!regExp.test(vinInput.value)) {
        errors.push('Only letters and numbers are allowed. Except for the letters I, O and Q');
    }

    return errors;
}

/**
 * Show/hide error messages
 * @param show : Boolean
 * @param errors : Array
 */
function showErrors(show, errors) {
    const errorsMessages = document.querySelector('#vincario-decode-vin-widget .errors');

    if (errors.length !== 0) {
        errorsMessages.innerHTML = "";

        for (let i = 0; i < errors.length; i++) {
            const el = document.createElement('p');
            el.innerText = errors[i];
            errorsMessages.append(el);
        }
    }

    if (show) {
        errorsMessages.classList.remove('display-none');
        return;
    }
    errorsMessages.classList.add('display-none');
}

/**
 * Change input event
 */
function changeInput() {
    let errors = [];

    const vinInput = document.getElementById('vinDecodeInput');
    const submitButton = document.getElementById('submit-vin')

    if (vinInput.value.length > 17) {
        errors.push("Reached maximum of characters (17).");
    }

    vinInput.value = vinInput.value.trim();
    vinInput.value = vinInput.value.slice(0, 17);

    const validationErrors = [...validateInput()];
    submitButton.disabled = vinInput.value.length !== 17 || validationErrors.length !== 0;

    errors.push(...validationErrors);
    showErrors(errors.length !== 0, errors);
}

/**
 * On load document event action
 * @param event
 */
window.onload = (event) => {
     const vinInput = document.getElementById('vinDecodeInput');

    // Init listeners
    vinInput.oninput = changeInput;
};