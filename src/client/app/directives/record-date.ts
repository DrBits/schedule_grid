import "angular";


interface IRecordDateScope extends ng.IScope {
    open2: () => void
    popup2: boolean
    format: string
}

export default class RecordDate implements ng.IDirective {
    scope: IRecordDateScope
    $scope: IRecordDateScope

    public template: string = `
						<li class="sidebar-item">
                        	<div class="custom-info-search-form">
                        		<span class="name-info">ДАТА ЗАПИСИ</span>
                        		<div class="clearfix"></div>
                        	</div>
                        	<div class="input-group custom-search-form date" id="datetimepicker1">
                    			<input type='text' class="form-control" uib-datepicker-popup={{format}} ng-model="dt" is-open="popup2" min-date="minDate" datepicker-options="dateOptions" ng-required="true" close-text="Close" placeholder="ДД.ММ.ГГГГ"/>
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
    }

    public link(scope: IRecordDateScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) {
        this.$scope = this.scope = scope
        this.$scope.open2 = this.open2
        this.$scope.format = "dd-MM-yyyy"

    }

}
