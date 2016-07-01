import "angular"
import * as $ from "jquery"

export default class Sidebar implements ng.IDirective {
	public template = `
			<div class="sidebar-nav navbar-collapse">
                    <ul class="nav" id="side-menu">
                        <patient-filter />
                        <record-date />
                        <doctor-filter />
                    </ul>
                </div>
			`
}
