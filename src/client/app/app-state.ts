import * as moment from "moment"

export type AppState = {
    startDate: Date
}

export const appState: AppState = {
    startDate: moment().add(1, "days").startOf("day").toDate() 
}