import { EffectiveSchedule } from './schedules';
import * as moment from 'moment';
import { Activity, ActivityType } from './activities';
import Cache from '../util/cache';
import { autobind } from 'core-decorators';
import { Patient } from './patient';
import { TimeRange } from '../util/time-range';
import { Appointment } from './activities';

interface IScheduleItem {
  time: moment.Moment;
  activity: Activity;
}

interface IArrayFind<T> extends Array<T> {
  find: (f: (x: T) => boolean) => T;
  includes: (x: T) => boolean;
}

export class Doctor {
  name: string;
  facility: string;
  roomNumber: number;
  specialization: string;
  slotDuration: number;
  schedule: EffectiveSchedule;

  public visible: boolean = true;
  private cache: Cache<Date, Array<IScheduleItem>>;
  private hrCache: Cache<Date, {ActivityType: string}>;

  constructor(name: string,
              facility: string,
              roomNumber: number,
              specialization: string,
              slotDuration: number,
              schedule: EffectiveSchedule) {
    this.name = name;
    this.facility = facility;
    this.roomNumber = roomNumber;
    this.specialization = specialization;
    this.slotDuration = slotDuration;
    this.schedule = schedule;

    this.cache = new Cache<Date, Array<IScheduleItem>>(this.calculateSchedule);
    this.hrCache = new Cache<Date, {ActivityType: string}>(this.calculateHumanReadableSchedule);
  }

  @autobind
  private calculateSchedule(date: Date): Array<IScheduleItem> {
    const schedule = [];

    let t: moment.Moment = moment(date).startOf('day').add(8, 'hours');
    const endT: moment.Moment = moment(date).startOf('day').add(21, 'hours');

    do {
      schedule.push({ time: moment(t), activity: this.schedule.activityAt(t.toDate()) });
    }
    while (t.add(this.slotDuration, 'minutes').isBefore(endT));

    return schedule;
  }

  @autobind
  private calculateHumanReadableSchedule(date: Date): {ActivityType: string} {
    const scheduleForDay =
      this.schedule.forDay(date).filter(a => a.activity !== ActivityType.availableForAppointments);

    const sch: {ActivityType: string} = <{ActivityType: string}>{};

    const aTypes = [
      ActivityType.workingHours,
      ActivityType.unavailable,
      ActivityType.training,
      ActivityType.paperwork,
      ActivityType.training,
      ActivityType.vacation,
      ActivityType.sickLeave
    ];

    aTypes.forEach(aT => {
      const xs = scheduleForDay.filter(a => a.activity === aT);
      if (xs.length > 0) {
        sch[aT] = xs.map(x => x.range.toString());
      }
    });

    return sch;
  }

  isAppointed(time: moment.Moment, patient: Patient) {

    const tr = new TimeRange(
      `${time.format('HH:mm')}-${moment(time).add(this.slotDuration, 'minutes').format('HH:mm')}`
    );

    const date = moment(time).startOf('day').toDate();

    const existingAppointment =
      (this.schedule.appointments as IArrayFind<Appointment>)
        .find(a => (a.date.getTime() === date.getTime()) && a.range.equals(tr));

    if (existingAppointment) {
      return (existingAppointment.patients as IArrayFind<Patient>).includes(patient);
    } else {
      return false;
    }

    // return Math.random() > .5;
  }

  @autobind addAppointment(time: moment.Moment, patient: Patient) {
    const tr = new TimeRange(
      `${time.format('HH:mm')}-${moment(time).add(this.slotDuration, 'minutes').format('HH:mm')}`
    );
    const date = moment(time).startOf('day').toDate();

    const existingAppointment = (this.schedule.appointments as IArrayFind<Appointment>)
      .find(a => (a.date.getTime() === date.getTime()) && a.range.equals(tr));

    if (existingAppointment) {
      if (!(existingAppointment.patients as IArrayFind<Patient>).includes(patient)) {
        existingAppointment.patients.push(patient);
      }
    } else {
      this.schedule.appointments.push(new Appointment(date, tr, [patient]));
    }
    this.cache.invalidate(date);
    this.hrCache.invalidate(date);
  }

  @autobind deleteAppointment(ac: {time: moment.Moment, activity: Activity}, patient: Patient) {
    const date = ac.time.startOf('day').toDate();

    const existingAppointment: Appointment = (this.schedule.appointments as IArrayFind<Appointment>)
      .find(a => a === ac.activity);

    existingAppointment.patients =
      existingAppointment.patients.filter(p => p !== patient);

    if ((existingAppointment as Appointment).patients.length === 0) {
      this.schedule.appointments = this.schedule.appointments.filter(a => a !== ac.activity);
    }

    this.cache.invalidate(date);
    this.hrCache.invalidate(date);
  }

  getSchedule: (Date) => Array<IScheduleItem> = date => this.cache.get(date);

  getHumanReadableSchedule: (Date) => {ActivityType: string} = date => this.hrCache.get(date);

  worksOn: (Date) => boolean = date => ActivityType.workingHours in this.hrCache.get(date)
}
