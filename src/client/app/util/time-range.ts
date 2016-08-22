import {TimeOfDay} from './time-of-day';
import * as moment from 'moment';

export class TimeRange {
  since: TimeOfDay;
  until: TimeOfDay;

  constructor(p:[TimeOfDay, TimeOfDay] | string) {
    if (typeof p === 'string') {
      if (/\d\d?:\d\d?-\d\d?:\d\d?/.test(p)) {
        const [since, until] = p.split('-');
        this.since = new TimeOfDay(since);
        this.until = new TimeOfDay(until);
      } else {
        throw new Error(`TimeRange: Invalid input: "${p}"`);
      }
    } else {
      [this.since, this.until] = p;
    }
  }

  matches(date: Date): boolean {
    const tod: TimeOfDay = new TimeOfDay([date.getHours(), date.getMinutes()]);
    return (tod >= this.since && tod < this.until);
  }

  equals(that: TimeRange): boolean {
    return (
      this.since.equals(that.since) && this.until.equals(that.until)
    );
  }

  overlaps(that: TimeRange): boolean {
    return (
      (this.since <= that.since && that.since <= this.until) ||
      (this.since <= that.until && that.until <= this.until)
    );
  }

  length(): number {
    return this.until.valueOf() - this.since.valueOf();
  }

  overlapMinutes(that: TimeRange): number {
    const diff = (Math.min(that.until.valueOf(), this.until.valueOf()) -
      Math.max(that.since.valueOf(), this.since.valueOf()));

    return diff > 0 ? diff : 0;
  }

  overlap(that: TimeRange): TimeRange {
    const a = that.until.valueOf() < this.until.valueOf() ? that.until : this.until;
    const b = that.since.valueOf() > this.since.valueOf() ? that.since : this.since;
    if (this.overlapMinutes(that) > 0) {
      return new TimeRange([b, a]);
    } else {
      return new TimeRange([a, a]);
    }
  }

  toString:() => string = () => `${this.since.toString()}-${this.until.toString()}`;

  static timeRanges: (date: Date,
                      since: TimeOfDay,
                      until: TimeOfDay,
                      granularity: [number, moment.UnitOfTime]) => TimeRange[] =
    (date, since, until, granularity) => {
      const m: moment.Moment =
        moment(date).startOf('day').add(since.hour, 'hours').add(since.minutes, 'minutes');

      const n: moment.Moment =
        moment(date).startOf('day').add(until.hour, 'hours').add(until.minutes, 'minutes');

      const ranges: TimeRange[] = [];

      do {
        const aa = m.toDate();
        const bb = moment(m).add(granularity[0], granularity[1]).toDate();
        ranges.push(
          new TimeRange([
            new TimeOfDay([aa.getHours(), aa.getMinutes()]),
            new TimeOfDay([bb.getHours(), bb.getMinutes()])
          ]));
      } while (m.add(granularity[0], granularity[1]).isBefore(n));

      return ranges;
    };
}
