function decodeAction() {
    const errors = validateInput();
    const vinInput = document.getElementById('vinDecodeInput');

    if(errors.length === 0){
        window.location.href = "https://vindecoder.eu/cz/check-vin/" + vinInput.value;
    }else{
        showErrors(true, errors);
    }
}

function validateInput() {
    const vinInput = document.getElementById('vinDecodeInput');
    const errors = Array();
    const regExp = new RegExp("^(?!.*[IOQioq])[A-NP-Za-np-z0-9]{1,17}$");

    vinInput.value = vinInput.value.trim();

    if(vinInput.value === ""){
        errors.push('Input can´t be empty...');
    }
    else if(!regExp.test(vinInput.value)){
        errors.push('Only letters and numbers allowed excluded I,Q and O letters.');
    }

    return errors;
}

function showErrors(show, errors){
    const errorsMessages = document.querySelector('#vincario-decode-vin-widget .errors');

    if(errors.length !== 0){
        errorsMessages.innerHTML = "";

        for (let i =0; i < errors.length; i++){
            const el = document.createElement('p');
            el.innerText = errors[i];
            errorsMessages.append(el);
        }
    }

    if(show){
        errorsMessages.classList.remove('display-none');
        return;
    }
    errorsMessages.classList.add('display-none');
}

function changeInput(){
    const errors = validateInput();
    showErrors(errors.length !== 0, errors);

}
window.onload = (event) => {
    const vinInput = document.getElementById('vinDecodeInput');

    // Init listeners
    vinInput.oninput = changeInput;
};
