import "angular"
import {Doctor} from "../domain/doctor"
import {doctors} from "../domain/data"

interface IScheduleControllerScope extends ng.IScope {
  filteredDoctors: Array<Doctor>
}

export default class FilterController {
  $scope: IScheduleControllerScope
  
  constructor($scope) {
    console.log("initing FilterController", arguments)
    this.$scope = $scope
    $scope.doctorFilter = []
  }

  test() {
    console.log("TEST!")
    return true
  }

  resetFilter() {
    this.$scope.filteredDoctors = []
  }

  addDoctor: (Doctor) => void = doctor => this.$scope.filteredDoctors.push(doctor) 
}