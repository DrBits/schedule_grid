import {Activity, ActivityType, PeriodicActivity, Appointment} from "./activities"
import {TimeRange} from "../util/time-range"

// The base schedule. May only contain periodic activities
export type Schedule = PeriodicActivity[]

export type Appointments = Appointment[]

const nonWorkingHours = new Activity(ActivityType.nonWorkingHours, new TimeRange("00:00-23:59"))

// Base schedule + appointments = EffectiveSchedule
export class EffectiveSchedule {
    schedule: Schedule
    appointments: Appointments

    constructor(schedule: Schedule, appointments: Appointments = []) {
        this.schedule = schedule
        this.appointments = []

        appointments.forEach(this.addAppointment)
    }

    findMatching: (Date) => Activity[] = date =>
        (<Activity[]>this.schedule.filter(act => act.matches(date)))
            .concat(<Activity[]>this.appointments.filter(app => app.matches(date)))

    addAppointment: (Appointment) => void = appointment => this.appointments.push(appointment)

    activityAt: (Date) => Activity = date => {
        const matching = this.findMatching(date)

        return (matching.filter(a => a.activity === ActivityType.workingHours).length > 0) ? 
            (matching.sort((a, b) => b.priority - a.priority)[0]) : nonWorkingHours
    }

    forDay: (Date) => PeriodicActivity[] = date => {
        const x = this.schedule.filter(a => a.matchesDay(date))
        return x
    }
}