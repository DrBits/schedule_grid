import {EffectiveSchedule} from "./schedules"
import * as moment from 'moment'
import {Activity} from "./activities"
import Cache from "../util/cache"

export class Doctor {
    name: string
    facility: string
    roomNumber: number
    specialization: string
    slotDuration: number
    schedule: EffectiveSchedule

    private cache: Cache<Date, Array<{Moment: Activity}>>

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

        const boundFn = this.calculateSchedule.bind(this)
        this.cache = new Cache<Date, Array<{Moment: Activity}>>(boundFn)
    }

    calculateSchedule(date: Date): Array<{Moment: Activity}> {
        const schedule = []

        let t: moment.Moment = moment(date).startOf('day').add(8, "hours")
        const endT: moment.Moment = moment(date).startOf('day').add(21, "hours")

        do { schedule.push({time: moment(t), activity: this.schedule.activityAt(t.toDate())}) } 
        while (t.add(this.slotDuration, "minutes").isBefore(endT)) 

        return schedule
    }

    getSchedule(date: Date): Array<{Moment: Activity}> {
        return this.cache.get(date)
    }
}