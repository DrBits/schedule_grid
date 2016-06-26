import "angular"
import {Doctor} from "../domain/doctor"
import {ActivityType} from "../domain/activities"

interface IHumanReadableScheduleScope extends ng.IScope {
    doctor: Doctor
    date: Date
    humanReadableSchedule: {ActivityType: string}
    scheduleNonEmpty: boolean
}

export default class HumanReadableSchedule implements ng.IDirective {
    scope = {
        doctor: '=',
        date: '='
    }

    replace = true

    public template = `
        <div class="human-readable-schedule">
            <div ng-repeat="(a, b) in humanReadableSchedule">{{a}} {{b}}</div>
        </div>
    `

    public link (scope:IHumanReadableScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        scope.humanReadableSchedule = scope.doctor.getHumanReadableSchedule(scope.date)
        scope.scheduleNonEmpty = ActivityType.workingHours in scope.humanReadableSchedule
    }
}