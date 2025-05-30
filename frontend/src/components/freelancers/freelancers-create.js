import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this))
        bsCustomFileInput.init();

        this.findElements();

        this.validations = [
            { element: this.nameInputElement },
            { element: this.lastNameInputElement },
            { element: this.educationInputElement },
            { element: this.emailInputElement,
                options: { pattern: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/}},
            { element: this.locationInputElement },
            { element: this.skillsInputElement },
            { element: this.infoInputElement },
        ];

    }

    findElements() {
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

    async saveFreelancer(e) {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations)) {
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

            const response = await FreelancersService.createFreelancer(createData);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/freelancers/view?id=' + response.id);
        }

    }

}