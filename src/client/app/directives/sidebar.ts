import "angular"

export default class Sidebar implements ng.IDirective {
	public template = `
			<div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <li class="sidebar-item">
                           	<div class="custom-info-search-form">
															<span class="name-info">Пациенты</span>
                                <span class="pull-right">
                                	<div class="btn-group">
  										<button class="btn btn-success btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
                                <input type="text" class="form-control" placeholder="Search...">
                                <span class="input-group-btn">
                                <button class="btn btn-default" type="button">
                                    <i class="fa fa-search"></i>
                                </button>
                            </span>
                            </div>
                            <!-- /input-group -->
                        </li>
                        <li class="sidebar-item">
                        	
                        </li>
                    </ul>
                </div>
			`
}