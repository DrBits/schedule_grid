import "angular";
import {AppState, appState} from "../app-state"


interface IRecordDateScope extends ng.IScope {
    open2: () => void
    popup2: boolean
    format: string
    dateOptions: any
	appState: AppState
}

export default class RecordDate implements ng.IDirective {
    scope: IRecordDateScope
    $scope: IRecordDateScope

    public template: string = `
		<li class="sidebar-item">
			<div class="custom-info-search-form">
				<span class="name-info">ДАТА ЗАПИСИ {{appState.startDate}}</span>
				<div class="clearfix"></div>
			</div>
			<div class="input-group custom-search-form date" id="datetimepicker1">
				<input
					type="text"
					class="form-control"
					uib-datepicker-popup="{{format}}"
					ng-model="appState.startDate"
					is-open="popup2"
					datepicker-options="dateOptions"
					ng-required="true"
					close-text="Close"
					alt-input-formats="altInputFormats"
					placeholder="ДД.ММ.ГГГГ"/>
				<span class="input-group-btn">
					<button class="btn btn-default" ng-click="open2()">
						<i class="fa fa-calendar"></i>
					</button>
				</span>
			</div>
		</li>
	`

    private open2: () => void = () => {
        this.$scope.popup2 = true
        this.$scope.dateOptions = {
            formatYear: 'yy',
            minDate: new Date(),
            startingDay: 1
        };
    }

    public link(scope: IRecordDateScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
        this.$scope = this.scope = scope
        this.$scope.open2 = this.open2
        this.$scope.format = "dd-MM-yyyy"
		this.$scope.appState = appState
    }
}