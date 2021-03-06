import { EffectiveSchedule } from './schedules';
import * as moment from 'moment';
import { Activity, ActivityType, PeriodicActivity } from './activities';
import Cache from '../util/cache';
import { autobind } from 'core-decorators';
import { Patient } from './patient';
import { TimeRange } from '../util/time-range';
import { Appointment } from './activities';
import { TimeOfDay } from '../util/time-of-day';

interface IScheduleItem {
  time: moment.Moment;
  activity: Activity;
}

interface IArrayFind<T> extends Array<T> {
  find: (f: (x: T) => boolean) => T;
  includes: (x: T) => boolean;
}

interface ES6Array<T> extends Array<T> {
  find: (predicate: (T) => boolean) => T;
  includes: (T) => boolean;
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

  // @autobind
  // private calculateSchedule(date: Date): Array<IScheduleItem> {
  //   const schedule = [];
  //
  //   let t: moment.Moment = moment(date).startOf('day').add(8, 'hours');
  //   const endT: moment.Moment = moment(date).startOf('day').add(21, 'hours');
  //
  //   do {
  //     schedule.push({ time: moment(t), activity: this.schedule.activityAt(t.toDate()) });
  //   }
  //   while (t.add(this.slotDuration, 'minutes').isBefore(endT));
  //
  //   return schedule;
  // }

  @autobind
  private calculateSchedule(date: Date): Array<IScheduleItem> {
    const startingMoment: (Activity) => moment.Moment = a =>
      moment(date).add(a.range.since.hour, 'hours').add(a.range.since.minutes, 'minutes');

    return this.scheduleTable(date).map(a => ({time: startingMoment(a), activity: a }));
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
  }

  @autobind addAppointment(time: moment.Moment, patient: Patient) {
    console.log('adding app', time.toDate(), patient);
    console.log('current appointments', this.schedule.appointments);
    const tr = new TimeRange(
      `${time.format('HH:mm')}-${moment(time).add(this.slotDuration, 'minutes').format('HH:mm')}`
    );
    console.log('tr', tr);
    const date = moment(time).startOf('day').toDate();

    const existingAppointment = (this.schedule.appointments as IArrayFind<Appointment>)
      .find(a => {
        console.log('times', a.date.toDateString(), date.toDateString());
        console.log('ranges', a.range.toString(), tr.toString());
        return (a.date.getTime() === date.getTime()) && a.range.equals(tr);
      });

    console.log('existing app:', existingAppointment);

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
    const tr = new TimeRange(
      `${ac.time.format('HH:mm')}-${moment(ac.time).add(this.slotDuration, 'minutes').format('HH:mm')}`
    );

    const date = ac.time.startOf('day').toDate();

    const existingAppointment: Appointment = (this.schedule.appointments as IArrayFind<Appointment>)
      .find(a => (moment(a.date).date() === ac.time.date()) && a.range.equals(tr));

    existingAppointment.patients =
      existingAppointment.patients.filter(p => p !== patient);

    if ((existingAppointment as Appointment).patients.length === 0) {
      this.schedule.appointments = this.schedule.appointments.filter(a => a !== existingAppointment);
    }

    this.cache.invalidate(date);
    this.hrCache.invalidate(date);
  }

  getSchedule: (Date) => Array<IScheduleItem> = date => this.cache.get(date);

  getHumanReadableSchedule: (Date) => {ActivityType: string} = date => this.hrCache.get(date);

  worksOn: (Date) => boolean = date => ActivityType.workingHours in this.hrCache.get(date);

  scheduleTable: (date: Date) => Activity[] = date => {
    const nonWorkingHours: (TimeRange) => Activity =
      range => new Activity(ActivityType.nonWorkingHours, range);

    const noAppointments: (TimeRange) => Activity =
      range => new Activity(ActivityType.noAppointments, range);

    const ranges: TimeRange[] = TimeRange.timeRanges(
      date, new TimeOfDay('08:00'), new TimeOfDay('20:00'), [this.slotDuration, 'minutes']
    );

    const activityMatch = (date: Date, r: TimeRange) => (a: PeriodicActivity) =>
      a.matchesDay(date) &&
      (a.range.overlapMinutes(r) / r.length()) > 0;

    const appointmentMatch = (d: Date, r: TimeRange) => (a: Appointment) => {
      return a.date.getDate() === d.getDate() && a.range.equals(r);
    };

    const f: (TimeRange) => [TimeRange, Activity[]] =
      r => [
        r,
        (this.schedule.schedule as Activity[]).filter(activityMatch(date, r))
          .concat(
            (this.schedule.appointments as Activity[]).filter(appointmentMatch(date, r))
          ).sort((a, b) => b.priority - a.priority)
      ];

    const zz = ranges.map(f).map(([r, aa]) => {
      function sortOverlapping(a1: Activity, a2: Activity): [Activity, Activity] {
        return (a2.range.length() < a1.range.length() && a2.range.since.equals(a1.range.since)) ?
          [a2, a1] : [a1, a2];
      }

      if (aa.length) {
        const avail: Activity = (aa as ES6Array<PeriodicActivity>)
          .find(a => a.activity === ActivityType.availableForAppointments);

        if (aa[0].activity !== ActivityType.availableForAppointments &&
          aa[0].activity !== ActivityType.appointment &&
          aa[0].range.overlap(r).length() < this.slotDuration * 0.8 &&
          avail !== undefined
        ) {
          return sortOverlapping(
            noAppointments(avail.range.overlap(r)),
            aa[0].withRange(aa[0].range.overlap(r))
          );
        } else {
          return aa[0].withRange(r);
        }
      } else {
        return nonWorkingHours(r);
      }
    });

    return Array.prototype.concat([], ...zz);
  };
}
