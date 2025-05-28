import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";
import {ValidationUtils} from "../../utils/validation-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ) {
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');

        this.processButtonElement = document.getElementById('process-button');
        this.processButtonElement.addEventListener('click', this.signUp.bind(this));

        this.validations = [
            {element:this.nameElement},
            {element:this.lastNameElement},
            {element: this.emailElement, options: {pattern: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value }},
            {element: this.agreeElement, options: {checked: true}},
        ]

    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';
        this.validations.forEach(validation => {
            if (validation.element === this.passwordRepeatElement) {
                validation.options.compareTo = this.passwordElement.value;
            }
        })

        if (ValidationUtils.validationForm(this.validations)) {
            // request
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value
            });

            if (result.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name)) ) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.response.accessToken, result.response.refreshToken, {
                id: result.response.id,
                name: result.response.name,
            });
            this.openNewRoute('/');




            // const response = await fetch('http://localhost:3000/api/signup', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Accept': 'application/json',
            //     },
            //     body: JSON.stringify( {
            //         name: this.nameElement.value,
            //         lastName: this.lastNameElement.value,
            //         email: this.emailElement.value,
            //         password: this.passwordElement.value
            //     })
            // });
            // const result = await response.json();
            //
            // if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
            //     this.commonErrorElement.style.display = 'block';
            //     return;
            // }
            //
            // AuthUtils.setAuthInfo(result.accessToken, result.refreshToken, {
            //     id: result.id,
            //     name: result.name,
            // });
            // this.openNewRoute('/');
        }
    }

}