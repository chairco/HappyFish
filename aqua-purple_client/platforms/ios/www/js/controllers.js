angular.module('starter.controllers', ['ion-tree-list', 'ionic-timepicker', 'ngCordova'])

.directive('standardTimeMeridian', function() {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      etime: '=etime'
    },
    template: "<strong>{{stime}}</strong>",
    link: function(scope, elem, attrs) {

      scope.stime = epochParser(scope.etime, 'time');

      function prependZero(param) {
        if (String(param).length < 2) {
          return "0" + String(param);
        }
        return param;
      }

      function epochParser(val, opType) {
        if (val === null) {
          return "00:00";
        } else {
          var meridian = ['AM', 'PM'];

          if (opType === 'time') {
            var hours = parseInt(val / 3600);
            var minutes = (val / 60) % 60;
            var hoursRes = hours > 12 ? (hours - 12) : hours;

            var currentMeridian = meridian[parseInt(hours / 12)];

            return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
          }
        }
      }

      scope.$watch('etime', function(newValue, oldValue) {
        scope.stime = epochParser(scope.etime, 'time');
      });

    }
  };
})


.controller('BarcodeCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $ionicLoading, $state) {
	
	var success = function(gmappedport) {
		$state.go("app.my-aquas_main", {ports: gmappedport}); 
    }

    var failure = function() {
        alert("Error calling Tunnel Plugin");
    }
	
	$scope.waitForConnection = function (uuid) {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-light" icon="ripple"></ion-spinner><div>Connecting...</div>'
		});
    	if (typeof p2ptunnel != 'undefined') {
      		p2ptunnel.startP2PTunnel(uuid, success, failure);
    	} else {
			$state.go("app.my-aquas_main", {ports: -1}); 
		}
	};

  var vm;
  $scope.scanQrcode = function(){
      $ionicPlatform.ready(function() {
          $cordovaBarcodeScanner
              .scan()
              .then(function(result) {
                  // Success! Barcode data is here
                  vm = "We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled;
              }, function(error) {
                  // An error occurred
                  vm = 'Error: ' + error;
              });
      });
  };

})


.controller('KalayCtrl', function($scope, $ionicScrollDelegate, $interval, $stateParams, $ionicLoading, $http, ApiEndpoint) {
	var init_props_flag = 0;
	var done_loading_flag = 0;
    
	// Simulate async data update
	var updateProps = function(response) {
        //console.log(response.data);
        var json_props_data = response.data;
		
		if ((json_props_data[0].sen_mask & 0x01) == 1) {
			temp_value.innerHTML = "" + json_props_data[0].temp;
		} else {
			temp_value.innerHTML = "null";
		}
		if (((json_props_data[0].sen_mask >> 1) & 0x01) == 1) {
			ph_value.innerHTML = "" + json_props_data[0].ph;
		} else {
			ph_value.innerHTML = "null";
		}
		if (((json_props_data[0].sen_mask >> 2) & 0x01) == 1) {
			o2_value.innerHTML = "" + json_props_data[0].o2;
		} else {
			o2_value.innerHTML = "null";
		}
		if (((json_props_data[0].sen_mask >> 3) & 0x01) == 1) {
			co2_value.innerHTML = "" + json_props_data[0].co2;
		} else {
			co2_value.innerHTML = "null";
		}
		
		var update_labels = [];
		var update_data_temp = [[]];
		var update_data_ph = [[]];
		var update_data_o2 = [[]];
		var update_data_co2 = [[]];
	    for (idx in json_props_data) {
			update_labels.push(json_props_data[idx].timestamp);
            if (json_props_data[idx].hasOwnProperty('temp')) {
				update_data_temp[0].push(json_props_data[idx].temp);
			} else {
				update_data_temp[0].push(0.0);
			}
			if (json_props_data[idx].hasOwnProperty('ph')) {
				update_data_ph[0].push(json_props_data[idx].ph);
			} else {
				update_data_ph[0].push(0.0);
			}
			if (json_props_data[idx].hasOwnProperty('o2')) {
				update_data_o2[0].push(json_props_data[idx].o2);
			} else {
				update_data_o2[0].push(0.0);
			}
			if (json_props_data[idx].hasOwnProperty('co2')) {
				update_data_co2[0].push(json_props_data[idx].co2);
			} else {
				update_data_co2[0].push(0.0);
			}
			
		}
		$scope.labels = update_labels;
		$scope.data_temp = update_data_temp;
		$scope.data_ph = update_data_ph;
		$scope.data_o2 = update_data_o2;
		$scope.data_co2 = update_data_co2;
		if (init_props_flag == 0) {
			if (done_loading_flag == 1) {
				$ionicLoading.hide();
			}
			init_props_flag = 1;
		}
	}
    
	$scope.$on('$ionicView.beforeEnter', function(){
    	var overlay_id;
	    var aqua_stats   = document.getElementById("aqua_stats");
	    var aqua_weather = document.getElementById("aqua_weather");
	    var aqua_feeding = document.getElementById("aqua_feeding");
	    var aqua_music   = document.getElementById("aqua_music");
	    var aqua_tools   = document.getElementById("aqua_tools");
	    var aqua_social  = document.getElementById("aqua_social");

		var temp_value = document.getElementById("temp_value");
		var   ph_value = document.getElementById("ph_value");
		var   o2_value = document.getElementById("o2_value");
		var  co2_value = document.getElementById("co2_value");

		$http.get(ApiEndpoint.url + '/rest_api/A8SPV2MUX7BVXZCP111A/get_props/latest/24').then(updateProps, function(err) {
    		console.error('ERR', err);
    		// err.status will contain the status code
		});

		if ($stateParams.ports > 0) {
			document.getElementById("live_camera").setAttribute("src", 'http://127.0.0.1:' + $stateParams.ports + '/?action=stream');
		}
        $ionicScrollDelegate.$getByHandle('cam_scroll').resize();
	});

	$scope.$on('$ionicView.afterEnter', function(){
		if (init_props_flag == 1) {
    		$ionicLoading.hide();
		}
		done_loading_flag = 1;
	});
	
    $scope.$on('$ionicView.leave', function(){
    	if (typeof p2ptunnel != 'undefined') {
      		p2ptunnel.stopP2PTunnel(console.log('success disconnect'), failure);
    	}
	});
  
    function timePickerCallback(val) {
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
            $scope.timePickerObject.inputEpochTime = val;
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
        }
    }

    $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 5,  //Optional
        format: 24,  //Optional
        titleLabel: 'Set Feeding Time',  //Optional
        setLabel: 'OK',  //Optional
        closeLabel: 'Cancel',  //Optional
        setButtonType: 'button-royal',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            timePickerCallback(val);
        }
    };

    $scope.alert = function(text) {
        alert(text);  
    };

    var current_overlay_id = null, overlay_id;
    $scope.toggleOverlay = function(id) {
        overlay_id = eval(id);
        
        if (current_overlay_id !== null) {
            current_overlay_id.classList.remove("aqua-overlay-enter");
            current_overlay_id.classList.add("aqua-overlay-leave");
        }
        if (overlay_id === current_overlay_id) {
            current_overlay_id = null;
            return;
        } 
        
        overlay_id.classList.remove("aqua-overlay-leave");
        overlay_id.classList.add("aqua-overlay-enter");
        current_overlay_id = overlay_id;
    };
    
    

    var success = function(gmappedport) {
        //alert("Handshake completed!(" + gmappedport + ")");
        //document.getElementById("live_camera").innerHTML = '<img src="http://127.0.0.1:' + gmappedport + '/?action=stream" style="height: 100vh">';
        document.getElementById("live_camera").setAttribute("src", 'http://127.0.0.1:' + gmappedport + '/?action=stream');
        $ionicScrollDelegate.$getByHandle('cam_scroll').resize();
        //$ionicScrollDelegate.$getByHandle('cam_scroll').scrollBy(150, 0, "false");
    }

    var failure = function() {
        alert("Error calling Tunnel Plugin");
    }

  //  $scope.labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00"];
  //$scope.data_temp = [
  //  [65, 59, 80, 81, 56, 55, 40,55,55, 66]
  //];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };


  $interval(function () {
	$http.get(ApiEndpoint.url + '/rest_api/A8SPV2MUX7BVXZCP111A/get_props/latest/24').then(updateProps, function(err) {
    	console.error('ERR', err);
    	// err.status will contain the status code
	});
  }, 5000);
    
})

.controller('SideMenuCtrl', function($scope) {
    $scope.collapse = false;
    $scope.tasks = [
        {
            name: 'User Login',
            checked: false,
            action: 'login()'
        },
        {
            name: 'Timeline',
            checked: false,
            alias: 'timeline'
        },
        {
            name: 'My Aquariums',
            checked: false,
            tree: [
                {
                    name: '烈冰鮮鯛山',
                    checked: false,
                    alias: 'aqua/BCLKT293KGBG4Y2T111A'
                },
                {
                    name: '彈跳甲魚湯',
                    checked: false,
                    alias: 'aqua/A8SPV2MUX7BVXZCP111A'
                },
                {
                    name: '寶山飛龍鍋',
                    checked: false,
                    alias: 'aqua/BSEZFSYZKT51YMGD111A'
                }
            ]
        },
        {
            name: 'Collections',
            checked: false,
            alias: 'collections'

        },
        {
            name: 'Discover',
            checked: false,
            alias: 'discover'
        },
        {
            name: 'Settings',
            checked: false,
            alias: 'settings'
        },
    ];

    $scope.toggleCollapse = function(){
        $scope.collapse = !$scope.collapse;
        console.log($scope.collapse)
    };

    $scope.customTemplate = 'item_default_renderer';

    $scope.toggleTemplate = function() {
        if ($scope.customTemplate == 'ion-item.tmpl.html') {
            $scope.customTemplate = 'item_default_renderer'
        } else {
            $scope.customTemplate = 'ion-item.tmpl.html'
        }
    }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: '煮來吃', id: 1 },
    { title: 'TIIDA', id: 2 },
    { title: '深水炸彈', id: 3 },
    { title: '對魚彈琴', id: 4 },
    { title: '進化', id: 5 },
    { title: '霍爾的移動魚缸', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
