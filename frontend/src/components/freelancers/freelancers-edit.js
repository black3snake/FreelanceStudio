import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {FileUtils} from "../../utils/file-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) {
            return this.openNewRoute('/');
        }
        document.getElementById('updateButton').addEventListener('click', this.updateFreelance.bind(this));

        this.nameInputElement = document.getElementById('nameInput');
        this.lastNameInputElement = document.getElementById('lastNameInput');
        this.emailInputElement = document.getElementById('emailInput');
        this.educationInputElement = document.getElementById('educationInput');
        this.locationInputElement = document.getElementById('locationInput');
        this.skillsInputElement = document.getElementById('skillsInput');
        this.infoInputElement = document.getElementById('infoInput');
        this.selectLevelElement = document.getElementById('selectLevel');
        this.avatarInputElement = document.getElementById('avatarInput');

        bsCustomFileInput.init();
        this.getFreelancer(id).then();

        this.elementsValueMap = new Map();
        this.elementsValueArray = [];
    }

    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе фрилансер');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        this.freelancersOriginalData = result.response;
        this.showFreelancer(result.response);
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

    async updateFreelance(e) {
        e.preventDefault();

        if (this.validateForm()) {
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
                const result = await HttpUtils.request('/freelancers/' + this.freelancersOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при редактировании фрилансер');
                }
                return this.openNewRoute('/freelancers/view?id=' + this.freelancersOriginalData.id);
            }
        }
    }
}