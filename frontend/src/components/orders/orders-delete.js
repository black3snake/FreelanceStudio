import {HttpUtils} from "../../utils/http-utils";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) {
            return this.openNewRoute('/');
        }

        this.deleteOrder(id).then();
    }

    async deleteOrder(id) {
        const result = await HttpUtils.request('/orders/' + id, 'DELETE');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалению заказа');
        }
        return this.openNewRoute('/orders');
    }
}