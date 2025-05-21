import {HttpUtils} from "../../utils/http-utils";
import {CommonUtils} from "../../utils/common-utils";

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOrdersList().then();
    }

    async getOrdersList() {
        const result = await HttpUtils.request('/orders');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.orders))) {
            return alert('Возникла ошибка при запросе заказов');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        this.showRecords(result.response.orders);
    }

    showRecords(orders) {
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < orders.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = orders[i].number;
            trElement.insertCell().innerText = `${orders[i].owner.name} ${orders[i].owner.lastName}`;
            trElement.insertCell().innerHTML = '<a href="/freelancers/view?id=' + orders[i].freelancer.id + '" class="orders_freelancerTo">' + `${orders[i].freelancer.name} ${orders[i].freelancer.lastName}` + '</a>';

            trElement.insertCell().innerText = (new Date(orders[i].scheduledDate)).toLocaleString('ru-RU', {});
            trElement.insertCell().innerText = (new Date(orders[i].deadlineDate)).toLocaleString('ru-RU', {});

            const statusInfo = CommonUtils.getStatusHtml(orders[i].status);
            trElement.insertCell().innerHTML = '<span class="badge badge-' + statusInfo.color + '">' + statusInfo.name + '</span>'


            trElement.insertCell().innerText = orders[i].completeDate ? (new Date(orders[i].completeDate)).toLocaleString('ru-RU', {}) : '';
            trElement.insertCell().innerHTML = '<div class="order-tools"> ' +
                '<a href="/orders/view?id=' + orders[i].id + '" class="fas fa-eye"></a>' +
                '<a href="/orders/edit?id=' + orders[i].id + '" class="fas fa-edit"></a>' +
                '<a href="/orders/delete?id=' + orders[i].id + '" class="fas fa-trash"></a>' +
                '</div>';


            recordsElement.appendChild(trElement);
        }

        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next":       "Вперед",
                    "previous":   "Назад"
                },
            }
        });
    }
}