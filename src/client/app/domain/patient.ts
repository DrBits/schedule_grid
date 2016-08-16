import * as moment from 'moment';

export class Patient {
  name: string;
  shortName: string;
  birthDate: Date;
  policyNumber: string;

  public get formattedBirthDate() {
    return moment(this.birthDate).format('DD.MM.YYYY');
  }

  constructor(name: string, shortName: string, birthDate: Date, policyNumber: string) {
    this.name = name;
    this.shortName = shortName;
    this.birthDate = birthDate;
    this.policyNumber = policyNumber;
  }
}
