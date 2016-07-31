import 'angular';
const ngTemplate = require('../templates/sidebar.html');

export default class Sidebar implements ng.IDirective {
  public templateUrl = ngTemplate;
}
