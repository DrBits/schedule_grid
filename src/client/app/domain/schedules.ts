import { Activity, ActivityType, PeriodicActivity, Appointment } from './activities';
import { TimeRange } from '../util/time-range';

// The base schedule. May only contain periodic activities
export type Schedule = PeriodicActivity[]

export type Appointments = Appointment[]

const nonWorkingHours = new Activity(ActivityType.nonWorkingHours, new TimeRange('00:00-23:59'));
const noAppointments = new Activity(ActivityType.noAppointments, new TimeRange('00:00-23:59'));

// Base schedule + appointments = EffectiveSchedule
export class EffectiveSchedule {
  schedule: Schedule;
  appointments: Appointments;

  constructor(schedule: Schedule, appointments: Appointments = []) {
    this.schedule = schedule;
    this.appointments = [];

    appointments.forEach(this.addAppointment);
  }

  findMatching: (Date) => Array<Activity> = date =>
    (<Activity[]>this.schedule.filter(act => act.matches(date)))
      .concat(<Activity[]>this.appointments.filter(app => app.matches(date)));

  addAppointment: (Appointment) => void = appointment => this.appointments.push(appointment);

  activityAt: (Date) => Activity = date => {
    const matching = this.findMatching(date);

    if (matching.filter(a => a.activity === ActivityType.workingHours).length === 0) {
      return nonWorkingHours;
    }

    const m: Activity[] = matching.sort((a, b) => b.priority - a.priority);

    return m[0];
  };

  activityFor: (date: Date, range: TimeRange) => ActivityType = (date, range) => {
    // this.schedule.map((a: PeriodicActivity) => console.log(a.));
    return ActivityType.noAppointments;
  };

  forDay: (Date) => Array<PeriodicActivity> = date =>
    this.schedule.filter(a => a.matchesDay(date))
}
