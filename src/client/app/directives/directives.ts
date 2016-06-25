import "angular"

import Schedules from "./schedules"
import Schedule from "./schedule"
import ScheduleHeader from "./schedule-header"
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

.directive('scheduleHeader', () => new ScheduleHeader())

.directive('doctorSchedule', () => new DoctorSchedule())