import {EffectiveSchedule} from "./schedules"
import * as moment from 'moment'
import {Activity, ActivityType} from "./activities"
import Cache from "../util/cache"

export class Doctor {
    name: string
    facility: string
    roomNumber: number
    specialization: string
    slotDuration: number
    schedule: EffectiveSchedule

    private cache: Cache<Date, Array<{Moment: Activity}>>
    private hrCache: Cache<Date, {ActivityType: string}>

    constructor(
        name: string,
        facility: string,
        roomNumber: number,
        specialization: string,
        slotDuration: number,
        schedule: EffectiveSchedule
    ) {
        this.name = name
        this.facility = facility
        this.roomNumber = roomNumber
        this.specialization = specialization
        this.slotDuration = slotDuration
        this.schedule = schedule
 
        this.cache = new Cache<Date, Array<{Moment: Activity}>>(this.calculateSchedule.bind(this))
        this.hrCache = new Cache<Date, {ActivityType: string}>(this.calculateHumanReadableSchedule.bind(this))
    }

    calculateSchedule(date: Date): Array<{Moment: Activity}> {
        const schedule = []

        let t: moment.Moment = moment(date).startOf('day').add(8, "hours")
        const endT: moment.Moment = moment(date).startOf('day').add(21, "hours")

        do { schedule.push({time: moment(t), activity: this.schedule.activityAt(t.toDate())}) } 
        while (t.add(this.slotDuration, "minutes").isBefore(endT)) 

        return schedule
    }

    calculateHumanReadableSchedule(date: Date): {ActivityType: string} {
        const scheduleForDay = this.schedule.forDay(date).filter(a => a.activity !== ActivityType.availableForAppointments)

        const sch: {ActivityType: string} = <{ActivityType: string}>{}
                
        const aTypes = [ ActivityType.workingHours, ActivityType.unavailable, ActivityType.training, ActivityType.paperwork,
          ActivityType.training, ActivityType.vacation, ActivityType.sickLeave ]

        aTypes.forEach(aT => {
            const xs = scheduleForDay.filter(a => a.activity === aT)
            if (xs.length > 0) sch[aT] = xs.map(x => x.range.toString()).join(", ")
        })

        return sch
    }

    getSchedule(date: Date): Array<{Moment: Activity}> {
        return this.cache.get(date)
    }

    getHumanReadableSchedule(date: Date): {ActivityType: string} {
        return this.hrCache.get(date)
    }

    worksOn(date: Date) {
        return ActivityType.workingHours in this.hrCache.get(date)
    }
}