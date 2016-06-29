import "angular"

import Schedules from "./schedules"
import Schedule from "./schedule"
import Sidebar from "./sidebar"

angular.module('angular-ts')

.directive(
  'schedules', 
  ['$timeout', ($timeout) => new Schedules($timeout)])

.directive('schedule', 
  () => new Schedule())

.directive('sidebar',
	() => new Sidebar())