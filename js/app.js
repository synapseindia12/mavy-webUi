var myApp = angular.module("mavyApp", ['ngRoute', 'ngCookies', 'ngStorage', 'ngFacebook', 'ui.mask', 'ui.bootstrap']);
myApp.config(function($routeProvider, $httpProvider, $facebookProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'signup.html',
			controller: 'signupCtrl'
        })
		.when('/dashboard', {
            templateUrl: 'home.html',
			controller: 'indexCtrl'
        })
		.when('/assignment', {
            templateUrl: 'assignments.html',
			controller: 'assignmentCtrl'
        })
		.when('/forum', {
            templateUrl: 'forum.html',
			controller: 'forumCtrl'
        })
		.when('/forum-expanded/:forumId', {
            templateUrl: 'forum-expanded.html',
			controller: 'forumExpandedCtrl'
        })
		.when('/messages', {
            templateUrl: 'messages.html',
			controller: 'messagesCtrl'
        })
		.when('/message/:conversationId', {
            templateUrl: 'messageConversation.html',
			controller: 'messageconversationCtrl'
        })
		.when('/profile', {
            templateUrl: 'profile.html',
			controller: 'profileCtrl'
        })
		.when('/notification', {
            templateUrl: 'notifications.html',
			controller: 'notificationCtrl'
        })
		.when('/resetpassword', {
            templateUrl: 'resetpassword.html',
			controller: 'resetpasswordCtrl'
        })
		.otherwise({
            redirectTo: '/'
        });
		
		$facebookProvider.setAppId('1588022388118943');
		// $httpProvider.interceptors.push(function($q, $location) { 
			// return {
				// response: function(response) {
					//do something on success return response; 
				// }, responseError: function(response) {
					// if (response.status === 401) 
						// $location.url('/login'); 
					// return $q.reject(response);
				// }
			// }; 
		// });
	})
	.run(function($rootScope){
		(function(){
		if (document.getElementById('facebook-jssdk')) {return;}
		var firstScriptElement = document.getElementsByTagName('script')[0];
		var facebookJS = document.createElement('script');
		facebookJS.id = 'facebook-jssdk';
		facebookJS.src = 'http://connect.facebook.net/en_US/sdk.js';
		firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
		}());
	});
	
myApp.controller('fbCtrl', function ($scope) {

}); 

myApp.controller('signupCtrl', function($scope, $rootScope, $location, $cookieStore, $localStorage, $window, $facebook, $modal){

	if ($localStorage.loggedIn) {
		$location.path('/dashboard');
	}
	var endpoints = {};
	$scope.newArray = [];
	endpoints.apiKey = "835mzggn289l9wxnjxjr323kny6q";
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.signUp = function() {
		$scope.userSysteminfo = [];
		if($scope.uname && $scope.password){
			endpoints.mobileHandler.login($scope.uname, $scope.password, $scope.userSysteminfo, function(result){
				if(result){
					$scope.uname = '';
					$scope.password = '';
					$localStorage.loggedIn = true;
					$localStorage.loginDetails = result.result.result;
					$location.path('/dashboard');
					$scope.$apply();
				}
			});
		}
	};
	
	$scope.fbLogin = function() {
		$modal.open({
		  templateUrl: 'signupModal.html',
		  controller: 'signupModalctrl',
		  resolve: {}
		});
		$scope.userSysteminfo = [];
	};	
});

myApp.controller('signupModalctrl', function($scope, $modalInstance, $facebook){
	 $scope.ok = function () {
		var endpoints = {};
		$scope.newArray = [];
		endpoints.mobileHandler = new MobileHandler();
		$scope.username = $scope.displayname;
		$scope.token = "CAAWkTEZAW1ZA8BACX8GQvBYqqw4OZCTkbnZCzr2B2hQSxZCf4UCjS59ErPHZBD9DC8tXmPWt1ldLZBn2EQH7d8U25zmkRh5hQ2uChWsLdoTsJrf4nak9H5ocBgO03hfKkNkhOpothPhcnUd96sW7R11ZBCFgWEqa1XtZAU6myVpZC5I2azyZA2OEvZCHTNgOBm4D8uky4qO00ZCkuVYBHZAf645xIrr4SlJXrqGTkZD";
		$scope.userSystemInfo = [];
		endpoints.mobileHandler.loginFb($scope.username, $scope.token, $scope.userSystemInfo, function(response){
			alert('Got the response');
			debugger;
			if(response.result.success){
				debugger;
				$localStorage.loggedIn = true;
				$localStorage.loginDetails = response.result.result;
				$location.path('/dashboard');
				$scope.$apply();
			}
			else{
				debugger;
				alert(response.result.message);
				$location.path('/');
			}
		});
		// $facebook.login().then(function(result) {
			// if(result.status){
				// $scope.accessToken = result.authResponse.accessToken;
				// $scope.attributes = [{"username": $scope.displayname, "accessToken": $scope.accessToken, "userSystemInfo": []}];
				// endpoints.mobileHandler.loginFb($scope.attributes, function(response){
					// if(response.result.success){
						// $localStorage.loggedIn = true;
						// $localStorage.loginDetails = response.result.result;
						// $location.path('/dashboard');
						// $scope.$apply();
					// }
					// else{
						// alert(response.result.message);
						// $location.path('/');
					// }
				// });
			// }
		// });
		//$modalInstance.close($scope.selected.item);
	  };

	  $scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	  };
});

myApp.controller('indexCtrl', function($scope, $cookieStore, $rootScope, $localStorage, $location){

	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.allAssignments = [];
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.tempArray = [];
	$scope.allPolls = []; 
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getDashboard($scope.apiKey,$scope.userId,7,null,null, function(result){

	});
	endpoints.mobileHandler.getAssignments($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		if (result.result.success){
			for (var i=0; i< result.result.result.length; i++) {
				$scope.allAssignments.push(result.result.result[i]);
			}
		}
		$scope.$apply();
	});
	endpoints.mobileHandler.getDashboard($scope.apiKey,$scope.userId,2,null,null, function(result){
		$scope.replyPosts = result.result.result;
		for(var i=0; i< $scope.replyPosts.Entries.length; i++){
			$scope.tempArray.push($scope.replyPosts.Entries[i]);
			$scope.$apply();
		}
		endpoints.mobileHandler.getDashboard($scope.apiKey,$scope.userId,3,null,null, function(response){
			endpoints.mobileHandler.getDashboard($scope.apiKey,$scope.userId,4,null,null, function(res){
			});
		});
		endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 5, null, null, function(result){
			if(result.result.success){
				$scope.latestPoll = result.result.result.Entries[0];
				for(var i=1; i< result.result.result.Entries.length; i++){
					$scope.allPolls.push(result.result.result.Entries[i]);
				}
			}
			$scope.$apply();
		});
		
		endpoints.mobileHandler.getPollVotes($scope.apiKey, $scope.userId, 100, function(result){
			
		});
	});
	
	$scope.submitPoll = function(poll) {
		var index = $scope.allPolls.indexOf(poll);
		$scope.allPolls.splice(index, 1);
		if($scope.allPolls.length <= 0){
			setTimeout(function(){
				$('.votingDone').animate({height: '0px', border: 'none', margin: '0', padding: '0'}, "500");
			}, 3000);
		}
	};
	
	
});

myApp.controller('navCtrl', function($scope, $cookieStore, $rootScope, $location, $localStorage){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	};
	
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	if(!$rootScope.forumsCount) {
		endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
			if(forums.result.result.Threads) {
				$rootScope.forumsCount = forums.result.result.Threads.length;
				$rootScope.allForums=forums.result.result.Threads;			
				$scope.$apply();
			}
		});
		endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, 20, null, function(msg){
			if(msg.result.result.Conversations){
				$rootScope.msgCount = msg.result.result.Conversations.length;
				$scope.$apply();
			}	
		});
	}
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname1;
			$scope.lname = callback.result.result.lname1;
			// $scope.email = callback.result.result.email;
			// $scope.selectedMonth = callback.result.result.bdate.slice('/')[0];
			// $scope.selectedDate = callback.result.result.bdate.slice('/')[2];
			// $scope.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];
			// $scope.gender = callback.result.result.gend;
			// $scope.zipcode = callback.result.result.zipc;
			// $scope.mobileNumber = callback.result.result.cell_phone;
			$scope.$apply();			
		}
	});
	
	$scope.logout = function() {
		delete $localStorage.loggedIn;
		delete $localStorage.loginDetails;
		$location.path('/');
	}
	
});

myApp.controller('assignmentCtrl', function($scope, $location, $localStorage){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.initializeSlider = function() {
		setTimeout(function(){
			$scope.showAssignments = true;
			$('.bxslider').bxSlider({
			  auto: true,
			  autoHover: true
			});
		}, 1500);
	}
	$scope.allAssignments = [];
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	
	endpoints.mobileHandler.getAssignments($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		if (result.result.success){
			for (var i=0; i< result.result.result.length; i++) {
				$scope.allAssignments.push(result.result.result[i]);
			}
		}
		$scope.$apply();
	});
});

myApp.controller('forumCtrl', function($scope,$localStorage,$rootScope){
	$scope.activeThreads = [];
	$scope.childThreads = [];
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	//endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(result){
		if($rootScope.allForums) {
			for(var i=0; i<$rootScope.allForums.length; i++){			
				$scope.activeThreads.push($rootScope.allForums[i]);
			}
		}
		else {
			endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
				if(forums.result.result.Threads) {
					$rootScope.forumsCount=forums.result.result.Threads.length;
					$rootScope.allForums=forums.result.result.Threads;
					for(var i=0; i<$rootScope.allForums.length; i++){			
						$scope.activeThreads.push($rootScope.allForums[i]);
					}
				}
				$scope.$apply();
			});
		}
		//alert($scope.activeThreads[0].Author.DisplayName);	
	
	$scope.getChilds=function(id){
		$rootScope.currentId = id;
		if($scope.childThreads.length > 0) {
			$scope.childThreads = [];
		} 
		endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){
			if(child.result.result[1].Replies) {
				for(var j=0; j<child.result.result[1].Replies.length; j++){				
					if(id == child.result.result[1].Replies[j].ThreadId)
						$scope.childThreads.push(child.result.result[1].Replies[j]);
				}
			}
			$scope.$apply();
			$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
		
		});
	}
	
	$scope.showCommentbox = function(id) {
		if($scope.childThreads.length>0){
			for(var i=0; i<$scope.childThreads.length; i++){
				if(id==$scope.childThreads[0].ThreadId){
					return true;
				}

				else{
					return false;
				}
			}
		}
		else{	
			if(id==$rootScope.currentId){	
				return true;
			}
		}
		
	};
	
	$scope.submitPost = function(){
		$scope.threadInfo=[{"name":"Subject","value":$scope.postTitle},{"name":"Body","value":$scope.postBody}];
		endpoints.mobileHandler.createThread($scope.apiKey,$scope.userId,3,$scope.threadInfo,function(response){
			if(response.result.success){
				endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
					if(forums.result.result.Threads) {
						$rootScope.forumsCount=forums.result.result.Threads.length;
						$rootScope.allForums=forums.result.result.Threads;
						for(var i=0; i<$rootScope.allForums.length; i++){			
							$scope.activeThreads.push($rootScope.allForums[i]);
						}
						$scope.postTitle="";
						$scope.postBody="";
						$scope.$apply();
					}
				});
			}
		});		
	};

	$scope.gotoReplyBox = function(){
		$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
	}
	
});

myApp.controller('forumExpandedCtrl', function($scope,$localStorage,$rootScope,$routeParams){
	
	$scope.childThreads = [];
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(forums){
				if(forums.result.result.Threads) {
					debugger;
					
					for(var i=0; i<forums.result.result.Threads.length; i++){			
						if($routeParams.forumId==forums.result.result.Threads[i].Id){
							$scope.items=forums.result.result.Threads[i];
						}
					}
				}
				$scope.$apply();
			});
	endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$routeParams.forumId,null,null,function(child){
			if(child.result.result[1].Replies) {
				for(var j=0; j<child.result.result[1].Replies.length; j++){				
					if($routeParams.forumId == child.result.result[1].Replies[j].ThreadId)
						$scope.childThreads.push(child.result.result[1].Replies[j]);
				}
			}
			$scope.$apply();
			//$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
		
		});

	$scope.gotoReplyBox = function(){
		$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
	};
	//$scope.forumExpandedPage = 'setting-page-active';
});

myApp.controller('messagesCtrl', function($scope, $cookieStore, $rootScope, $localStorage){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.messages = [];
	$scope.tempArr = [];
	$scope.displayConversations = true;
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	
	endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, 20, null, function(result){
		if(result.result.result.Conversations){
			for(var i=0; i<result.result.result.Conversations.length; i++){
				$scope.messages.push(result.result.result.Conversations[i]);
			}
		}
		$scope.$apply();
	});
	
	$scope.showMessage = function(conversationId) {
		$scope.internalMessages = [];
		endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
			for(var i=0; i<result.result.result.Messages.length; i++){
					$scope.internalMessages.push(result.result.result.Messages[i]);
			}
			
			// for(var i=0; i< $scope.messages.length; i++){
				// if($scope.messages[i].LastMessage.ConversationId == conversationId){
					// $scope.displayConversations = true;
				// }
				// else{
					// $scope.displayConversations = false;
				// }
			// }
			
			$scope.$apply();
		});
	}
	// endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, "guid", null, null, function(callback){
		// debugger;
	// });
});

myApp.controller('messageconversationCtrl', function($scope, $routeParams, $localStorage){
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.messages = [];
	var endpoints = {};
	$scope.newArray = [];
	endpoints.apiKey = "835mzggn289l9wxnjxjr323kny6q";
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, $routeParams.conversationId, null, null, function(result){
		for(var i=0; i<result.result.result.Messages.length; i++){
				$scope.messages.push(result.result.result.Messages[i]);
		}
		$scope.$apply();
	});
});

myApp.controller('profileCtrl', function($scope, $localStorage, $location){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.messages = [];
	$scope.tempArr = [];
	
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	$scope.profilePage = 'setting-page-active';
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname1;
			$scope.lname = callback.result.result.lname1;
			$scope.email = callback.result.result.email;
			$scope.selectedMonth = callback.result.result.bdate.slice('/')[0];
			$scope.selectedDate = callback.result.result.bdate.slice('/')[2];
			$scope.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];
			$scope.gender = callback.result.result.gend;
			$scope.zipcode = callback.result.result.zipc;
			$scope.mobileNumber = callback.result.result.cell_phone;
			$scope.$apply();
			
		}
	});
	
	endpoints.mobileHandler.getPanelistBadges($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		
	});
	
	$scope.updateProfile = function() {
		$scope.bdate = $scope.selectedMonth + '/' + $scope.selectedDate + '/' + $scope.selectedYear;
		$scope.attributes = [{"name": "fname1", "value": $scope.fname}, {"name": "lname1", "value": $scope.lname}, {"name": "email", "value": $scope.email}, {"name": "bdate", "value": $scope.bdate}, {"name": "gend", "value": $scope.gender}, {"name": "zipc", "value": $scope.zipcode}];
		$scope.skipAddressVerify = false;
		endpoints.mobileHandler.updatePanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, $scope.attributes, $scope.skipAddressVerify, function(response){
			if(response.result.success){
				alert('Profile successfully updated');
			}
		});
	};
});

myApp.controller('notificationCtrl', function($scope){
	$scope.notificationPage = 'setting-page-active';
});

myApp.controller('resetpasswordCtrl', function($scope, $localStorage, $location){
	$scope.resetPassword = 'setting-page-active';
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	/* Getting all local Storage data for User Authentication */
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.resetPass = function() {
		$scope.currentPass = $scope.cpass;
		$scope.newPass = $scope.npass;
		$scope.verifyNewPass = $scope.vnpass;
		if($scope.vnpass == $scope.npass){
			endpoints.mobileHandler.changePassword($scope.apiKey, $scope.userId, $scope.currentPass, $scope.newPass, function(result){
				if(result.result.success){
					alert('Password Changed');
					$scope.cpass = '';
					$scope.npass = '';
					$scope.vnpass = '';
					delete $localStorage.loggedIn;
					delete $localStorage.loginDetails;
					$location.path('/');
					$scope.$apply();
				}
				else{
					alert(result.result.message);
				}
			});
		}
		else{
			alert('Password Do not match');
			$scope.npass = '';
			$scope.vnpass = '';
			return;
		}
	};	
}).directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
		ele.html(attrs.dynamic);
        $compile(ele.contents())(scope);
    }
  };
});