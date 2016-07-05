import "angular";
import {sortBy, find} from "lodash";
import {patients} from '../domain/data';
import {Patient} from '../domain/patient';

interface IPatientFilterScope extends ng.IScope {
    patients: Array<Patient>
    getName: (any) => void
    logout: () => void
    messages: any
    showBtn: boolean
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
  					<button class="btn btn-success btn-xs dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" ng-disabled="showBtn">
    					<i class="fa fa-user"></i>
    						<span class="caret"></span>
  					</button>
  						<ul class="dropdown-menu pull-left" uib-dropdown-menu>
    						<li>
    							<a href="#" ng-click="logout()"><i class="fa fa-power-off"></i> Завершить работу с пациентом</a>
    						</li>
  						</ul>
				</div>

              </span>
              <div ng-repeat="message in messages">
                <p>{{message.shortName}}</p>
                <p>{{message.birthDate}}</p>
                <p>{{message.policyNumber}}</p>
              </div>
              <div class="clearfix"></div>
          </div>
          <div ng-if="selected-user">
          </div>
          <div class="input-group custom-search-form">
            <input type="text" class="form-control" ng-model="user" placeholder="Введите текст для поиска">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" ng-click="getName(user)">
                   <i class="fa fa-search"></i>
                </button>
              </span>
          </div>
    </li>
    `

    private logout: () => void = () => {
    }

    private getName: (any) => void = (input) => {
        if(!!input) {
            var matches: any = input.match(/[a-zа-я][^\d\s]+[a-zа-я]/ig);
            if ( matches && matches.length >= 2 ) {
                var inputStr: string = matches.join(" ");
                var patientsArr = []
                patients.forEach(value => {
                    if(value.name.toLowerCase().indexOf(inputStr.toLowerCase()) !== -1) {
                        patientsArr.push(value)
                    }
                })
                this.$scope.messages = patientsArr;
                this.$scope.showBtn = false;
            } else if(input.match(/^[0-9]{16}$/)) {
                var patientFilter: any = patients.filter((item) => item.policyNumber === input)
                this.$scope.messages = patientFilter
                this.$scope.showBtn = false;
            } else {
                this.$scope.messages = []
            }
        }
    }

    public link(scope: IPatientFilterScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
        this.$scope = this.scope = scope
        this.$scope.getName = this.getName
        this.$scope.logout = this.logout
        this.$scope = <IPatientFilterScope>scope
        this.$scope.patients = sortBy(patients, 'name')
        this.$scope.messages = []
        this.$scope.showBtn = true
    }
}
