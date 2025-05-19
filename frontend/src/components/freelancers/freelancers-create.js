import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this))
        bsCustomFileInput.init();

        this.nameInputElement = document.getElementById('nameInput')
        this.lastNameInputElement = document.getElementById('lastNameInput')
        this.emailInputElement = document.getElementById('emailInput')
        this.educationInputElement = document.getElementById('educationInput')
        this.locationInputElement = document.getElementById('locationInput')
        this.skillsInputElement = document.getElementById('skillsInput')
        this.infoInputElement = document.getElementById('infoInput')
        this.selectLevelElement = document.getElementById('selectLevel')
        this.avatarInputElement = document.getElementById('avatarInput')

    }

    validateForm() {
        let isValid = true;
        let textInputArray = [
            this.nameInputElement, this.lastNameInputElement, this.educationInputElement,
            this.locationInputElement, this.skillsInputElement, this.infoInputElement,
        ];

        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false;
            }

        }

        if (this.emailInputElement.value && this.emailInputElement.value.match(/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        } else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async saveFreelancer(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                level: this.selectLevelElement.value,
                education: this.educationInputElement.value,
                location: this.locationInputElement.value,
                skills: this.skillsInputElement.value,
                info: this.infoInputElement.value,
            }


            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                createData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            const result = await HttpUtils.request('/freelancers', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении фрилансер');
            }
            return this.openNewRoute('/freelancers/view?id=' + result.response.id);
        }

    }

}