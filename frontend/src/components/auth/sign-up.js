import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils";
import {AuthService} from "../../services/auth-service";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element:this.nameElement},
            {element:this.lastNameElement},
            {element: this.emailElement, options: {pattern: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value }},
            {element: this.agreeElement, options: {checked: true}},
        ];

        this.processButtonElement.addEventListener('click', this.signUp.bind(this));
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButtonElement = document.getElementById('process-button');
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
            const signUpResult = await AuthService.signUp({
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value
            })

            if (signUpResult) {
                AuthUtils.setAuthInfo(signUpResult.accessToken, signUpResult.refreshToken, {
                    id: signUpResult.id,
                    name: signUpResult.name,
                });
                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';

        }
    }

}