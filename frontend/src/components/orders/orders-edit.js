import {HttpUtils} from "../../utils/http-utils";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this))
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if (!id) {
            return this.openNewRoute('/');
        }

        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        this.calendarScheduled = $('#scheduled-calendar')
        this.calendarComplete = $('#complete-calendar')
        this.calendarDeadline = $('#deadline-calendar')


        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');


        this.init(id).then();
    }

    async init(id) {
        const orderData = await this.getOrder(id);
        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }


    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.id))) {
            console.log(result.response.message);
            return alert('Возникла ошибка при запросе заказа');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        this.orderOriginalData = result.response;
        this.completeDateEmptyDate = this.orderOriginalData.completeDate !== null;
        return result.response
    }

    async getFreelancers(freelancerId) {
        const result = await HttpUtils.request('/freelancers');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
        }

        if (result.error || !result.response || (result.response && (result.response.error || !result.response.freelancers))) {
            return alert('Возникла ошибка при запросе фрилансеров');
            // return console.log('Возникла ошибка при запросе фрилансеров');
        }

        const freelancers = result.response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = freelancers[i].id;
            option.innerText = freelancers[i].name + ' ' + freelancers[i].lastName;
            if (freelancers[i].id === freelancerId) {
                option.selected = true;
            }
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }


    showOrder(order) {
        const breadcrumbElement = document.getElementById('breadcrumb-order');
        breadcrumbElement.href = '/orders/view?id=' + order.id;
        breadcrumbElement.innerText = order.number;

        this.amountInputElement.value = this.orderOriginalData.amount;
        this.descriptionInputElement.value = this.orderOriginalData.description;
        // this.statusSelectElement.value = this.orderOriginalData.status;
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value === order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }


        // this.calendarScheduled.datetimepicker('date', moment(this.orderOriginalData.scheduledDate));
        // this.calendarDeadline.datetimepicker('date', moment(this.orderOriginalData.deadlineDate));
        // if (this.orderOriginalData.completeDate) {
        //     this.calendarComplete.datetimepicker('date', moment(this.orderOriginalData.completeDate));
        // }
        // Альтернатива
        this.calendarScheduled.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            date: order.scheduledDate
        });
        this.calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
            // console.log(this.scheduledDate)
        });

        this.calendarComplete.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
                clear: 'fas fa-trash',
            },
            useCurrent: false,
            buttons: {
                showClear: true

            },
            date: order.completeDate
        });
        this.calendarComplete.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });


        this.calendarDeadline.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            date: order.deadlineDate
        });
        this.calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

    }

    validateForm() {
        let isValid = true;

        if (this.amountInputElement.value && /^\d+$/.test(this.amountInputElement.value)) {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.descriptionInputElement.value) {
            this.descriptionInputElement.classList.remove('is-invalid');
        } else {
            this.descriptionInputElement.classList.add('is-invalid');
            isValid = false;
        }

        // if (this.scheduledDate) {
        //     this.scheduledCardElement.classList.remove('is-invalid');
        // } else {
        //     this.scheduledCardElement.classList.add('is-invalid');
        //     isValid = false;
        // }
        // if (this.deadlineDate) {
        //     this.deadlineCardElement.classList.remove('is-invalid');
        // } else {
        //     this.deadlineCardElement.classList.add('is-invalid');
        //     isValid = false;
        // }
        return isValid;
    }

    async updateOrder(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const changedData = {};
            // input
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = parseInt(this.amountInputElement.value);
            }
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }
            // select
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }
            // calendar
            if (this.scheduledDate) {
                changedData.scheduledDate = this.scheduledDate.toISOString();
            }
            // if (this.calendarComplete.datetimepicker('date')) {
            //     console.log(this.calendarComplete.datetimepicker('date'));
            //
            // }
            // console.log('Первый запуск, есть ли дата: ' + this.completeDateEmptyDate);
            // console.log(this.completeDate);

            if (this.completeDate || this.completeDate === false ) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }

            // if (this.calendarDeadline.datetimepicker('date').toISOString() !== this.orderOriginalData.deadlineDate) {
            //     changedData.deadlineDate = this.calendarDeadline.datetimepicker('date').toISOString();
            // }
            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/orders/' + this.orderOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    console.log(result.response.message);
                    return alert('Возникла ошибка при редактировании заказа');
                }
                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }

        }
    }
}