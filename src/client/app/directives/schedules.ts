import "angular"
import * as moment from "moment"
import * as $ from 'jquery'
import {autobind} from "core-decorators"
import ScheduleController from "../controllers/schedule-controller"

interface ISchedulesScope extends ng.IScope {
    startDat: Date
    days: number
    dates: Array<Date>
    setDays: (number, Date) => void
    scrollRef: Element
    scrollPos: number
}

const today: () => Date = () => moment().startOf("day").toDate() 

export default class Schedules implements ng.IDirective {
    scope: ISchedulesScope
    $scope: ISchedulesScope
    controller = ScheduleController

    $timeout: ng.ITimeoutService
    strutHeight: number = 0
    wrapper: JQuery

    public template = `
        <div class="main-container">
            <div class="left-panel">
                <sidebar></sidebar>
            </div>
            <div class="right-panel">
                <div class="toolbar">
                    <div>
                        <button ng-click="setDays(1)" ng-disabled="days === 1">1 день</button>
                        <button ng-click="setDays(2)" ng-disabled="days === 2">2 дня</button>
                        <button ng-click="setDays(7)" ng-disabled="days === 7">неделя</button>
                    </div>
                </div>
                <div class="wrapper" id="wrapper">
                    <div class="content">
                        <schedule ng-repeat="d in dates" date="d" scroll-ref="scrollRef" scroll-pos="scrollPos" doctor-filter="doctorFilter"></schedule>
                    </div>
                </div>
            </div>
        </div>
    `

    constructor($timeout) {
        this.$timeout = $timeout
    }

    private setDays: (number, Date) => void = (n, startDay) => {
        this.$scope.days = n
        this.$scope.dates = Array.apply(null, Array(this.$scope.days))
            .map((_, i) => i)
            .map(i => moment(startDay).add(i, "days").toDate())
        this.$timeout(() => {
            this.setStrutHeight()
            this.handleScroll()
        })
    } 

    @autobind private collapseHeader(element: Element, collapse: boolean) {
        if (collapse) element.classList.add('collapsed')
        else element.classList.remove('collapsed')
    }

    private handleScroll: () => void = 
        () => {
            const refTop = this.wrapper.scrollTop()
            this.$scope.$apply(() => this.$scope.scrollPos = refTop)
            this.wrapper.find('.schedule-header').each((idx, e) => $(e).css({top: `${refTop}px`}))
        }

    @autobind private setStrutHeight() {
        this.strutHeight = (Math.max(...$(document).find('.schedule-header').map((_, e) => e.clientHeight).toArray())) + 20
        $(document).find('.strut').each((_, e) => $(e).css({height: `${this.strutHeight}px`}))
    }

    public link(scope: ISchedulesScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        this.$scope = this.scope = scope
        this.$scope.setDays = this.setDays
        this.setDays(1, today())
        this.wrapper = $(element).find('#wrapper')
        scope.scrollRef = this.wrapper[0]
        
        this.$scope.scrollPos = 0
        this.wrapper.on('scroll', this.handleScroll)
    }
}