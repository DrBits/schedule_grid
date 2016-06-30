import "angular";
import {Doctor} from "../domain/doctor"
import * as moment from "moment"
import {autobind} from "core-decorators"
import * as $ from 'jquery'

interface IIndividualScheduleScope extends ng.IScope {
    date: Date
    doctor: Doctor
    prettyDate: string
    scrollRef: Element
    shouldCollapse: () => boolean
    collapse: boolean
    scrollPos: number
    uncollapse: () => void
    forceUncollapse: boolean
}

export default class IndividualSchedule implements ng.IDirective {
  scope = {
    doctor: '=',
    date: '=',
    scrollRef: '=',
    scrollPos: '='
  }

  $scope: IIndividualScheduleScope
  replace = true
  private humanReadableSchedule: Element
  private strut: Element
  private scheduleHeader: Element
  private $timeout: ng.ITimeoutService

  constructor($timeout) {
      this.$timeout = $timeout
  }

  public template = `
      <div>
        <div class="schedule-header"> 
            <div class="schedule-header-doctor" ng-class="{collapsed: shouldCollapse() }">
                <div class="date">{{prettyDate}}</div>
                <div class="doctor-name">{{doctor.name}}</div>
                <div class="doctor-specialization">{{doctor.specialization}}</div>
                <div class="doctor-facility">{{doctor.facility}}, к.&nbsp;{{doctor.roomNumber}}</div>
                <human-readable-schedule doctor="doctor" date="date"></human-readable-schedule>
                <div class="doctor-working">
                    Врач работает <button ng-click="uncollapse()">...</button>
                </div>
                <div class="human-readable-schedule">
                    <div ng-repeat="(a, b) in doctor.getHumanReadableSchedule(date)">{{a}} {{b}}</div>
                </div>
            </div>
        </div>
        <div class="strut activity"></div>
        <div data-ng-repeat="a in doctor.getSchedule(date)"
            class="activity step-{{doctor.slotDuration}} {{a.activity.activity}}" 
            data-descr="{{a.activity.description}}" 
            data-time="{{a.time.format('HH:mm')}}">
        </div>
      </div>
  `

  private uncollapse: () => () => void = () => {
    const scope = this.$scope
    const header = this.scheduleHeader
    return () => scope.forceUncollapse = true
  }

  private shouldCollapse: () => () => boolean = () => {
    const hrs = this.humanReadableSchedule
    const scope = this.$scope
    return () => {
      if (scope.forceUncollapse) {
        // this is ugly, but this is Angular
        setTimeout(() => {scope.forceUncollapse = false}, 500)
        return false
      }
      return this.strut.clientHeight - scope.scrollPos < (<HTMLDivElement><any>hrs).offsetTop + hrs.clientHeight / 2}
  }

  public link(scope: IIndividualScheduleScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
    scope.prettyDate = moment(scope.date).locale("ru").format("dd. DD MMM")
    this.humanReadableSchedule = element[0].querySelector(".human-readable-schedule")
    this.scheduleHeader = element[0].querySelector(".schedule-header-doctor")
    this.strut = element[0].querySelector(".strut")
    this.$scope = scope

    scope.shouldCollapse = this.shouldCollapse()
    scope.uncollapse = this.uncollapse()
    scope.forceUncollapse = false
  }
}