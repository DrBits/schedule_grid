import "angular"
import * as moment from "moment"
import * as $ from 'jquery'

interface ISchedulesScope extends ng.IScope {
    days: number
    dates: Array<Date>
    setDays: (number) => void
}

export default class Schedules implements ng.IDirective {
    scope: ISchedulesScope
    $timeout: ng.ITimeoutService

    public template = `
        <div>
            <button ng-click="setDays(1)" ng-disabled="days === 1">1 day</button>
            <button ng-click="setDays(2)" ng-disabled="days === 2">2 days</button>
            <button ng-click="setDays(7)" ng-disabled="days === 7">week</button>
        </div>
        <div class="wrapper" id="wrapper">
            <div class="content">
                <schedule ng-repeat="d in dates" date="d"></schedule>
            </div>
        </div>
    `

    constructor($timeout) {
        this.$timeout = $timeout
    }

    private setDays: (number) => void = n => {
        console.log("setting days =", n)
        this.scope.days = n
        this.scope.dates = Array.apply(null, Array(this.scope.days))
            .map((_, i) => i)
            .map(i => moment().startOf("day").add(i, "days").toDate())
        this.$timeout(this.setStrutHeight)
    }

    private handleScroll: (element: JQuery, reference: JQuery) => () => void = 
        (element, reference) => () => {
            //console.log("scroll!", element, reference, reference.scrollTop())
            //element.css( {top: reference.scrollTop() + 'px'} );
            const top = reference.scrollTop();
            reference.find('.schedule-header').each((idx, e) => $(e).css({top: `${top}px`}))
        }

    private setStrutHeight() {
        const strutHeight = (Math.max(...$(document).find('.schedule-header').map((_, e) => e.clientHeight).toArray()))
        console.log(`setting strut height to ${strutHeight}`)
        $(document).find('.strut').each((_, e) => $(e).css({height: `${strutHeight + 20}px`}))
    }

    public link(scope: ISchedulesScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        this.scope = scope
        this.scope.setDays = this.setDays
        this.setDays(2)
        const wrapper = $(element).find('#wrapper')
        wrapper.on('scroll', 
        this.handleScroll($(element).find('#sch-headers'), $(element).find('#wrapper')))
    }
}