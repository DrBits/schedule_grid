import "angular";
import {AppState, appState} from "../app-state"
import {doctors} from "../domain/data"
import {Doctor} from "../domain/doctor"
import {lazyInitialize as lazy} from "core-decorators"
import {groupBy, sortBy} from "lodash"
import FilterController from "../controllers/schedule-controller"

enum ShowBy {
  alpabet = 'alphabet' as any as ShowBy,
  specialization = 'specialization' as any as ShowBy
}

interface IDoctorFilterScope extends ng.IScope {
  doctors: Array<Doctor>
  doctorsBySpecialization: {[specialization: string]: Array<Doctor>}
  showBy: ShowBy
  showBySpecialization: () => void
  showByAlphabet: () => void
  selectAll: () => void
  deselectAll: () => void
  appState: AppState
  allSelected: (string) => boolean
  selectAllBySpec: (string, boolean) => void
  selectedDoctor: Doctor | void
}

export default class DoctorFilter implements ng.IDirective {
  $scope: IDoctorFilterScope
  replace = true
  require = "^schedules"
  restrict = 'E'
  controller: FilterController

  public template: string = `
    <li class="sidebar-item">
        <div class="custom-info-search-form">
            <span class="name-info">СПЕЦИАЛИСТЫ ({{doctors.length}}/{{doctors.length}})</span>
            <span class="pull-right">
                <div class="btn-group" uib-dropdown>
                  <button class="btn btn-success btn-xs dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fa fa-filter"></i>
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu pull-left-custom" uib-dropdown-menu>
    				<li>
    				    <a href="#" ng-click="selectAll()"><i class="fa fa-check"></i> Выбрать все</a>
    				</li>
    				<li>
    				    <a href="#" ng-click="deselectAll()"><i class="fa fa-times"></i> Отменить все</a>
    				</li>
  				  </ul>
                </div>
            </span>
            <div class="clearfix"></div>
        </div>
        <div class="input-group custom-search-form" >
            <input type="text" class="form-control" placeholder="Введите текст для поиска"
                uib-typeahead="doctor as doctor.name for doctor in doctors | filter: {name: $viewValue}"
                ng-model="selectedDoctor"
            ></input>
            
            <span class="input-group-btn">
                <button class="btn btn-default" type="button"><i class="fa fa-search"></i></button>
            </span>
        </div>
        <div class="input-group custom-info-search-form">
            <span class="pull-left"><button ng-click="showBySpecialization()" class="btn btn-default">По специальностям</button></span>
            <span class="pull-right"><button ng-click="showByAlphabet()" class="btn btn-default">По алфавиту</button></span>
        </div>
        <div class="custom-info-search-form">
            <div class="checkboxes">
                <div class="checkboxes__group">
                    <div ng-if="showBy === 'alphabet'" ng-repeat="doctor in doctors" class="checkboxes__item">
                        <div class="checkbox__info">
                            <input ng-model="doctor.visible" type="checkbox" id="doctor-{{doctor.$$hashKey}}" /><label for="doctor-{{doctor.$$hashKey}}">{{doctor.name}}</label>
                        </div>
                    </div>
                    <div ng-if="showBy === 'specialization'" ng-repeat="(specialization, doctors) in doctorsBySpecialization" class="">
                        <div class="clearfix">
                            <input type="checkbox" id="spec-{{specialization}}" 
                                ng-checked="allSelected(specialization)" 
                                ng-click="selectAllBySpec(specialization, !allSelected(specialization))"/>
                            <label for="spec-{{specialization}}">{{specialization}}</label>
                            <div ng-repeat="doctor in doctors" class="checkboxes__item">
                                <div class="checkbox__info">
                                    <input ng-model="doctor.visible" type="checkbox" id="doctor-{{doctor.$$hashKey}}" /><label for="doctor-{{doctor.$$hashKey}}">{{doctor.name}}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </li>
  `

  private showByAlphabet: () => void = () => this.$scope.showBy = ShowBy.alpabet
  private showBySpecialization: () => void = () => this.$scope.showBy = ShowBy.specialization

  private selectAll: () => void = () => doctors.forEach(d => d.visible = true)

  private allSelected: (string) => boolean = (spec) =>
      doctors.filter(d => d.specialization === spec).reduce((a, b) => a && b.visible, true)

  private selectAllBySpec: (string, boolean) => void = (spec, select) =>
      doctors.filter(d => d.specialization === spec).forEach(d => d.visible = select)

  private deselectAll: () => void = () => doctors.forEach(d => d.visible = false)

  private selectOnly: (Doctor) => void = (d) => {
      this.deselectAll()
      d.visible = true
  }

  public link(scope: IDoctorFilterScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, filterController: FilterController) {
    this.$scope = scope as IDoctorFilterScope
    this.$scope.doctors = sortBy(doctors, 'name')
    this.$scope.doctorsBySpecialization = groupBy(doctors, 'specialization')
    this.$scope.showBy = ShowBy.alpabet
    this.$scope.showBySpecialization = this.showBySpecialization
    this.$scope.showByAlphabet = this.showByAlphabet
    this.controller = filterController
    scope.selectAll = this.selectAll
    scope.deselectAll = this.deselectAll
    scope.appState = appState
    scope.allSelected = this.allSelected
    scope.selectAllBySpec = this.selectAllBySpec

    scope.$watch('selectedDoctor', (d: string | Doctor) => d instanceof Doctor && this.selectOnly(d))
  }
}
