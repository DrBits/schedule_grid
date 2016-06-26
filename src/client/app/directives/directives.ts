import "angular"

import Schedules from "./schedules"
import Schedule from "./schedule"
import HumanReadableSchedule from "./human-readable-schedule"
import DoctorSchedule from "./doctor-schedule"

angular.module('angular-ts')

.directive(
  'schedules', 
  ['$timeout', ($timeout) => new Schedules($timeout)])

.directive('humanReadableSchedule', 
  () => new HumanReadableSchedule())

.directive('schedule', 
  () => new Schedule())

.directive('doctorSchedule', () => new DoctorSchedule())