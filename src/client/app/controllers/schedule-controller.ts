import "angular"
import {Doctor} from "../domain/doctor"
import {doctors} from "../domain/data"

interface IScheduleControllerScope extends ng.IScope {
}

export default class FilterController {
  $scope: IScheduleControllerScope
  
  constructor($scope) {
    this.$scope = $scope
  } 
}