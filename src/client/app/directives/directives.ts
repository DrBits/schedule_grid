import "angular"

import Schedules from "./schedules"
import Schedule from "./schedule"
import IndividualSchedule from "./individual-schedule"
import Sidebar from "./sidebar"

angular.module('angular-ts')

.directive(
  'schedules', 
  ['$timeout', ($timeout) => new Schedules($timeout)])

.directive('schedule', 
  () => new Schedule())

.directive('individualSchedule', ['$timeout', ($timeout) => new IndividualSchedule($timeout)])

.directive('sidebar',
	() => new Sidebar())
