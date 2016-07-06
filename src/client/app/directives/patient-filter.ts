import "angular";
import {sortBy} from "lodash";
import * as moment from "moment"
import {patients} from '../domain/data';
import {Patient} from '../domain/patient';
import {appState, AppState} from '../app-state'

interface IPatientFilterScope extends ng.IScope {
    patients: Array<Patient>
    searchPatient: (string) => void
    formatDateTime: (string) => string
    logout: () => void
    appState: AppState
}

export default class PatientFilter implements ng.IDirective {
    scope: IPatientFilterScope
    $scope: IPatientFilterScope

    public template: string = `
		<li class="sidebar-item">
          <div class="custom-info-search-form">
			<span class="name-info">ПАЦИЕНТЫ</span>
              <span class="pull-right">
                <div class="btn-group" uib-dropdown>
  					<button class="btn btn-success btn-xs dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" 
                      ng-disabled="!appState.selectedPatient">
    					<i class="fa fa-user"></i>
    						<span class="caret"></span>
  					</button>
  						<ul class="dropdown-menu pull-left-custom" uib-dropdown-menu>
    						<li>
    							<a href="#" ng-click="logout()"><i class="fa fa-power-off"></i> Завершить работу с пациентом</a>
    						</li>
  						</ul>
				</div>

              </span>
              <div ng-if="!!appState.selectedPatient" class="custom-list-info">
                <p class="text-primary">{{appState.selectedPatient.shortName}}</p>
                <p class="text-primary">{{::formatDateTime(appState.selectedPatient.birthDate)}} г.р.</p>
                <p class="text-primary">Полис ОМС: {{appState.selectedPatient.policyNumber}}</p>
              </div>
              <div class="clearfix"></div>
          </div>
          <div ng-if="selected-user">
          </div>
          <form ng-submit="searchPatient(user)">
            <div class="input-group custom-search-form">
            <input type="text" class="form-control" ng-model="user" placeholder="Введите текст для поиска">
              <span class="input-group-btn">
                <button class="btn btn-default" type="submit">
                   <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>
    </li>
    `
    private formatDateTime: (string) => string = (datetime) => {
        return moment(datetime).format('MM.DD.YYYY')
    }

    private logout: () => void = () => {
        this.$scope.appState.selectedPatient = undefined;
    }

    private searchPatient: (string) => void = (input) => {
        if (!!input) {
            const matches: RegExpMatchArray = input.match(/[a-zа-я][^\d\s]+[a-zа-я]/ig);
            if ( matches && matches.length >= 2 ) {
                const inputStr: string = matches.join(" ");
                this.$scope.appState.selectedPatient = patients.filter(patient => patient.name.toLowerCase().indexOf(inputStr.toLowerCase()) !== -1)[0];
            } else if (input.match(/^\d{16}$/)) {
                this.$scope.appState.selectedPatient = patients.filter((item) => item.policyNumber === input)[0]
            } else {
                this.$scope.appState.selectedPatient = undefined
            }
        }
    }

    public link(scope: IPatientFilterScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
        this.$scope = this.scope = scope
        this.$scope.searchPatient = this.searchPatient
        this.$scope.logout = this.logout
        this.$scope.formatDateTime = this.formatDateTime
        this.$scope = <IPatientFilterScope>scope
        this.$scope.patients = sortBy(patients, 'name')
        this.$scope.appState = appState
    }
}
