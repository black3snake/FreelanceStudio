import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        document.getElementById('updateButton').addEventListener('click', this.updateFreelance.bind(this));

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

        bsCustomFileInput.init();
        this.getFreelancer(id).then();

        this.elementsValueMap = new Map();
        this.elementsValueArray = [];
    }

    findElements() {
        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.selectLevelElement = document.getElementById('selectLevel');
        this.avatarInputElement = document.getElementById('avatarInput');
    }

    async getFreelancer(id) {
        const response = await FreelancersService.getFreelancer(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.freelancersOriginalData = response.freelancer;
        this.showFreelancer(response.freelancer);
    }

    showFreelancer(freelancer) {
        const breadcrumbElement = document.getElementById('breadcrumb-freelancer');
        breadcrumbElement.href = '/freelancers/view?id=' + freelancer.id;
        breadcrumbElement.innerText = freelancer.name + ' ' + freelancer.lastName;
        document.getElementById("level").innerHTML = CommonUtils.getLevelHtml(freelancer.level)

        if (freelancer.avatar) {
            // this.avatarElement.setAttribute('src', config.host + freelancer.avatar);
            document.getElementById("avatar").src = config.host + freelancer.avatar;
        }

        this.elementsValueMap.set(this.nameInputElement, this.nameInputElement.value = freelancer.name)
        this.elementsValueMap.set(this.lastNameInputElement, this.lastNameInputElement.value = freelancer.lastName);
        this.elementsValueMap.set(this.emailInputElement, this.emailInputElement.value = freelancer.email);
        this.elementsValueMap.set(this.educationInputElement, this.educationInputElement.value = freelancer.education);
        this.elementsValueMap.set(this.locationInputElement, this.locationInputElement.value = freelancer.location);
        this.elementsValueMap.set(this.skillsInputElement, this.skillsInputElement.value = freelancer.skills);
        this.elementsValueMap.set(this.infoInputElement, this.infoInputElement.value = freelancer.info);

        // this.elementsValueMap.set(this.selectLevelElement, this.selectLevelElement.value = freelancer.level);
        for (let i = 0; i < this.selectLevelElement.options.length; i++) {
            if (this.selectLevelElement.options[i].value === freelancer.level) {
                this.selectLevelElement.selectedIndex = i;
                this.elementsValueMap.set(this.selectLevelElement, this.selectLevelElement.value)
            }
        }

        this.elementsValueMap.set(this.avatarInputElement, this.avatarInputElement.files.length > 0 ? this.avatarInputElement.files[0].name : '');

        for (let el of this.elementsValueMap.keys()) {
            this.elementsValueArray.push(el);
        }

    }

    async updateFreelance(e) {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations)) {
            // let elementIz = [];
            // for (let item of this.elementsValueMap) {
            //     for (let i = 0; i < this.elementsValueArray.length; i++) {
            //         if (item[0] === this.elementsValueArray[i]) {
            //             if (item[1] !== this.elementsValueArray[i].value) {
            //                 elementIz.push(this.elementsValueArray[i].value)
            //             }
            //         }
            //
            //     }
            // }
            // console.log(this.elementsValueMap)
            // console.log(elementIz)
            const changedData = {};
            if (this.nameInputElement.value !== this.freelancersOriginalData.name) {
                changedData.name = this.nameInputElement.value;
            }
            if (this.lastNameInputElement.value !== this.freelancersOriginalData.lastName) {
                changedData.lastName = this.lastNameInputElement.value;
            }
            if (this.emailInputElement.value !== this.freelancersOriginalData.email) {
                changedData.email = this.emailInputElement.value;
            }
            if (this.educationInputElement.value !== this.freelancersOriginalData.education) {
                changedData.education = this.educationInputElement.value;
            }
            if (this.locationInputElement.value !== this.freelancersOriginalData.location) {
                changedData.location = this.locationInputElement.value;
            }
            if (this.skillsInputElement.value !== this.freelancersOriginalData.skills) {
                changedData.skills = this.skillsInputElement.value;
            }
            if (this.infoInputElement.value !== this.freelancersOriginalData.info) {
                changedData.info = this.infoInputElement.value;
            }
            if (this.selectLevelElement.value !== this.freelancersOriginalData.level) {
                changedData.level = this.selectLevelElement.value;
            }
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0]);
            }

            if (Object.keys(changedData).length > 0) {
                const response = await FreelancersService.updateFreelancer(this.freelancersOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/freelancers/view?id=' + this.freelancersOriginalData.id);
            }
        }
    }
}