var myApp = angular.module("mavyApp", ['ngRoute', 'ngCookies', 'ngStorage', 'ngFacebook', 'ui.mask', 'ui.bootstrap']);
myApp.config(function($routeProvider, $httpProvider, $facebookProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'signup.html',
			controller: 'signupCtrl'
        })
		.when('/signup', {
            templateUrl: 'createUser.html',
			controller: 'createUserCtrl'
        })
		.when('/dashboard', {
            templateUrl: 'home.html',
			controller: 'indexCtrl'
        })
		.when('/pollresults', {
            templateUrl: 'results.html',
			controller: 'pollResultCtrl'
        })
		.when('/assignment', {
            templateUrl: 'assignments.html',
			controller: 'assignmentCtrl'
        }).when('/assignments/showAssignment', {
            templateUrl: 'showassignments.html',
			controller: 'showassignmentCtrl'
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
		.when('/messages/:conversationId', {
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
	
myApp.controller('createUserCtrl', function($scope, $location){	
	var endpoints = {};
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.signUp = function(){
		if($scope.password !== $scope.cpassword){
			alert("Passwords Do not match");
		}
		else{
			var attributes = [{'name': 'email', 'value': $scope.uemail}, {'name': 'username', 'value': $scope.uname}, {'name': 'password', 'value': $scope.password}];
			endpoints.mobileHandler.createUser(attributes, function(result){
				alert(result.result.message);
				$scope.password = '';
				$scope.cpassword = '';
				$scope.uemail = '';
				$scope.uname = '';
				$location.path('/');
				$scope.$apply();
			});
		}
	}
});

myApp.controller('signupCtrl', function($scope, $rootScope, $location, $cookieStore, $localStorage, $window, $facebook, $modal){

	if ($localStorage.loggedIn) {
		$location.path('/dashboard');
	}
	var endpoints = {};
	$scope.newArray = [];
	endpoints.apiKey = "835mzggn289l9wxnjxjr323kny6q";
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.login = function() {
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
	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 1, null, null, function(result){
		if (result.result.success){
			for (var i=0; i< result.result.result.Entries.length; i++) {
				$scope.allAssignments.push(result.result.result.Entries[i]);
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
	
	
	$scope.showAssignmentTasks = function(assignment){
		$rootScope.assignment = assignment;
		$location.path('/assignments/showAssignment');
	}
	
	$scope.showThread = function(forumId){
		$location.path('/forum-expanded/'+forumId);
	}
	
});

myApp.controller('pollsCtrl', function($scope, $rootScope, $location, $localStorage){
	
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.incrementedVal=0;
	$scope.stopRecursiveCall = false;
	$scope.tempArray = [];
	$scope.allPolls = []; 
	$rootScope.polesForResults= [];
	$rootScope.dataforResults = [];
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 5, null, null, function(result){
		if(result.result.success){
			for(var i=0; i<result.result.result.Entries.length; i++){
				$rootScope.polesForResults.push(result.result.result.Entries[i]);
			}
			$scope.recursiveCall(result);
		}
		$scope.$apply();
	});
	
	$scope.recursiveCall = function(result){
		$scope.results = result.result.result.Entries;
		if($scope.results.length > 0){
			if($scope.incrementedVal < $scope.results.length){
				$scope.checkPolls(result);
			}
			else{
				return;
			}
		}
	};
	
	$scope.newrecursiveCall = function(result){
		$scope.results = result.result.result.Entries;
		if($scope.results.length > 0){
			if($rootScope.incrementedVal < $scope.results.length){
				$scope.checkPolls(result);
			}
			else{
				return;
			}
		}
	};
	
	$scope.checkPolls = function(result) {
		$rootScope.incrementedVal = $scope.incrementedVal;
		endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, result.result.result.Entries[$scope.incrementedVal].projectId,result.result.result.Entries[$scope.incrementedVal].moduleId, function(response){
			for(var i=0; i<result.result.result.Entries.length; i++){
				if(result.result.result.Entries[i].itemId == response.result.result[0].itemId){
					for(var j=0; j<response.result.result[0].values.length; j++){
						debugger;
						response.result.result[0].values[j].count = (response.result.result[0].values[j].count * 100)/response.result.result[0].responseCount;
						if(result.result.result.Entries[i].options.categories[j])
						result.result.result.Entries[i].options.categories[j].values = Math.round(response.result.result[0].values[j].count);
					}
					
					$rootScope.dataforResults.push(result.result.result.Entries[i]);
				}
			}
			$scope.displayPollresults = $rootScope.dataforResults;
			$scope.$apply();
		});
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId,$scope.panelistId,result.result.result.Entries[$scope.incrementedVal].projectId,result.result.result.Entries[$scope.incrementedVal].moduleId, function(response){
			var ItemId = result.result.result.Entries[$scope.incrementedVal].itemId;
			if(response.result.success){
				if(response.result.result.length > 0){
					for(var j=0; j<response.result.result[0].responses.length; j++){
						if(result.result.result.Entries[$scope.incrementedVal].itemId != response.result.result[0].responses[j].itemId){
							$scope.allPolls.push(result.result.result.Entries[$scope.incrementedVal]);
						}
						else{
							$scope.allPolls = [];
						}
					}
				}
				else{
					$scope.allPolls.push(result.result.result.Entries[$scope.incrementedVal]);
				}
			}
			$scope.$apply();
			$scope.incrementedVal = $scope.incrementedVal + 1;
			$scope.recursiveCall(result);
		});
	};
	
	$scope.submitPoll = function(pollDetails, pollvote){
		$scope.notes = [];
		$scope.value = [];
		$scope.allVotes = [];
		var value = parseInt($('input[name="poll"]:checked').val());
		$scope.value.push(value);
		var response = {"projectId": $scope.allPolls[0].projectId, "moduleId": $scope.allPolls[0].moduleId, "taskId": $scope.allPolls[0].taskId, "itemId": $scope.allPolls[0].itemId, "isTestData": false, "notes": $scope.notes, "values": $scope.value};
		
		endpoints.mobileHandler.savePollResponse($scope.apiKey, $scope.userId, $scope.panelistId, response, function(result){
			if(result.result.success){
				alert('Thanks for your vote.');
				
				endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, $scope.allPolls[0].projectId, $scope.allPolls[0].moduleId, function(response){
					$rootScope.totalResponseCounts = response.result.result[0].responseCount;
				});
				
				endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId, $scope.panelistId, $scope.allPolls[0].projectId, $scope.allPolls[0].moduleId, function(res){
					for(var i=0; i< res.result.result[0].responses.length; i++){
						$scope.allVotes.push(res.result.result[0].responses[i]);
					}
					$rootScope.allVotes = $scope.allVotes;
					$rootScope.allPolls = $scope.allPolls;
					$location.path('/pollresults');
					$scope.$apply();
				});
			}
		});
	}	
});

myApp.controller('pollResultCtrl', function($scope, $location, $rootScope, $localStorage){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.resultPolls = [];
	$scope.panelistResults = $rootScope.allVotes;
	$scope.displayPollresults = $rootScope.dataforResults;
	
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
	$scope.redeemable = [];
	
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
			// endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, null, null, function(result){
				// alert('Got incentives');
				// debugger;
			// });
			$scope.$apply();			
		}
	});
	
	endpoints.mobileHandler.getIncentives($scope.apiKey, $scope.userId, $scope.panelistId, 20, null, function(result){
		$scope.redeemable = result.result.result[result.result.result.length-1].redeemable;
		$scope.$apply();
	});
	
	$scope.logout = function() {
		delete $localStorage.loggedIn;
		delete $localStorage.loginDetails;
		$location.path('/');
	}
	
});

myApp.controller('assignmentCtrl', function($scope, $location, $cookieStore, $localStorage, $rootScope){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	// $scope.initializeSlider = function() {
		// setTimeout(function(){
			// $scope.showAssignments = true;
			// $('.bxslider').bxSlider({
			  // auto: true,
			  // autoHover: true
			// });
		// }, 1500);
	// }
	
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
	
	$scope.showAssignmentTasks = function(assignment){
		debugger;
		$cookieStore.put('assignment', assignment);
		$location.path('/assignments/showAssignment');
	}
	
});

 myApp.controller('showassignmentCtrl', function($scope, $cookieStore, $rootScope, $location, $localStorage){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.i = 0;
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	var sectionId = 2;
	$scope.tempArray = [];
	$scope.allPolls = [];
	$scope.tasks = []; 
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.assignment = $cookieStore.get('assignment');
	$scope.projectId = $scope.assignment.projectId;
	debugger;
	if($scope.assignment.modules)
		$scope.moduleId = $scope.assignment.modules[0].moduleId;
	else
		$scope.moduleId = $scope.assignment.moduleId;
	endpoints.mobileHandler.getPanelistModuleTasks($scope.apiKey, $scope.userId, $scope.projectId, $scope.moduleId, $scope.panelistId, 20, 0, function(result){		
		if(result.result.result.AvailableTasks.length > 0){
			for(var i=0;i<result.result.result.AvailableTasks.length;i++){
				$scope.tasks.push(result.result.result.AvailableTasks[i]);
			}
		}
	});

	$scope.markCompleted = function(task) {
		var reply = $('#reply').val();		
		endpoints.mobileHandler.saveTaskReply($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,task.TaskId,$scope.panelistId,task.ForumId,reply,null,null, function(response){
			 endpoints.mobileHandler.getNextTask($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,task.TaskId,$scope.panelistId, function(response){
				if(response.result.success){
					if(response.result.result){
						if($scope.tasks.length >0){
							for(var i=0; i<$scope.tasks.length; i++){
								if($scope.tasks[i].TaskId != response.result.result[0].TaskId){
									$scope.tasks.push(response.result.result);
								}
							}
						}
					}
					$scope.$apply();
				}
			});
		});
	};
	
	$scope.getNextTask = function(i) {
		if($scope.tasks[i].TaskStatus == 'Completed'){
			var taskId = $scope.tasks[i].TaskId;
			debugger;
			endpoints.mobileHandler.getNextTask($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,taskId,$scope.panelistId, function(response){
				var isExists;
				if(response.result.success){
					if(response.result.result){
						if($scope.tasks.length >0){
							for(var i=0; i<$scope.tasks.length; i++){
								debugger;
								if($scope.tasks[i].TaskId != response.result.result.TaskId){
									isExists = true;
								}
								else{
									isExists = false;
								}
							}
							if(isExists)
								$scope.tasks.push(response.result.result);
							
							if($scope.i < $scope.tasks.length){
								$scope.i = $scope.i + 1;
								$scope.hideRightArrow = true;
							}
						}
					}
				}
				else{
					alert('There are no other tasks');
					$scope.hideRightArrow = true;
				}
				$scope.$apply();
			});
		}
		else{
			alert('Project is not yet marked completed. Please complete this task and then move forward');
		}
	}
	
	$scope.getPreviousTasks = function(i) {
		var taskId = $scope.tasks[i].TaskId;
		debugger;
		if($scope.i > 0)
			$scope.i = $scope.i - 1;
			if($scope.i == 0){
				$scope.hideRightArrow = false;
			}
		else
			$scope.hideRightArrow = false;
	}
	
	$scope.gotoReplyBox = function(){
		debugger;
		$('.comment-form').show();
		$(this).parents('.grid-content').find('.comment-form').show();
	};
});

myApp.controller('forumCtrl', function($scope,$localStorage,$rootScope,$location){
	 $scope.activeThreads = [];
	 $scope.childThreads = [];
	 $scope.parentId =null;
	 $scope.threadId =null;
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
			debugger;
			$scope.$apply();
		});
	}
 
	$scope.getChilds=function(id, childId){
	if(childId){
		$rootScope.childId = childId;
	}
	else{
		$rootScope.childId = '';
	}
	  $rootScope.currentId = id;
	  if($scope.childThreads.length > 0) {
	   $scope.childThreads = [];
	  } 
	  else{
	   $scope.parentId=null;
	   $scope.threadId=null;
	  }
	  endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){
		if(child.result.success){
		   if(child.result.result[1].Replies) {
			for(var j=0; j<child.result.result[1].Replies.length; j++){    
			 if(id == child.result.result[1].Replies[j].ThreadId)
			  $scope.childThreads.push(child.result.result[1].Replies[j]);
			}
		   }
		   $scope.$apply();
			$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
		}
		else{
			$('html,body').stop().animate({'scrollTop':($('#child-reply-box').offset().top-$('#child-reply-box').height())},'500','swing',function(){});
		}			
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


 $scope.expandForumPage =function(id){
  
  $location.path('/forum-expanded/'+id);
 };

 $scope.gotoReplyBox = function(){
  $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
 };

 $scope.saveThreadReply=function(replyText,id){
  
  if(replyText){
   endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,id,$scope.parentId,replyText,function(response){
    
    if(response.result.success){
     alert('success');
     
     $rootScope.currentId = id;
     if($scope.childThreads.length > 0) {
      $scope.childThreads = [];
     } 
     else{
      $scope.parentId=null;
      $scope.threadId=null;
     }
     endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){

      if(child.result.result[1].Replies) {
       for(var j=0; j<child.result.result[1].Replies.length; j++){    
        if(id == child.result.result[1].Replies[j].ThreadId)
         $scope.childThreads.push(child.result.result[1].Replies[j]);
       }
       $scope.parentId = $scope.childThreads[0].ParentId;
       $scope.threadId = $scope.childThreads[0].ThreadId;
      } 
      
      $scope.$apply();
      
      $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
      
     });
     $('#reply').val('');
    }
    else{
     alert('Fail');
    }
   });
  }
  else{
   alert('blank data');
  }
 };
 
 $scope.savechildThreadReply = function(parentId, childReplyText,Childid) {
	debugger;
	endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,Childid,parentId,childReplyText,function(response){
		alert("response Acheived");
		debugger;
	});
 }
 // $scope.mediaUpload= function(){
  // var hash = CryptoJS.HmacSHA1("Message", "akash");
  // alert(hash);
 // }
 
	 $scope.uploadFile = function (input) {

		$scope.data = {};
		$scope.data.userUpload = '';
		$scope.fileName="";
		var x="",
		Apikey="SXBzdW0gdml0YWUsIGV0IG5paGlsIGZyaW5naWxsYQ==",
		secret="SXBzdW0gdml0YWUsIGV0IG5paGlsIGZyaW5naWxsYQ==",
		bucketName = "cfsagency",
		mediaType="",
		sourceAppType = "Mavy";
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			//reader.readAsDataURL(input);
			reader.onload = function (e) {	 
				//Sets the Old Image to new New Image
				//$('#photo-id').attr('src', e.target.result);	 
				//Create a canvas and draw image on Client Side to get the byte[] equivalent
				var mediaT = input.files[0].type.split('/');
				mediaType = mediaT[0];
				debugger;
				x=e.target.result.split('base64,');
				$scope.data.userUpload = x[1];
				console.log($scope.data.userUpload.substring(0,64).length);
				$scope.fileName = input.files[0].name;
				$('#upload-content').show();
				var txtHash = Apikey+bucketName+projectId+sourceAppType+$scope.data.userUpload.substring(0,64)+mediaType;
				console.log(txtHash);
				var signature = CryptoJS.HmacSHA1(txtHash, secret);
				console.log(signature);

				endpoints.mobileHandler.convertMedia($scope.apiKey,signature,bucketName,projectId,sourceAppType,mediaType,$scope.data.userUpload,null,function(response){
					debugger;
					if(response.result.success){
						alert('success');
					}
					else{
						alert('fail');
					}

				});
				$scope.$apply();
			}					
			//Renders Image on Page
			reader.readAsDataURL(input.files[0]);

			

		}
	};
	var projectId="";
	$scope.setProjectId = function(id){
		projectId = id;

	};
});

myApp.controller('forumExpandedCtrl', function($scope,$localStorage,$rootScope,$routeParams){
 
 $scope.childThreads = [];
 $scope.parentId =null;
 $scope.threadId =null;
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
    //$scope.parentId = $scope.childThreads[0].ParentId;
    //$scope.threadId = $scope.childThreads[0].ThreadId;
   }
   $scope.$apply();
   //$('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
   $(window).scrollTop(o);
  });

 $scope.gotoReplyBox = function(){
  $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
 };
 //$scope.forumExpandedPage = 'setting-page-active';
 $scope.saveThreadReply=function(replyText,id){
  
  if(replyText){
   endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,id,$scope.parentId,replyText,function(response){
    
    if(response.result.success){
     alert('success');
     
     $rootScope.currentId = id;
     if($scope.childThreads.length > 0) {
      $scope.childThreads = [];
     } 
     else{
      $scope.parentId=null;
      $scope.threadId=null;
     }
     endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,id,null,null,function(child){

      if(child.result.result[1].Replies) {
       for(var j=0; j<child.result.result[1].Replies.length; j++){    
        if(id == child.result.result[1].Replies[j].ThreadId)
         $scope.childThreads.push(child.result.result[1].Replies[j]);
       }
       $scope.parentId = $scope.childThreads[0].ParentId;
       $scope.threadId = $scope.childThreads[0].ThreadId;
      } 
      
      $scope.$apply();
      
      $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
      
     });
     $('#reply').val('');
    }
    else{
     alert('Fail');
    }
   });
  }
  else{
   alert('blank data');
  }
 };

});

myApp.controller('messagesCtrl', function($scope, $cookieStore, $rootScope, $localStorage, $location){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.showExpandMessage = false;
	var conversationId = '';
	$scope.messages = [];
	$rootScope.messages = [];
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
	
	endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, null, null, function(result){
		if(result.result.result.Conversations){
			for(var i=0; i<result.result.result.Conversations.length; i++){
				$scope.messages.push(result.result.result.Conversations[i]);
				$rootScope.messages.push(result.result.result.Conversations[i]);
			}
		}
		$scope.$apply();
	});
	
	$scope.showMessage = function(message) {
		$rootScope.message = message;
		$location.path('/messages/'+message.LastMessage.ConversationId);
	}
	
	$scope.expandMessage = function(message){
		$scope.internalMessages = [];
		$scope.showExpandMessage = true;
		$scope.message = message;
		conversationId = message.LastMessage.ConversationId;
		endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
			for(var i=0; i<result.result.result.Messages.length; i++){
				$scope.internalMessages.push(result.result.result.Messages[i]);
			}			
			$scope.$apply();
		});	
	};
	
	$scope.createNewMessage = function() {
		$scope.userNames = [];
		$scope.projectId = '';

		for(var i=0; i<$rootScope.messages[0].Participants.length; i++){
			$scope.userNames.push($rootScope.messages[0].Participants[i].Username);
		}
		if($scope.userNames.length > 0){
			endpoints.mobileHandler.sendMessage($scope.apiKey, $scope.userId, $scope.subject, $scope.messageBody, $scope.userNames, null, null, function(result){
				if(result.result.success)
					alert('Successfully created');
			});
		}
	};
	
	$scope.submitMessageReply = function(items) {
		debugger;
		if(items.messageReplyText){
			endpoints.mobileHandler.sendMessageReply($scope.apiKey, $scope.userId, conversationId, items.messageReplyText, function(result){
				if(result.result.success){
					items.messageReplyText = '';
					$scope.internalMessages = [];
					endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
						for(var i=0; i<result.result.result.Messages.length; i++){
								$scope.internalMessages.push(result.result.result.Messages[i]);
						}						
						$scope.$apply();
					});	
				}
			});
		}
	}
});

myApp.controller('messageconversationCtrl', function($scope,$localStorage,$cookieStore,$routeParams,$rootScope){
	
	$scope.messages = [];
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

	if($rootScope.messages){
		for(var i=0;i<$rootScope.messages.length;i++){
			if($routeParams.conversationId==$rootScope.messages[i].Id){
				$scope.messages.push($rootScope.messages[i]);
			}
		}
	}
	else{
		endpoints.mobileHandler.getInbox($scope.apiKey, $scope.userId, null, null, function(result){
			if(result.result.result.Conversations){
				for(var i=0; i<result.result.result.Conversations.length; i++){
					$scope.messages.push(result.result.result.Conversations[i]);
					$rootScope.messages.push(result.result.result.Conversations[i]);
				}
			}
			$scope.$apply();
		});
	}
	
	
	
	$scope.internalMessages = [];
	endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, $routeParams.conversationId, null, null, function(result){
		for(var i=0; i<result.result.result.Messages.length; i++){
				$scope.internalMessages.push(result.result.result.Messages[i]);
		}
		
		debugger;
		
		$scope.$apply();
	});	
	
	$scope.submitMessageReply = function() {
		if($scope.messageReplyText){
			debugger;
			endpoints.mobileHandler.sendMessageReply($scope.apiKey, $scope.userId, $routeParams.conversationId, $scope.messageReplyText, function(result){
				if(result.result.success){
					alert('Successfully Updated');
					$scope.messageReplyText = '';
					endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, $routeParams.conversationId, null, null, function(result){
						for(var i=0; i<result.result.result.Messages.length; i++){
								$scope.internalMessages.push(result.result.result.Messages[i]);
						}						
						$scope.$apply();
					});	
				}
				else{
					alert('Error');
					debugger;
				}
			});
		}
	}
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
		$scope.allBadges = [];
		for(var i=0; i< result.result.result.length; i++){
			$scope.allBadges.push(result.result.result[i]);
		}
		$scope.$apply();
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

myApp.controller('badgesCtrl', function($scope, $localStorage, $location){

	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
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
	
	endpoints.mobileHandler.getPanelistAttributes($scope.apiKey, $scope.userId, $scope.panelistId, function(callback){
		if(callback.result.success){
			$scope.avatarUrl = callback.result.result.AvatarUrl;
			$scope.fname = callback.result.result.fname1;
			$scope.lname = callback.result.result.lname1;
			$scope.$apply();
			
		}
	});
	
	endpoints.mobileHandler.getPanelistBadges($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		$scope.allBadges = [];
		for(var i=0; i< result.result.result.length; i++){
			$scope.allBadges.push(result.result.result[i]);
		}
		$scope.$apply();
	});
});

myApp.controller('notificationCtrl', function($scope, $localStorage, $location){

	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
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
	
	$scope.notificationPage = 'setting-page-active';
	endpoints.mobileHandler.getNotifications($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		if(result.result.success){
			var resultArray = result.result.result;
			$scope.preferences = resultArray;
			for(var i=0; i<resultArray.length; i++){
				switch(resultArray[i]){
					case '3a': 
						$scope.emailCheck = true;
					break;
					case '3b': 
						$scope.smsCheck = true;
					break;
					case '3c': 
						$scope.pushCheck = true;
					break;
					case '3d': 
						$scope.forumEmail = true;
					break;
					case '3e': 
						$scope.forumSMS = true;
					break;
					case '3f': 
						$scope.forumPush = true;
					break;
					case '3g': 
						$scope.messagesEmail = true;
					break;
					case '3h': 
						$scope.messagesSMS = true;
					break;
					case '3i': 
						$scope.messagesPush = true;
					break;
				}
			}
			$scope.$apply();
		}
	});
	
	$scope.updateNotification = function() {
		debugger;
			if($scope.emailCheck){
				if($scope.preferences.indexOf('3a') == -1)
					$scope.preferences.push('3a');
			}
			else{
				var index = $scope.preferences.indexOf('3a');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.smsCheck){
				if($scope.preferences.indexOf('3b') == -1)
					$scope.preferences.push('3b');
			}
			else{
				var index = $scope.preferences.indexOf('3b');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.pushCheck){
				if($scope.preferences.indexOf('3c') == -1)
					$scope.preferences.push('3c');
			}
			else{
				var index = $scope.preferences.indexOf('3c');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.forumEmail){
				if($scope.preferences.indexOf('3d') == -1)
					$scope.preferences.push('3d');
			}
			else{
				var index = $scope.preferences.indexOf('3d');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.forumSMS){
				if($scope.preferences.indexOf('3e') == -1)
					$scope.preferences.push('3e');
			}
			else{
				var index = $scope.preferences.indexOf('3e');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.forumPush){
				if($scope.preferences.indexOf('3f') == -1)
					$scope.preferences.push('3f');
			}
			else{
				var index = $scope.preferences.indexOf('3f');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.messagesEmail){
				if($scope.preferences.indexOf('3g') == -1)
					$scope.preferences.push('3g');
			}
			else{
				var index = $scope.preferences.indexOf('3g');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.messagesSMS){
				if($scope.preferences.indexOf('3h') == -1)
					$scope.preferences.push('3h');
			}
			else{
				var index = $scope.preferences.indexOf('3h');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			if($scope.messagesPush){
				if($scope.preferences.indexOf('3i') == -1)
					$scope.preferences.push('3i');
			}
			else{
				var index = $scope.preferences.indexOf('3i');
				if(index !== -1)
					$scope.preferences.splice(index, 1);
			}
			debugger;
			endpoints.mobileHandler.updateNotifications($scope.apiKey, $scope.userId, $scope.panelistId, $scope.preferences, function(result){
			});
	}
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

$(function(){
	
             $(document).on('click','.reply-to-post a',function(){
                if($(this).closest('.grid-content').find('.comment-form.assignm').css('display')=='none'){
	                $('.comment-form.assignm').hide();
	                $(this).closest('.grid-content').find('.comment-form.assignm').slideDown();
            	}
            })
 })