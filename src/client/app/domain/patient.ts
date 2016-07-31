export class Patient {
  name: string;
  shortName: string;
  birthDate: Date;
  policyNumber: string;

  constructor(name: string, shortName: string, birthDate: Date, policyNumber: string) {
    this.name = name;
    this.shortName = shortName;
    this.birthDate = birthDate;
    this.policyNumber = policyNumber;
  }
}
