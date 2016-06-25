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
            <div ng-repeat="(a, b) in humanReadableSchedule">{{a}} {{b}}    </div>
        </div>
    `

    public link (scope:IHumanReadableScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        const scheduleForDay = scope.doctor.schedule.forDay(scope.date).filter(a => a.activity !== ActivityType.availableForAppointments)

        const sch: {ActivityType: string} = <{ActivityType: string}>{}
                
        const aTypes = [ ActivityType.workingHours, ActivityType.unavailable, ActivityType.training, ActivityType.paperwork,
          ActivityType.training, ActivityType.vacation, ActivityType.sickLeave ]

        aTypes.forEach(aT => {
            const xs = scheduleForDay.filter(a => a.activity === aT)
            if (xs.length > 0) sch[aT] = xs.map(x => x.range.toString()).join(", ")
        })

        scope.humanReadableSchedule = sch
        
        scope.scheduleNonEmpty = sch[ActivityType.workingHours] !== undefined
    }
}