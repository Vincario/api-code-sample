/**
 * Redirect to URL with decode results
 */
function decodeAction() {
    const errors = validateInput();
    const vinInput = document.getElementById('vinDecodeInput');

    if (errors.length === 0) {
        window.open("https://vindecoder.eu/cz/check-vin/" + vinInput.value, '_blank');
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
    const regExp = new RegExp("^(?!.*[IOQioq])[A-NP-Za-np-z0-9]{1,17}$");

    vinInput.value = vinInput.value.trim();

    if (vinInput.value === "") {
        errors.push('Input can´t be empty...');
    } else if (!regExp.test(vinInput.value)) {
        errors.push('Only letters and numbers allowed. Excluded I,Q and O letters.');
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
    const errors = validateInput();
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
