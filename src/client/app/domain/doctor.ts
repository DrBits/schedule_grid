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

  @autobind addAppointment(time: moment.Moment, patient: Patient) {
    const tr = new TimeRange(
      `${time.format('HH:mm')}-${time.add(this.slotDuration, 'minutes').format('HH:mm')}`
    );
    const date = time.startOf('day').toDate();

    this.schedule.appointments.push(new Appointment(date, tr, patient));
    this.cache.invalidate(date);
    this.hrCache.invalidate(date);
  }

  @autobind deleteAppointment(ac) {
    const date = ac.time.startOf('day').toDate();
    this.schedule.appointments = this.schedule.appointments.filter(a => a !== ac.activity);
    this.cache.invalidate(date);
    this.hrCache.invalidate(date);
  }

  getSchedule: (Date) => Array<IScheduleItem> = date => this.cache.get(date);

  getHumanReadableSchedule: (Date) => {ActivityType: string} = date => this.hrCache.get(date);

  worksOn: (Date) => boolean = date => ActivityType.workingHours in this.hrCache.get(date)
}
