import "angular"
import * as moment from "moment"
import {Doctor} from "../domain/doctor"
import {Activity} from "../domain/activities"

interface IDoctorScheduleScope extends ng.IScope {
    doctor: Doctor
    date: Date
    prettyDate: string
    scheduleGrid: { Moment: Activity }[]
    humanReadableSchedule: {ActivityType: string}
    scheduleNonEmpty: boolean
}

export default class DoctorSchedule implements ng.IDirective {
    scope = {
        doctor: "=",
        date: "="
    }

    replace = true

    public template = `
        <div data-ng-repeat="a in scheduleGrid" 
            class="activity step-{{doctor.slotDuration}} {{a.activity.activity}}" 
            data-descr="{{a.activity.description}}" 
            data-time="{{a.time.format('HH:mm')}}">
        </div>
    `

    public link(scope: IDoctorScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        scope.scheduleGrid = scope.doctor.getSchedule(scope.date)
        scope.prettyDate = moment(scope.date).format("dd MM DD")
    }
}