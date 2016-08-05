import 'angular';
import 'angular-ui-bootstrap';
import 'angular-bootstrap-contextmenu/contextMenu';

const app: ng.IModule =
  angular.module('angular-ts', ['ui.bootstrap', 'ui.bootstrap.contextMenu'])
    .config($sceProvider => {
      $sceProvider.enabled(true);
    });

import './styles.scss';
import './controllers/controllers';
import './directives/directives';
