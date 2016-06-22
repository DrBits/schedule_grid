export class Patient {
    name: String
    birthDate: Date
    policyNumber: string

    constructor (name: string, birthDate: Date, policyNumber: string) {
        this.name = name
        this.birthDate = birthDate
        this.policyNumber = policyNumber
    }
}