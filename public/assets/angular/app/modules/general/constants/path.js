var app_path = 'assets/angular/app/',
    modules_path = app_path + 'modules/';

angular.module('app.general')
    .constant('AppPaths', {
        app:            app_path,
        modules:        modules_path,
        main:      modules_path + 'main/',
        bulletin:      modules_path + 'bulletin/',
        login:      modules_path + 'login/'
    });