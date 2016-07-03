import "angular"
import * as $ from "jquery"

export default class Sidebar implements ng.IDirective {
	public template = `
        <div class="sidebar-nav navbar-collapse">
            <ul class="nav" id="side-menu">
                <patient-filter></patient-filter>
                <record-date></record-date>
                <doctor-filter></doctor-filter>
            </ul>
        </div>
    `
}
