import "angular"
import * as moment from "moment"
import {Doctor} from "../domain/doctor"
import {Activity} from "../domain/activities"
import {doctors} from "../domain/data"
import ScheduleController from "../controllers/schedule-controller"

interface IScheduleScope extends ng.IScope {
    date: Date
    doctors: Doctor[]
    scheduleGrid: { Moment: Activity }[]
    scrollRef: Element
    doctorFilter: Doctor[]
    strutHeight: number
}

export default class Schedule implements ng.IDirective {
    scope = {
        date: '=', 
        scrollRef: '=',
        scrollPos: '=',
        doctorFilter: '=',
        strutHeight: '='
    }

    replace = false
    require = "^schedules"
    controller: ScheduleController

    public template = `
        <div data-ng-repeat="doctor in doctors" class="schedule" ng-if="doctor.worksOn(date) && doctor.visible">
            <individual-schedule doctor="doctor" date="date" scroll-ref="scrollRef" scroll-pos="scrollPos" strut-height="strutHeight"></individual-schedule>
        </div>
    `

    public link(scope: IScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctl: ScheduleController) {
        scope.doctors = doctors
        this.controller = ctl
    }
}
