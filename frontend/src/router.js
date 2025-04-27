import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.routes = [
            {
                route: '/',
                title: 'Dashboard',
                filePathTemplate: '/templates/dashboard.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                load: () => {
                    new SignUp();
                }
            },
        ];
        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | FreelanceStudio';
                console.log(newRoute.title);
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML =
                    await fetch(newRoute.filePathTemplate).then(response => response.text());
                console.log(newRoute.filePathTemplate);

            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found!');
            window.location = "/404";
        }

    }
}