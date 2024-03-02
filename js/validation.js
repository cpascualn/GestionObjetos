function showFeedBack(input, valid, message) {
    const validClass = (valid) ? 'is-valid' : 'is-invalid';
    const messageDiv = (valid) ? input.parentElement.querySelector('div.valid-feedback') : input.parentElement.querySelector('div.invalid-feedback');
    for (const div of input.parentElement.getElementsByTagName('div')) {
        div.classList.remove('d-block');
    }
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('d-block');
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
    input.classList.add(validClass);
    if (message) {
        messageDiv.innerHTML = message;
    }
}

function defaultCheckElement(event) {
    this.value = this.value.trim();
    if (!this.checkValidity()) {
        showFeedBack(this, false);
    } else {
        showFeedBack(this, true);
    }
}

function newDishValidation(handler) {

    const form = document.forms.Form;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        this.nombre.value = this.nombre.value.trim();
        if (!this.nombre.checkValidity()) {
            isValid = false;
            showFeedBack(this.nombre, false);
            firstInvalidElement = this.descripcion;
        } else {
            showFeedBack(this.nombre, true);
        }


        if (!this.descripcion.checkValidity()) {
            isValid = false;
            showFeedBack(this.descripcion, false);
            firstInvalidElement = this.descripcion;
        } else {
            showFeedBack(this.descripcion, true);
        }

        if (!this.ingredientes.checkValidity()) {
            isValid = false;
            showFeedBack(this.ingredientes, false);
            firstInvalidElement = this.ingredientes;
        } else {
            showFeedBack(this.ingredientes, true);
        }

        if (!this.imagen.checkValidity()) {
            isValid = false;
            showFeedBack(this.imagen, false);
            firstInvalidElement = this.imagen;
        } else {
            showFeedBack(this.imagen, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            let categorias = Array.from(this.categorias.selectedOptions).map(option => option.value);
            let alergenos = Array.from(this.alergenos.selectedOptions).map(option => option.value);
            handler(this.nombre.value, this.descripcion.value, this.ingredientes.value, this.imagen.value, categorias, alergenos);
        }
        event.stopPropagation();
        event.preventDefault();

    });

    form.addEventListener('reset', (function (event) {
        console.log("entra");
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        this.nombre.focus();
    }));

    form.nombre.addEventListener('change', defaultCheckElement);
    form.ingredientes.addEventListener('change', defaultCheckElement);
}

function removeDishValidation(handler) {
    const form = document.forms.Form;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        let platos = Array.from(this.platos.selectedOptions).map(option => option.value);
        handler(platos);

        event.stopPropagation();
        event.preventDefault();

    });

    // form.addEventListener('reset', (function (event) {
    //     console.log("entra");
    //     for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
    //         div.classList.remove('d-block');
    //         div.classList.add('d-none');
    //     }
    //     for (const input of this.querySelectorAll('input')) {
    //         input.classList.remove('is-valid');
    //         input.classList.remove('is-invalid');
    //     }
    //     this.platos.focus();
    // }));

}



export { newDishValidation, removeDishValidation };