const pad2: (number) => string = n => ('0' + n.toString()).substr(-2);

export class TimeOfDay {
    hour: number;
    minutes: number;
    private sinceMidnight: number;

    private setHrMin(hour: number, minutes: number) {
        if (hour < 0 || hour > 23) {
          throw new Error('TimeOfDay: hour must be >= 0 and <= 23');
        }

        if (minutes < 0 || minutes > 59) {
          throw new Error('TimeOfDay: minutes must be >= 0 and <= 59');
        }

        this.hour = hour;
        this.minutes = minutes;
        this.sinceMidnight = hour * 60 + minutes;
    }

    public toString: () => string = () => `${pad2(this.hour)}:${pad2(this.minutes)}`;

    // allows for comparisons with simple JS operators: < > === <= >=
    public valueOf: () => number = () => this.sinceMidnight;

    public equals(that: TimeOfDay): boolean {
      return this.hour === that.hour && this.minutes === that.minutes;
    }

    constructor(p: string | [number, number]) {
        if (typeof p === 'string') {
            if (/\d\d?:\d\d?/.test(p)) {
                const [hour, minutes] = p.split(':');
                this.setHrMin(parseInt(hour, 10), parseInt(minutes, 10));
            } else {
              throw new Error('TimeOfDay: invalid format, must be xx:yy');
            }
        } else {
            const [hour, minutes] = p;
            this.setHrMin(hour, minutes);
        }
    }
}
