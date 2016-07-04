import "angular";
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
                  <ul class="dropdown-menu pull-left" uib-dropdown-menu>
    				<li>
    				    <a href="#"><i class="fa fa-check"></i> Выбрать все</a>
    				</li>
    				<li>
    				    <a href="#"><i class="fa fa-times"></i> Отменить все</a>
    				</li>
  				  </ul>
                </div>
            </span>
            <div class="clearfix"></div>
        </div>
        <div class="input-group custom-search-form">
            <input type="text" class="form-control" placeholder="Введите текст для поиска">
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
                    <div ng-if="showBy === 'specialization'" ng-repeat="(specialization, doctors) in doctorsBySpecialization" class="checkboxes__item">
                        <div>{{specialization}}
                            <div ng-repeat="doctor in doctors">
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

  public link(scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, filterController: FilterController) {
    this.$scope = scope as IDoctorFilterScope
    this.$scope.doctors = sortBy(doctors, 'name')
    this.$scope.doctorsBySpecialization = groupBy(doctors, 'specialization')
    this.$scope.showBy = ShowBy.alpabet
    this.$scope.showBySpecialization = this.showBySpecialization
    this.$scope.showByAlphabet = this.showByAlphabet
    this.controller = filterController
  }
}
