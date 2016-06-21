import {TimeRange} from '../util/time-range'
import {Patient} from "./patient"

export enum ActivityType {
    nonWorkingHours          = <any>'nonWorkingHours',
    workingHours             = <any>'workingHours', 
    unavailable              = <any>'unavailable', 
    availableForAppointments = <any>'availableForAppointments', 
    appointment              = <any>'appointment', 
    training                 = <any>'training', 
    paperwork                = <any>'paperwork', 
    vacation                 = <any>'vacation', 
    sickLeave                = <any>'sickLeave'
}

// priority
// workingHours < availableForAppointments < appointment < [training, paperwork] < [unavailable, vacation, sickLeave]
const activityPriorities: {[key: string]: number} = {
    [ActivityType.nonWorkingHours]: 0,
    [ActivityType.workingHours]: 1,
    [ActivityType.availableForAppointments]: 2,
    [ActivityType.appointment]: 3,
    [ActivityType.training]: 4,
    [ActivityType.paperwork]: 4,
    [ActivityType.unavailable]: 5,
    [ActivityType.vacation]: 5,
    [ActivityType.sickLeave]: 5,
}

const activityDescriptions: {[key: string]: string} = {
    [ActivityType.nonWorkingHours]: "Нерабочее время",
    [ActivityType.workingHours]: "Врач не принимает",
    [ActivityType.availableForAppointments]: "Запись на прием",
    [ActivityType.appointment]: "Прием",
    [ActivityType.training]: "Обучение",
    [ActivityType.paperwork]: "Работа с документами",
    [ActivityType.unavailable]: "Врач не работает",
    [ActivityType.vacation]: "Врач в отпуске",
    [ActivityType.sickLeave]: "Врач на больничном",
}

export class Activity {
    activity: ActivityType
    range: TimeRange

    constructor(activity, range) {
        this.activity = activity
        this.range = range
    }

    get priority(): number { return activityPriorities[this.activity] }
    get description(): string { return activityDescriptions[this.activity] }
}

export class PeriodicActivity extends Activity {
    days: number[]
    validSince: Date | void
    validUntil: Date | void

    constructor(
        activity: ActivityType, 
        range: TimeRange, 
        days: number[] = [1, 2, 3, 4, 5, 6, 7], 
        validSince: Date | void = undefined, 
        validUntil: Date | void = undefined
    ) {
        super(activity, range)
        this.days = days
        this.validSince = validSince
        this.validUntil = validUntil
    }

    matches (date: Date): boolean {
        const dow = date.getDay() + 1
        return (
            (
                (this.validSince === undefined || date > this.validSince) &&
                (this.validUntil === undefined) || date < this.validUntil
            ) && 
            (this.days.indexOf(dow) !== -1) &&
            (this.range.matches(date)) 
        )  
    }
}

export class OneOffActivity extends Activity {
    date: Date

    constructor(activity: ActivityType, date: Date, range: TimeRange) {
        super(activity, range)
        this.date = date
    }

    matches: (Date) => boolean = date => this.range.matches(date)
}

export class Appointment extends OneOffActivity {
    patient: Patient
    constructor(date: Date, range: TimeRange, patient: Patient) {
        super(ActivityType.appointment, date, range)
        this.patient = patient
    }
}