
import "angular"
import * as moment from "moment"
import {Doctor} from "../domain/doctor"
import {Activity} from "../domain/activities"
import {doctors} from "../domain/data" 

interface IScheduleHeaderScope extends ng.IScope {
    date: Date
    doctors: Doctor[]
    scheduleGrid: { Moment: Activity }[]
    prettyDate: string
}

export default class ScheduleHeader implements ng.IDirective {
    scope = { date: '=', doctor: "=" }
    replace = true

    public template = `
        <div class="schedule-header">
            <div class="schedule-header-doctor">
                <div class="date">{{prettyDate}}</div>
                <div class="doctor-name">{{doctor.name}}</div>
                <div class="doctor-specialization">{{doctor.specialization}}</div>
                <div class="doctor-facility">{{doctor.facility}}, к.&nbsp;{{doctor.roomNumber}}</div>
                <human-readable-schedule doctor="doctor" date="date"></human-readable-schedule>
            </div>
        </div>
    `

    public link(scope: IScheduleHeaderScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        scope.doctors = doctors
        scope.prettyDate = moment(scope.date).format("dd MM DD")
    }
}