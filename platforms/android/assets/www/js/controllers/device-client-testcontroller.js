angular.module('pushbudget').controller('deviceTest', ['$scope', '$ionicPlatform', '$ionicPush', '$http', function($scope, $ionicPlatform, $ionicPush, $http){
  $scope.test = 'TEST'
  console.log(ionic.Platform)
  console.log(ionic.Platform.device())
  $scope.platforms = ionic.Platform.platforms
  $scope.device = ionic.Platform.device()
  $scope.android = ionic.Platform.isAndroid()
  $scope.IOS = ionic.Platform.isIOS()
  $scope.crosswalk = ionic.Platform.isCrosswalk()
  $scope.edge = ionic.Platform.isEdge()
  $scope.fullscreen = ionic.Platform.isFullScreen
  $scope.ipad = ionic.Platform.isIPad()
  $scope.webview = ionic.Platform.isWebView()
  $scope.windowsphone = ionic.Platform.isWindowsPhone()
  $scope.navigator = ionic.Platform.navigator
  $scope.platform = ionic.Platform.platform()
  $scope.ua = ionic.Platform.ua
  $scope.version = ionic.Platform.version()
  $scope.logs = [];
  // var push = new Ionic.Push({
  //   "debug": true
  // });
  //
  // push.register(function(token) {
  //   console.log("Device token:", token.token);
  //   $scope.devicetoken = token.token
  // });

  $ionicPush.init({
  "debug": false,
  "onNotification": function(notification) {
    var payload = notification.payload;
    $scope.notification = notification.text;
    console.log(notification, payload);
    console.log($scope.notification);
  },
  "onRegister": function(data) {
    alert("You registered")
    alert(data.token);
    console.log(data.token);
    $scope.devicetoken = data.token
    var obj = {
      token: $scope.devicetoken,
      user: 'Test User'
    }
    $http({
      method: 'POST',
      url: 'http://49c81e19.ngrok.io/app/regtoken/',
      data: obj
    }).then(function(success){
      alert('Success')
    })
  }
});

$ionicPush.register();
  for(var key in $scope){
    var obj = {}
    obj.key = key
    obj.val = $scope[key]
    $scope.logs.push(obj)
  }
}])

/*
_checkPlatforms: ()
detect: ()
device: ()
exitApp: ()
fullScreen: (showFullScreen, showStatusBar)
grade: "a"
is: (type)
isAndroid: ()
isCrosswalk: ()
isEdge: ()
isFullScreen: false
isIOS: ()
isIPad: ()
isReady: true
isWebView: ()
isWindowsPhone: ()
navigator: Navigator
platform: ()
platforms: Array[2]
ready: (cb)
setGrade: (grade)
setPlatform: (n)
setVersion: (v)
showStatusBar: (val)
ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"
version: ()
arguments: null
caller: null
length: 0
name: ""
prototype: ionic.Platform.version
__proto__: ()<function scope>__proto__: Object
*/
