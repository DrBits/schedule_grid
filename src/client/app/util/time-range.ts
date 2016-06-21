import {TimeOfDay} from './time-of-day'

export class TimeRange {
    since: TimeOfDay
    until: TimeOfDay
    
    constructor(p: [TimeOfDay, TimeOfDay] | string) {
        if (typeof p === 'string') {
            if (/\d\d?:\d\d?-\d\d?:\d\d?/.test(p)) {
                const [since, until] = p.split("-")
                this.since = new TimeOfDay(since)
                this.until = new TimeOfDay(until)
            } else throw new Error(`TimeRange: Invalid input: "${p}"`)
        } else {
            [this.since, this.until] = p
        }
    }

    matches (date: Date): boolean {
        const tod: TimeOfDay = new TimeOfDay([date.getHours(), date.getMinutes()])
        return (tod >= this.since && tod < this.until)
    }

    toString: () => string = () =>`TimeRange(${this.since.toString()}-${this.until.toString()})`
}