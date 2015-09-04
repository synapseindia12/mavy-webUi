var myApp = angular.module("mavyApp", ['ngRoute', 'ngCookies', 'ngStorage', 'ngFacebook', 'ui.mask', 'ui.bootstrap', 'angular-bind-html-compile']);
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
					$cookieStore.put('userName', $scope.uname);
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
		$facebook.login().then(function(result) {
			alert('Logged In');
			debugger;
			if(result.status){
				$scope.accessToken = result.authResponse.accessToken;
				$modal.open({
				  templateUrl: 'signupModal.html',
				  controller: 'signupModalctrl',
				  resolve: {
					accessToken: function(){
						return $scope.accessToken;
					}
				  }
				});
			}
		});
	};	
});

myApp.controller('signupModalctrl', function($scope, $modalInstance, $facebook, accessToken){
	$scope.ok = function () {
		var endpoints = {};
		$scope.newArray = [];
		endpoints.mobileHandler = new MobileHandler();
		$scope.username = $scope.displayname;
		$scope.token = accessToken;
		$scope.userSystemInfo = [];
		endpoints.mobileHandler.loginFb($scope.username, $scope.token, $scope.userSystemInfo, function(response){
			if(response.result.success){
				$localStorage.loggedIn = true;
				$localStorage.loginDetails = response.result.result;
				$location.path('/dashboard');
				$scope.$apply();
			}
			else{
				alert(response.result.message);
				$location.path('/');
			}
		});
		$modalInstance.dismiss('cancel');
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
	$scope.feedActive = true;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
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
			$cookieStore.put('assignments', $scope.allAssignments);
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
		$cookieStore.put('assignment', assignment);
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
		debugger;
		endpoints.mobileHandler.getPollResponseCounts($scope.apiKey, $scope.userId, result.result.result.Entries[$scope.incrementedVal].taskId, function(response){
			for(var i=0; i<result.result.result.Entries.length; i++){
				if(result.result.result.Entries[i].itemId == response.result.result[0].itemId){
					for(var j=0; j<response.result.result[0].values.length; j++){
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
		endpoints.mobileHandler.getPanelistPollResponses($scope.apiKey, $scope.userId,$scope.panelistId,result.result.result.Entries[$scope.incrementedVal].taskId, function(response){
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
	
	$scope.initializeTooltip = function(){
		$('.tooltip').tooltipster({
			maxWidth: 300
		});
	}
	
	// $scope.showHideImages = function() {
		// $scope.Active = false;
		// $scope.Assignments = false;
	// }
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
		$cookieStore.remove('userName');
		delete $localStorage.loggedIn;
		delete $localStorage.loginDetails;
		$location.path('/');
	}
	
	$scope.showHideimages = function(item){
		debugger;
		switch(item){
			case 'Home':
				$scope.feedActive = true;
				$scope.assignmentActive = false;
				$scope.forumActive = false;
				$scope.messagesactive = false;
				$location.path('/');
				break;
			case 'Assignment':
				$scope.feedActive = false;
				$scope.assignmentActive = true;
				$scope.forumActive = false;
				$scope.messagesactive = false;
				$location.path('/assignment');
				break;
			case 'Forum':
				$scope.feedActive = false;
				$scope.assignmentActive = false;
				$scope.forumActive = true;
				$scope.messagesactive = false;
				break;
			case 'Messages':
				$scope.feedActive = false;
				$scope.assignmentActive = false;
				$scope.forumActive = false;
				$scope.messagesactive = true;
				break;
		}
	}
	
});

myApp.controller('assignmentCtrl', function($scope, $location, $cookieStore, $localStorage, $rootScope){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	
	$scope.feedActive = false;
	$scope.assignmentActive = true;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	// $scope.initializeSlider = function() {
		// setTimeout(function(){
			// $scope.showAssignments = true;
			// $('.bxslider').bxSlider({
			  // auto: true,
			  // autoHover: true
			// });
		// }, 1500);
	// }
	$rootScope.forumActive = false;
	$rootScope.messagesactive = false;
	$rootScope.feedActive = false;
	$rootScope.assignmentActive = true;
	$scope.allAssignments = [];
	var loginDetails = $localStorage.loginDetails;
	$scope.apiKey = loginDetails[0].value;
	$scope.userId = loginDetails[1].value;
	$scope.panelistId = loginDetails[2].value;
	$scope.registrationId = loginDetails[3].value;
	$scope.featuredAssignment = [];
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	// Creating new handler for APIs
	endpoints.mobileHandler = new MobileHandler();
	//Querying APi for response using endpoints
	// endpoints.mobileHandler.getAssignments($scope.apiKey, $scope.userId, $scope.panelistId, function(result){
		// if (result.result.success){
			// for (var i=0; i< result.result.result.length; i++) {
				// $scope.allAssignments.push(result.result.result[i]);
			// }
		// }
		// $scope.$apply();
	// });
	
	endpoints.mobileHandler.getDashboard($scope.apiKey, $scope.userId, 1, null, null, function(result){
		if (result.result.success){
			for (var i=0; i< result.result.result.Entries.length; i++) {
				$scope.allAssignments.push(result.result.result.Entries[i]);
				if(result.result.result.Entries[i].modules[0].options.featured == 1){
					$scope.featuredAssignment.push(result.result.result.Entries[i]);
				}
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

 myApp.controller('showassignmentCtrl', function($scope, $cookieStore, $rootScope, $location, $localStorage, $sce){
	if(!$localStorage.loginDetails){
		delete $localStorage.loggedIn;
		$location.path('/');
	}
	$scope.displayName = $cookieStore.get('userName');
	$scope.showIframe = false;
	$scope.feedActive = false;
	$scope.assignmentActive = true;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
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
	$scope.displayTasks = [];
	$scope.allReplies = [];
	$scope.childReplies = [];
	$scope.showChildComments= false;
	
	var endpoints = {};
	endpoints.apiKey = $scope.apiKey;
	endpoints.mobileHandler = new MobileHandler();
	
	$scope.assignment = $cookieStore.get('assignment');
	$scope.projectId = $scope.assignment.projectId;
	if($scope.assignment.modules){
		$scope.moduleId = $scope.assignment.modules[0].moduleId;
		$scope.moduleType = $scope.assignment.modules[0].moduleType;
	}
	else{
		$scope.moduleId = $scope.assignment.moduleId;
		$scope.moduleType = $scope.assignment.moduleType;
	}
	
	if($scope.moduleType == 1){
		endpoints.mobileHandler.getPanelistModuleTasks($scope.apiKey, $scope.userId, $scope.projectId, $scope.moduleId, $scope.panelistId, 20, 0, function(result){
			if(result.result.result.AvailableTasks.length > 0){
				for(var i=0;i<result.result.result.AvailableTasks.length;i++){
					$scope.tasks.push(result.result.result.AvailableTasks[i]);
				}
			}
		
			if($scope.tasks.length > 0){
				endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
					$scope.userAvatarUrl = response.result.result[0].Content.CreatedByUser.AvatarUrl;
					$scope.displayName = response.result.result[0].Author.DisplayName;
					$scope.displayTasks = [];
					if(response.result.result[0].Author.DisplayName == $scope.displayName){
						$scope.displayTasks.push($scope.tasks[$scope.i]);
					}
					else{
						if($scope.tasks[$scope.i].RevealBehaviorId == 1){
							$scope.displayTasks.push($scope.tasks[$scope.i]);
						}
						else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
							if(response.result.result[0].Thread.HasParticipated == true)
								$scope.displayTasks.push($scope.tasks[$scope.i]);
						}
					}
					
					if($scope.displayTasks.length > 0){
						alert('Inside the tasks');
						debugger;
						endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
							alert('Got the results');
							debugger;
							if(replies.result.result[1]){
								$scope.replyCounts = replies.result.result[1].TotalCount;
								if(replies.result.success){
									for(var i=0; i<replies.result.result[1].Replies.length; i++){
										if(replies.result.result[1].Replies[i].ParentId == 0){
											$scope.allReplies.push(replies.result.result[1].Replies[i]);
										}
										$scope.childReplies.push(replies.result.result[1].Replies[i])
									}
								}
							}
							else{
								$scope.replyCounts = 0;
								$scope.allReplies = [];
								$scope.childReplies = [];
							}
							$scope.$apply();
						});
					}								
					$scope.$apply();
				});
			}
		});
	}
	else {
		$scope.showIframe = true;
		if($scope.assignment.modules){
			$scope.iframeSource = $scope.assignment.modules[0].options.baseSurveyLink + $scope.panelistId;
		}
		else{
			$scope.iframeSource = $scope.assignment.options.baseSurveyLink + $scope.panelistId;
		}
	}

	$scope.markCompleted = function(task) {
		var reply = $('#reply').val();
		debugger;
		if(task.CompletedTaskCount == 0){
			var Id = 0;
		}
		else{
			Id = task.Id;
		}
		endpoints.mobileHandler.saveTaskReply($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,task.TaskId,$scope.panelistId,task.Id,reply,null,null, function(response){
			endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, task.TaskId, $scope.panelistId, 20, 0, function(replies){
				if(replies.result.success){
					for(var i=0; i<replies.result.result[1].Replies.length; i++){
						if(replies.result.result[1].Replies[i].ParentId == 0){
							$scope.allReplies.push(replies.result.result[1].Replies[i]);
						}
						$scope.childReplies.push(replies.result.result[1].Replies[i])
					}
				}
				$scope.$apply();
			});
		});
	};
	
	$scope.submitChildReply = function(Id, TaskId) {
		$scope.childReplyId = Id;
		$scope.TaskId = TaskId;
		var reply = $('#replyNewChild').val();
		debugger;
		endpoints.mobileHandler.saveTaskReply($scope.apiKey,$scope.userId,$scope.projectId,$scope.moduleId,$scope.TaskId,$scope.panelistId,$scope.childReplyId,reply,null,null, function(response){
			alert('Your comment is been submitted');
			endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, task.TaskId, $scope.panelistId, 20, 0, function(replies){
				if(replies.result.success){
					for(var i=0; i<replies.result.result[1].Replies.length; i++){
						$scope.childReplies.push(replies.result.result[1].Replies[i]);
					}
				}
				alert('Your comment will be updated Soon...');
				$('#replyNewChild').val() = '';
				$scope.$apply();
			});
		});
	};
	
	$scope.getNextTask = function(i) {
		if($scope.tasks[i].TaskStatus == 'Completed'){
			var taskId = $scope.tasks[i].TaskId;
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
								endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
									$scope.displayTasks = [];
									if(response.result.result[0].Author.DisplayName == $scope.displayName){
										$scope.displayTasks.push($scope.tasks[$scope.i]);
									}
									else{
										if($scope.tasks[$scope.i].RevealBehaviorId == 1){
											$scope.displayTasks.push($scope.tasks[$scope.i]);
										}
										else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
											if(response.result.result[0].Thread.HasParticipated == true)
												$scope.displayTasks.push($scope.tasks[$scope.i]);
										}
									}
									
									if($scope.displayTasks.length > 0){
										alert('Inside the tasks');
										debugger;
										endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
											alert('Got the results');
											debugger;
											if(replies.result.result[1]){
												$scope.replyCounts = replies.result.result[1].TotalCount;
												if(replies.result.success){
													for(var i=0; i<replies.result.result[1].Replies.length; i++){
														if(replies.result.result[1].Replies[i].ParentId == 0){
															$scope.allReplies.push(replies.result.result[1].Replies[i]);
														}
														$scope.childReplies.push(replies.result.result[1].Replies[i])
													}
												}
											}
											else{
												$scope.replyCounts = 0;
												$scope.allReplies = [];
												$scope.childReplies = [];
											}
											$('.childComments').hide();
											$('.comment-form').hide();
											$scope.$apply();
										});
									}					
									$scope.$apply();
								});
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
		else {
			$scope.hideLeftArrow = true;
			//alert('Project is not yet marked completed. Please complete this task and then move forward');
		}
	}
	
	$scope.getPreviousTasks = function(i) {
		var taskId = $scope.tasks[i].TaskId;
		if($scope.i > 0)
			$scope.i = $scope.i - 1;
			endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$scope.tasks[$scope.i].ForumThreadId,null,null,function(response){
				$scope.userAvatarUrl = response.result.result[0].Content.CreatedByUser.AvatarUrl;
				$scope.displayName = response.result.result[0].Author.DisplayName;
				$scope.displayTasks = [];
				if(response.result.result[0].Author.DisplayName == $scope.displayName){
					$scope.displayTasks.push($scope.tasks[$scope.i]);
				}
				else{
					if($scope.tasks[$scope.i].RevealBehaviorId == 1){
						$scope.displayTasks.push($scope.tasks[$scope.i]);
					}
					else if($scope.tasks[$scope.i].RevealBehaviorId == 2){
						if(response.result.result[0].Thread.HasParticipated == true)
							$scope.displayTasks.push($scope.tasks[$scope.i]);
					}
				}
				if($scope.displayTasks.length > 0){
					alert('Inside the tasks');
					debugger;
					endpoints.mobileHandler.getTaskReplies($scope.apiKey,$scope.userId, $scope.projectId, $scope.moduleId, $scope.displayTasks[0].TaskId, $scope.panelistId, 20, 0, function(replies){
						alert('Got the results');
						debugger;
						if(replies.result.result[1]){
							$scope.replyCounts = replies.result.result[1].TotalCount;
							if(replies.result.success){
								for(var i=0; i<replies.result.result[1].Replies.length; i++){
									if(replies.result.result[1].Replies[i].ParentId == 0){
										$scope.allReplies.push(replies.result.result[1].Replies[i]);
									}
									$scope.childReplies.push(replies.result.result[1].Replies[i])
								}
							}
						}
						else{
							$scope.replyCounts = 0;
							$scope.allReplies = [];
							$scope.childReplies = [];
						}
						$('.childComments').hide();
						$('.comment-form').hide();
						$scope.$apply();
					});
				}
				$scope.$apply();
			});
			if($scope.i == 0){
				$scope.hideRightArrow = false;
				$scope.hideLeftArrow = false;
			}
		else
			$scope.hideRightArrow = false;
			$scope.hideLeftArrow = false;
	}
	
	$scope.gotoReplyBox = function(){
		$('.comment-form').show();
		$(this).parents('.grid-content').find('.comment-form').show();
	};
	
	$scope.gottoChildReplyBox = function(Id, TaskId) {
		$scope.childReplyId = Id;
		$scope.TaskId = TaskId;
		$('.childComments').hide();
		$('.childAssignment' + Id).show();
	}
	
	$scope.showChildComments = function(parentId){
		debugger;
		$scope.childComments = true;
		$scope.ForumId = parentId;
	}
});

myApp.controller('forumCtrl', function($scope,$localStorage,$rootScope,$location){
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = true;
	$scope.messagesactive = false;
	 $scope.activeThreads = [];
	 $scope.childThreads = [];
	 $scope.nextLevelChild =[];
	
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
	 
	 endpoints.mediaHandler = new MediaHandler();
	
 //endpoints.mobileHandler.getActiveThreads($scope.apiKey,$scope.userId,3,null,null,function(result){
 	$scope.loadActiveThreads = function(){
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
	};

	if($rootScope.allForums) {
	   for(var i=0; i<$rootScope.allForums.length; i++){   
		$scope.activeThreads.push($rootScope.allForums[i]);
	   }
   
	}
	else {
		$scope.loadActiveThreads();
	}
 
	$scope.getChilds=function(id){
	  $rootScope.currentId = id;
	  if($scope.childThreads.length > 0) {
	   $scope.childThreads = [];
	  } 
	  else{
	   $scope.parentId=null;
	   $scope.threadId=null;
	  }
	  endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,$rootScope.currentId,null,null,function(child){
	  	debugger;
		if(child.result.success){
			//alert('Got it');
			debugger;
		   if(child.result.result[1].Replies) {
			for(var j=0; j<child.result.result[1].Replies.length; j++){    
			 if(id == child.result.result[1].Replies[j].ThreadId)
			  $scope.childThreads.push(child.result.result[1].Replies[j]);
			}
		   }
		   $scope.$apply();
			// $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
		}
		else{
			//$('html,body').stop().animate({'scrollTop':($('#child-reply-box').offset().top-$('#child-reply-box').height())},'500','swing',function(){});
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
  debugger;
  if(replyText){
   endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,id,0,replyText,function(response){
    
    if(response.result.success){
     alert('success');
     
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
      debugger;
      $('html,body').stop().animate({'scrollTop':($('#reply-box').offset().top-$('#reply-box').height())},'500','swing',function(){});
      
     });
     debugger;
     $scope.activeThreads = [];
     $scope.loadActiveThreads();
     $('#reply').val('');
     $scope.$apply();
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
 
 $scope.savechildThreadReply = function(threadId,parentId) {
	alert($('#displayReplyBox'+parentId+' textarea').val()+' '+threadId+' '+parentId);
	if($('#displayReplyBox'+parentId+' textarea').val()){
	var replyText = $('#displayReplyBox'+parentId+' textarea').val();
   endpoints.mobileHandler.saveReply($scope.apiKey,$scope.userId,threadId,parentId,replyText,function(response){
    
    if(response.result.success){
     alert('success');
     
     $rootScope.currentId = threadId;
     if($scope.childThreads.length > 0) {
      $scope.childThreads = [];
     } 
     
     endpoints.mobileHandler.getThreadReplies($scope.apiKey,$scope.userId,threadId,null,null,function(child){

      if(child.result.result[1].Replies) {
       for(var j=0; j<child.result.result[1].Replies.length; j++){    
        if(threadId == child.result.result[1].Replies[j].ThreadId)
         $scope.childThreads.push(child.result.result[1].Replies[j]);
       }
      
      } 
      
      $scope.$apply();
      debugger;
  
     });
     debugger;
     $scope.activeThreads = [];
     $scope.loadActiveThreads();
     $('#displayReplyBox'+parentId+' textarea').val('');
     $scope.nextLevelChild =[];
      $scope.$apply();
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
 
 $scope.showChildCommentBox = function(id) {
	debugger;
	$('.childCommentBox').hide();
	
	$('#displayReplyBox' + id).show();
	$scope.nextLevelChild=[];
	for(var i=0;i<$scope.childThreads.length;i++){
		if($scope.childThreads[i].ParentId==id){
			$scope.nextLevelChild.push($scope.childThreads[i]);
		}
	}
	
	debugger;
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
		sourceAppType = "MRTelligent";
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
				signature = signature.toString();
				debugger;

				endpoints.mediaHandler.convertMedia("6OoRO1+3C0askOF2V0gTEE4IUIyN2aNBuJLFoxCgBho=","D6k0kuTZCy2zLSkluMjJaHGGSyM=","cfsagency","1009","MRTelligent","Image","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",0,function(response){
					alert('In there');
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
 
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = true;
	$scope.messagesactive = false;
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
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = true;
	
	$rootScope.forumActive = false;
	$rootScope.messagesactive = true;
	$rootScope.feedActive = false;
	$rootScope.assignmentActive = false;
	
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
	debugger;
		if($scope.showExpandMessage){
			$scope.showExpandMessage = false;
			$scope.internalMessages = [];
		}
		else {
			$scope.showExpandMessage = true;
			$scope.internalMessages = [];
			$scope.message = message;
			conversationId = message.LastMessage.ConversationId;
			endpoints.mobileHandler.getInboxMessages($scope.apiKey, $scope.userId, conversationId, null, null, function(result){
				for(var i=0; i<result.result.result.Messages.length; i++){
					$scope.internalMessages.push(result.result.result.Messages[i]);
				}			
				$scope.$apply();
			});
		}
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
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = true;
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
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
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
			if(callback.result.result.bdate.slice('/')[1] == '/')
				$scope.selectedMonth = callback.result.result.bdate.slice('/')[0];
			else
				$scope.selectedMonth = callback.result.result.bdate.slice('/')[0] + callback.result.result.bdate.slice('/')[1];
			if(callback.result.result.bdate.slice('/')[1] != '/')
				$scope.selectedDate = callback.result.result.bdate.slice('/')[3] + callback.result.result.bdate.slice('/')[4];
			else
				if(callback.result.result.bdate.slice('/')[3] == '/')
					$scope.selectedDate = callback.result.result.bdate.slice('/')[2];
				else
					$scope.selectedDate = callback.result.result.bdate.slice('/')[2] + callback.result.result.bdate.slice('/')[3];
			if(callback.result.result.bdate.slice('/')[3] == '/')
				$scope.selectedYear = callback.result.result.bdate.slice('/')[4]+callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7];				
			if(callback.result.result.bdate.slice('/')[4] == '/')
				$scope.selectedYear = callback.result.result.bdate.slice('/')[5]+callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7]+callback.result.result.bdate.slice('/')[8];
			if(callback.result.result.bdate.slice('/')[5] == '/')
				$scope.selectedYear = callback.result.result.bdate.slice('/')[6]+callback.result.result.bdate.slice('/')[7]+callback.result.result.bdate.slice('/')[8]+callback.result.result.bdate.slice('/')[9];
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
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
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
				debugger;
				switch(resultArray[i]){
					case "3a": 
						if($scope.preferences.indexOf("3e") !== -1){
							if($scope.preferences.indexOf("3h") !== -1){
								$scope.emailCheck = true;
							}
						}	
					break;
					case "2a": 
						if($scope.preferences.indexOf("2e") !== -1){
							if($scope.preferences.indexOf("2h") !== -1){
								$scope.smsCheck = true;
							}
						}
					break;
					case "1a": 
						if($scope.preferences.indexOf("1e") !== -1){
							if($scope.preferences.indexOf("1h") !== -1){
								$scope.pushCheck = true;
							}
						}
					break;
					case "3b": 
						if($scope.preferences.indexOf("3c") !== -1){
							$scope.forumEmail = true;
						}
					break;
					case "2b": 
						if($scope.preferences.indexOf("2c") !== -1){
							$scope.forumSMS = true;
						}
					break;
					case "1b": 
						if($scope.preferences.indexOf("1c") !== -1){
							$scope.forumPush = true;
						}
					break;
					case "3f": 
						$scope.messagesEmail = true;
					break;
					case "2f": 
						$scope.messagesSMS = true;
					break;
					case "1f": 
						$scope.messagesPush = true;
					break;
					case "3d":
						$scope.resultsEmail = true;
						break;
					case "2d":
						$scope.resultsSMS = true;
						break;
					case "1d":
						$scope.resultsPush = true;
						break;
				}
			}
			$scope.$apply();
		}
	});
	
	$scope.updateNotification = function() {
		debugger;
		if($scope.emailCheck){
			if($scope.preferences.indexOf("3a") == -1)
				$scope.preferences.push("3a", "3e", "3h");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("3a") !== -1){
				findIndexes.push($scope.preferences.indexOf("3a"));
				findIndexes.push($scope.preferences.indexOf("3e"));
				findIndexes.push($scope.preferences.indexOf("3h"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.smsCheck){
			if($scope.preferences.indexOf("2a") == -1)
				$scope.preferences.push("2a", "2e", "2h");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("2a") !== -1){
				findIndexes.push($scope.preferences.indexOf("2a"));
				findIndexes.push($scope.preferences.indexOf("2e"));
				findIndexes.push($scope.preferences.indexOf("2h"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.pushCheck){
			if($scope.preferences.indexOf("1a") == -1)
				$scope.preferences.push("1a", "1e", "1h");
		}
		else {
			var findIndexes = [];
			if($scope.preferences.indexOf("1a") !== -1){
				findIndexes.push($scope.preferences.indexOf("1a"));
				findIndexes.push($scope.preferences.indexOf("1e"));
				findIndexes.push($scope.preferences.indexOf("1h"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.forumEmail){
			if($scope.preferences.indexOf("3b") == -1)
				$scope.preferences.push("3b", "3c");
		}
		else {
			var findIndexes = [];
			if($scope.preferences.indexOf("3b") !== -1){
				findIndexes.push($scope.preferences.indexOf("3b"));
				findIndexes.push($scope.preferences.indexOf("3c"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.forumSMS){
			if($scope.preferences.indexOf("2b") == -1)
				$scope.preferences.push("2b", "2c");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("2b") !== -1){
				findIndexes.push($scope.preferences.indexOf("2b"));
				findIndexes.push($scope.preferences.indexOf("2c"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.forumPush){
			if($scope.preferences.indexOf("1b") == -1)
				$scope.preferences.push("1b", "1c");
		}
		else{
			var findIndexes = [];
			if($scope.preferences.indexOf("1b") !== -1){
				findIndexes.push($scope.preferences.indexOf("1b"));
				findIndexes.push($scope.preferences.indexOf("1c"));
				if(findIndexes.length > 0){
					for(var i=0; i< findIndexes.length; i++){
						$scope.preferences.splice(findIndexes[i], 1);
					}
				}
			}
		}
		if($scope.resultsEmail){
			if($scope.preferences.indexOf("3d") == -1)
				$scope.preferences.push("3d");
		}
		else{
			var index = $scope.preferences.indexOf("3d");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.resultsSMS){
			if($scope.preferences.indexOf("2d") == -1)
				$scope.preferences.push("2d");
		}
		else{
			var index = $scope.preferences.indexOf("2d");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.resultsPush){
			if($scope.preferences.indexOf("1d") == -1)
				$scope.preferences.push("1d");
		}
		else{
			var index = $scope.preferences.indexOf("1d");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.messagesEmail){
			if($scope.preferences.indexOf("3f") == -1)
				$scope.preferences.push("3f");
		}
		else{
			var index = $scope.preferences.indexOf("3f");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.messagesSMS){
			if($scope.preferences.indexOf("2f") == -1)
				$scope.preferences.push("2f");
		}
		else{
			var index = $scope.preferences.indexOf("2f");
			if(index !== -1)
				$scope.preferences.splice(index, 1);
		}
		if($scope.messagesPush){
			if($scope.preferences.indexOf("1f") == -1)
				$scope.preferences.push("1f");
		}
		else{
			var index = $scope.preferences.indexOf("1f");
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
	
	$scope.feedActive = false;
	$scope.assignmentActive = false;
	$scope.forumActive = false;
	$scope.messagesactive = false;
	
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
})

.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
		if(attrs.dynamic){
			ele.html(attrs.dynamic);
			$compile(ele.contents())(scope);
		}
    }
  };
})

.directive('bxSlider', function () {
        var BX_SLIDER_OPTIONS = {
             auto: true,
			autoHover: true
        };

        return {
            restrict: 'A',
            require: 'bxSlider',
            priority: 0,
            controller: function() {},
            link: function (scope, element, attrs, ctrl) {
				debugger;
                var slider;
                ctrl.update = function() {
                    slider && slider.destroySlider();
                    slider = element.bxSlider(BX_SLIDER_OPTIONS);
                };
            }
        }
    })
 
.directive('bxSliderItem', function($timeout) {
        return {
            require: '^bxSlider',
            link: function(scope, elm, attr, bxSliderCtrl) {
                if (scope.$last) {
					debugger;
                    bxSliderCtrl.update();
                }
            }
        }
    })
  
.directive('docListWrapper', ['$timeout', function ($timeout) {
        return {
            restrict: 'C',
            priority: 500,
            replace: false,
            templateUrl: 'tmpl-doc-list-wrapper',
            scope: { docs: '=docs'},
            link: function (scope, element, attrs) {
            }
        };
    }]);

myApp.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

(function (angular) {
    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // Incase value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }]);
}(window.angular));

// $(function(){
	
             // $(document).on('click','.reply-to-post a',function(){
                // if($(this).closest('.grid-content').find('.comment-form.assignm').css('display')=='none'){
	                // $('.comment-form.assignm').hide();
	                // $(this).closest('.grid-content').find('.comment-form.assignm').slideDown();
            	// }
            // })
 // })