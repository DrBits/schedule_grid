import 'angular';

import Schedules from './schedules';
import Schedule from './schedule';
import IndividualSchedule from './individual-schedule';
import Sidebar from './sidebar';
import PatientFilter from './patient-filter';
import RecordDate from './record-date';
import DoctorFilter from './doctor-filter';

angular.module('angular-ts')

.directive('schedules', ['$timeout', ($timeout) => new Schedules($timeout)])
.directive('schedule', () => new Schedule())
.directive(
  'individualSchedule',
  ['$timeout', '$sce', '$uibModal', ($timeout, $sce, $uibModal) =>
  new IndividualSchedule($timeout, $sce, $uibModal)]
)
.directive('sidebar', () => new Sidebar())
.directive('patientFilter', () => new PatientFilter())
.directive('recordDate', () => new RecordDate())
.directive('doctorFilter', () => new DoctorFilter());
