import "angular"
import * as $ from "jquery"

export default class Sidebar implements ng.IDirective {
	public template = `
			<div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li class="sidebar-item">
                           	<div class="custom-info-search-form">
								<span class="name-info">ПАЦИЕНТЫ</span>
                                <span class="pull-right">
                                	<div class="btn-group">
  										<button class="btn btn-success btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled>
    										<i class="fa fa-user"></i>
    										<span class="caret"></span>
  										</button>
  										<ul class="dropdown-menu pull-left">
    										<li>
    											<a href="#"><i class="fa fa-power-off"></i> Завершить работу с пациентом</a>
    										</li>
  										</ul>
									</div>
                                </span>
                                <div class="clearfix"></div>
                            </div>
                            <div class="input-group custom-search-form">
                                <input type="text" class="form-control" placeholder="Введите текст для поиска">
                                <span class="input-group-btn">
                                <button class="btn btn-default" type="button">
                                    <i class="fa fa-search"></i>
                                </button>
                            </span>
                            </div>
                            <!-- /input-group -->
                        </li>
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
                        <doctor-filter />
                    </ul>
                </div>
			`
}
