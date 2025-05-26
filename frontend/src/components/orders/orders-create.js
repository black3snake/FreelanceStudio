import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this))

        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        const calendarScheduled = $('#scheduled-calendar')
        const calendarComplete = $('#complete-calendar')
        const calendarDeadline = $('#deadline-calendar')

        calendarScheduled.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
            // console.log(this.scheduledDate)
        });

        calendarComplete.datetimepicker({
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

            }
        });
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date;
            // console.log(this.completeDate);
        });

        calendarDeadline.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });

        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.getFreelancers().then();
    }


    async getFreelancers() {
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
            this.freelancerSelectElement.appendChild(option);
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });

    }

    validateForm() {
        let isValid = true;

        if (this.amountInputElement.value && /^\d+$/.test(this.amountInputElement.value))  {
            this.amountInputElement.classList.remove('is-invalid');
        } else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.descriptionInputElement.value )  {
            this.descriptionInputElement.classList.remove('is-invalid');
        } else {
            this.descriptionInputElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.scheduledDate) {
            this.scheduledCardElement.classList.remove('is-invalid');
        } else {
            this.scheduledCardElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.deadlineDate) {
            this.deadlineCardElement.classList.remove('is-invalid');
        } else {
            this.deadlineCardElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }



    async saveOrder(e) {
        e.preventDefault();

        if (this.validateForm()) {
            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlineDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value)
            }
            if (this.completeDate) {
                createData.completeDate = this.completeDate.toISOString();
            }

            const result = await HttpUtils.request('/orders', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);  // перевод пользователя на другую страницу
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при добавлении заказа');
            }
            return this.openNewRoute('/orders/view?id=' + result.response.id);
        }
    }
}