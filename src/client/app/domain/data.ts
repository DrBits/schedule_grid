import { TimeOfDay } from '../util/time-of-day';
import { TimeRange } from '../util/time-range';
import { ActivityType, Activity, PeriodicActivity, Appointment } from './activities';
import { Schedule, EffectiveSchedule } from './schedules';
import { Doctor } from './doctor';
import { Patient } from './patient';
import * as moment from 'moment';

export const patients: Patient[] = [
  new Patient('Иванов Иван Иванович', 'Иванов И. И.', moment('2011-11-11').toDate(), '1111111111111111'),
  new Patient('Алексеев Алексей Алексеевич', 'Алексеев А. А.', moment('1922-12-22').toDate(), '2222222222222222'),
  new Patient('Петров Петр Петрович', 'Петров П. П.', moment('1990-01-01').toDate(), '3333333333333333'),
  new Patient('Сергеев Сергей Сергеевич', 'Сергеев С. С.', moment('2002-02-02').toDate(), '4444444444444444'),
  new Patient('Васильев Василий Васильевич', 'Васильев В. В.', moment('1949-09-09').toDate(), '5555555555555555')
];

export const doctors: Doctor[] = [
  new Doctor(
    'Григорьева Г. Г.',
    'ГП №128', 110,
    'Терапевт',
    30,
    new EffectiveSchedule([
        new PeriodicActivity(
          ActivityType.workingHours, new TimeRange('10:00-20:00'), [1, 2, 3, 4, 5],
          moment().startOf('day').toDate(), moment().startOf('day').add(2, 'months').toDate()),

        new PeriodicActivity(
          ActivityType.availableForAppointments, new TimeRange('10:00-14:00'), [1, 2, 3, 4, 5]),

        new PeriodicActivity(
          ActivityType.unavailable, new TimeRange('14:00-15:00'), [1, 2, 3, 4, 5])],

      [
        new Appointment(moment().startOf('day').toDate(), new TimeRange('10:00-10:30'), patients[0]),
        new Appointment(moment().startOf('day').toDate(), new TimeRange('10:00-10:30'), patients[1]),
        new Appointment(moment().startOf('day').toDate(), new TimeRange('10:30-11:00'), patients[2])
      ]
    )
  ),

  new Doctor(
    'Сидорова С. С.',
    'ГП №128', 120,
    'Терапевт',
    30,
    new EffectiveSchedule([
        new PeriodicActivity(
          ActivityType.workingHours, new TimeRange('08:00-15:00'), [1, 2, 3, 4],
          moment().startOf('day').toDate(), moment().startOf('day').add(2, 'months').toDate()),

        new PeriodicActivity(
          ActivityType.availableForAppointments, new TimeRange('10:00-15:00'), [1, 2, 3, 4]),

        new PeriodicActivity(
          ActivityType.training, new TimeRange('10:00-15:00'), [1])],

      [
        new Appointment(moment().startOf('day').toDate(), new TimeRange('12:00-12:30'), patients[3])
      ]
    )
  ),

  new Doctor(
    'Сидорова С. С.',
    'ГП №128', 130,
    'Терапевт',
    10,
    new EffectiveSchedule(
      [
        new PeriodicActivity(
          ActivityType.workingHours, new TimeRange('14:00-18:00'), [5, 6],
          moment().startOf('day').toDate(), // TODO
          moment().startOf('day').add(2, 'months').toDate()), // TODO

        new PeriodicActivity(
          ActivityType.availableForAppointments, new TimeRange('14:00-18:00'), [5, 6]),
      ],
      []
    )
  ),

  new Doctor(
    'Елисеева Е. Е.',
    'ГП №128', 140,
    'Офтальмолог',
    30,
    new EffectiveSchedule(
      [
        new PeriodicActivity(
          ActivityType.workingHours, new TimeRange('08:00-18:00'), [1, 2, 3, 4, 5],
          moment().startOf('day').toDate(), moment().startOf('day').add(2, 'months').toDate()),

        new PeriodicActivity(
          ActivityType.availableForAppointments, new TimeRange('10:00-17:45'), [1, 2, 3, 4, 5]),

        new PeriodicActivity(
          ActivityType.paperwork, new TimeRange('14:30-14:55'), [1, 2, 3, 4, 5]),

        new PeriodicActivity(
          ActivityType.paperwork, new TimeRange('16:20-16:40'), [1, 2, 3, 4, 5]),

      ],
      []
    )
  ),

  new Doctor(
    'Константинова-Щедрина А. А.',
    'ГП №128', 150,
    'Офтальмолог',
    30,
    new EffectiveSchedule(
      [
        new PeriodicActivity(
          ActivityType.workingHours, new TimeRange('09:00-21:00'), [2, 3, 4, 5, 6]
        ),

        new PeriodicActivity(
          ActivityType.availableForAppointments, new TimeRange('09:00-21:00'), [3, 4, 5, 6]
        )
      ],
      []
    )
  )
];
