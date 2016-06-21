import {EffectiveSchedule} from "./schedules"

export class Doctor {
    name: string
    facility: string
    roomNumber: number
    specialization: string
    slotDuration: number
    schedule: EffectiveSchedule

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
}