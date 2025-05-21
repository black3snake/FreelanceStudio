import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) {
            return this.openNewRoute('/');
        }
        document.getElementById('edit-link').href += id;
        document.getElementById('delete-link').href += id;

        this.getOrder(id).then();
    }

    async getOrder(id) {
        // const id = window.location.href.split('id=')[1];
        const result = await HttpUtils.request('/orders/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе заказа');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        this.showOrder(result.response);
    }

    showOrder(order) {
        // console.log(order);
        const statusInfo = CommonUtils.getStatusHtml(order.status);
        document.getElementById("order-status").classList.add('bg-' + statusInfo.color);
        document.getElementById("order-status-icon").classList.add('fa-' + statusInfo.icon);
        document.getElementById("order-status-value").innerText = (statusInfo.name).toUpperCase();

        if (order.freelancer.avatar) {
            document.getElementById("freelancer-avatar").src = config.host + order.freelancer.avatar;
        }
        document.getElementById("scheduledDate").innerText = (new Date(order.scheduledDate)).toLocaleDateString('ru-Ru');
        document.getElementById("completeDate").innerText = order.completeDate ? (new Date(order.completeDate)).toLocaleDateString('ru-Ru') : 'Заказ не выполнен';
        document.getElementById("deadlineDate").innerText = (new Date(order.deadlineDate)).toLocaleDateString('ru-Ru');

        document.getElementById("freelancer-name").innerHTML = '<a href="/freelancers/view?id=' + order.freelancer.id + '">' + order.freelancer.name + ' ' + order.freelancer.lastName + '</a>';
        document.getElementById("number").innerText = order.number;
        document.getElementById("description").innerText = order.description;
        document.getElementById("owner").innerText = order.owner.name + ' ' + order.owner.lastName;
        document.getElementById("amount").innerText = order.amount;
        document.getElementById("created").innerText = new Date(order.createdAt).toLocaleString('ru-Ru');
    }
}