import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../services/freelancers-service";
import {OrderService} from "../../services/orders-service";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this))
        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.scheduledDate = null;
        this.completeDate = null;
        this.deadlineDate = null;

        this.calendarScheduled = $('#scheduled-calendar')
        this.calendarComplete = $('#complete-calendar')
        this.calendarDeadline = $('#deadline-calendar')

        this.findElements();

        this.validations = [
            {element: this.amountInputElement},
            {element: this.descriptionInputElement},
        ]

        this.init(id).then();
    }

    findElements() {
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.amountInputElement = document.getElementById('amountInput');
        this.descriptionInputElement = document.getElementById('descriptionInput');
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
        const response = await OrderService.getOrder(id);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        this.orderOriginalData = response.order;
        return response.order;
    }

    async getFreelancers(freelancerId) {
        const response = await FreelancersService.getFreelancers();

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        // const freelancers = response.freelancers;
        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement("option");
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + ' ' + response.freelancers[i].lastName;
            if (response.freelancers[i].id === freelancerId) {
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
        const calendarOptions = {
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,

        }

        const objectScheduledCalendar = {...calendarOptions, ...{date: order.scheduledDate}}
        // this.calendarScheduled.datetimepicker(Object.assign({}), calendarOptions, {date: order.scheduledDate});
        this.calendarScheduled.datetimepicker(objectScheduledCalendar);
        this.calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date;
            // console.log(this.scheduledDate)
        });

        const objectDeadlineCalendar = {...calendarOptions, ...{date: order.deadlineDate}}
        this.calendarDeadline.datetimepicker(objectDeadlineCalendar);
        this.calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlineDate = e.date;
        });


        const objectCompleteCalendar = {...calendarOptions, ...{date: order.completeDate}, ...{buttons: {showClear: true}}};
        this.calendarComplete.datetimepicker(objectCompleteCalendar);
        this.calendarComplete.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.completeDate = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.completeDate = false;
            } else {
                this.completeDate = null;
            }
        });
    }

    async updateOrder(e) {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations)) {
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

            if (this.completeDate || this.completeDate === false) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : null;
            }

            // if (this.calendarDeadline.datetimepicker('date').toISOString() !== this.orderOriginalData.deadlineDate) {
            //     changedData.deadlineDate = this.calendarDeadline.datetimepicker('date').toISOString();
            // }
            if (this.deadlineDate) {
                changedData.deadlineDate = this.deadlineDate.toISOString();
            }

            if (Object.keys(changedData).length > 0) {
                const response = await OrderService.updateOrder(this.orderOriginalData.id, changedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }

        }
    }
}