import "angular"
import * as moment from "moment"
import {Doctor} from "../domain/doctor"
import {Activity} from "../domain/activities"
import {doctors} from "../domain/data"

interface IScheduleScope extends ng.IScope {
    date: Date
    doctors: Doctor[]
    scheduleGrid: { Moment: Activity }[]
    scrollRef: Element
}

export default class Schedule implements ng.IDirective {
    scope = {
        date: '=', 
        doctor: '=',
        scrollRef: '=',
        scrollPos: '='
    }

    replace = false

    public template = `
        <div data-ng-repeat="doctor in doctors" class="schedule" ng-if="doctor.worksOn(date)">
            <individual-schedule doctor="doctor" date="date" scroll-ref="scrollRef" scroll-pos="scrollPos"></individual-schedule>
        </div>
    `

    public link(scope: IScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        scope.doctors = doctors
    }
}
