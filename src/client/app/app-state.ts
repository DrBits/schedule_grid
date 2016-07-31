import * as moment from 'moment';
import {Patient} from './domain/patient';

export type AppState = {
  startDate:Date
  selectedPatient:Patient | void
}

export const appState:AppState = {
  startDate: moment().startOf('day').toDate(),
  selectedPatient: undefined
};
