import "angular"

import Schedules from "./schedules"
import Schedule from "./schedule"
import IndividualSchedule from "./individual-schedule"
import Sidebar from "./sidebar"
import PatientFilter from "./patient-filter"
import RecordDate from "./record-date"
import DoctorFilter from "./doctor-filter"
import ScheduleController from "../controllers/schedule-controller"

angular.module('angular-ts')

.directive('schedules', ['$timeout', ($timeout) => new Schedules($timeout)])
.directive('schedule', () => new Schedule())
.directive('individualSchedule', ['$timeout', ($timeout) => new IndividualSchedule($timeout)])
.directive('sidebar', () => new Sidebar())
.directive('patientFilter', () => new PatientFilter())
.directive('recordDate', () => new RecordDate())
.directive('doctorFilter', () => new DoctorFilter())
