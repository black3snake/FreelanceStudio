import {HttpUtils} from "../utils/http-utils";

export class OrderService {
    static async getOrders() {
        const returnObject = {
            error: false,
            redirect: null,
            orders: null
        };

        const result = await HttpUtils.request('/orders');

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.orders))) {
            returnObject.error = 'Возникла ошибка при запросе заказов';
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.orders = result.response.orders;
        return returnObject;
    }

    static async createOrder(data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request('/orders', 'POST', true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при добавлении заказа';
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async deleteOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/orders/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении заказа';
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }

    static async getOrder(id) {
        const returnObject = {
            error: false,
            redirect: null,
            order: null
        };

        const result = await HttpUtils.request('/orders/' + id);

        if (result.redirect || result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            returnObject.error = 'Возникла ошибка при запросе заказа';
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.order = result.response;
        return returnObject;
    }

    static async updateOrder(id, data) {
        const returnObject = {
            error: false,
            redirect: null
        };

        const result = await HttpUtils.request('/orders/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании заказа';
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }
}

