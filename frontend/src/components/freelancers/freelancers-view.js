import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class FreelancersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) {
            return this.openNewRoute('/');
        }

        this.getFreelancer(id).then();

        document.getElementById('edit-link').href += id;
        document.getElementById('delete-link').href += id;
    }

    async getFreelancer(id) {
        // const id = window.location.href.split('id=')[1];
        const result = await HttpUtils.request('/freelancers/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе фрилансер');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        this.showFreelancer(result.response);
    }

    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            // this.avatarElement.setAttribute('src', config.host + freelancer.avatar);
            document.getElementById("avatar").src = config.host + freelancer.avatar;
        }

        document.getElementById("name").innerText = freelancer.name + ' ' + freelancer.lastName;

        document.getElementById("level").innerHTML = CommonUtils.getLevelHtml(freelancer.level)
        document.getElementById("email").innerText = freelancer.email;
        document.getElementById("email").innerText = freelancer.email;
        document.getElementById("education").innerText = freelancer.education;
        document.getElementById("location").innerText = freelancer.location;
        document.getElementById("skills").innerText = freelancer.skills;
        document.getElementById("info").innerText = freelancer.info;
        if (freelancer.createdAt) {
            const date = new Date(freelancer.createdAt);
        document.getElementById("created").innerText = date.toLocaleString('ru-Ru');
        }
    }

}