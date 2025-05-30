import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {UrlUtils} from "../../utils/url-utils";
import {OrderService} from "../../services/orders-service";

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        document.getElementById('edit-link').href += id;
        document.getElementById('delete-link').href += id;

        this.getOrder(id).then();
    }

    async getOrder(id) {
        const response = await OrderService.getOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

             this.showOrder(response.order);
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