import * as moment from "moment"
import {ActivityType, Appointment} from "./domain/activities"
import {doctors} from "./domain/data"

const printSchedule: (Doctor) => void =
    doctor => {
        console.log("------------------------------------------------------------------------------")
        console.log(`${doctor.name} (${doctor.specialization}) ${doctor.facility} каб. ${doctor.roomNumber}`)
        console.log("------------------------------------------------------------------------------")
        for (
            let t = moment().startOf('day').add(8, "hours");
            !t.isAfter(moment().startOf('day').add(21, "hours"));
            t = t.add(doctor.slotDuration, "minutes")
        ) {
            const act = doctor.schedule.activityAt(t.toDate())
            if (act.activity !== ActivityType.nonWorkingHours) {
                console.log(
                    t.format("dd MMM DD HH:mm"),
                    act ?
                        (act instanceof Appointment ?
                            `${act.description}: ${act.patient.name}` : act.description)
                        :
                        "---")
            }
        }
    }

doctors.forEach(printSchedule)