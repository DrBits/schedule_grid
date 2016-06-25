import {EffectiveSchedule} from "./schedules"
import * as moment from 'moment'
import {Activity} from "./activities"

export class Doctor {
    name: string
    facility: string
    roomNumber: number
    specialization: string
    slotDuration: number
    schedule: EffectiveSchedule
    private scheduleTable: {Moment: Activity}

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
    }

    getSchedule(date: Date): {Moment: Activity}[] {
        let schedule = []

        let t: moment.Moment = moment(date).startOf('day').add(8, "hours");

        do { schedule.push({time: moment(t), activity: this.schedule.activityAt(t.toDate())}) } 
        while (t.add(this.slotDuration, "minutes").isBefore(moment(date).startOf('day').add(21, "hours"))) 

        return schedule
    }
}