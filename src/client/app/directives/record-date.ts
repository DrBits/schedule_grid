import "angular";

export default class RecordDate implements ng.IDirective {

    public template: string = `
						<li class="sidebar-item">
                        	<div class="custom-info-search-form">
                        		<span class="name-info">ДАТА ЗАПИСИ</span>
                        		<div class="clearfix"></div>
                        	</div>
                        	<div class="input-group custom-search-form date" id="datetimepicker1">
                    			<input type='text' class="form-control" placeholder="ДД.ММ.ГГГГ"/>
                    			<span class="input-group-btn">
                        			<button class="btn btn-default">
										<i class="fa fa-calendar"></i>
                        			</button>
                    			</span>
            				</div>
                        </li>
	`
}
