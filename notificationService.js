var myMod = angular.module('myMod', []);

var NotificationsArchive = function(){

};

var NotificationService = function (notificationsArchive) {
	this.MAX_LEN = 10;
	this.notificationsArchive = new NotificationsArchive();
	this.notifications = [];
};

NotificationService.prototype.push = function(notification){
	var newLen, notificationToArchive;

	newLen = this.notifications.unshift(notification);
	if(newLen > this.MAX_LEN){
		notificationToArchive = this.notifications.pop();
		this.notificationsArchive.archive(notificationToArchive);
	}
};

NotificationService.prototype.getCurrent = function(){
	return this.notifications;
};

// Register very simple objects as values on a module - no DI
myMod.value('notificationsArchive', new NotificationsArchive());

// Need DI for notificationService, so register object using service method
myMod.service('notificationsService', NotificationService);

// Registering object as factory is more flexible than service method
myMod.factory('notificationsService', function(notificationArchive, MAX_LEN){
	this.MAX_LEN = 10;
	this.notifications = [];

	return{
		push: function(notification){
			var newLen, notificationToArchive;

			newLen = this.notifications.unshift(notification);
			if(newLen > this.MAX_LEN){
				notificationToArchive = this.notifications.pop();
				this.notificationsArchive.archive(notificationToArchive);
			}
		},
		getCurrent: function(){
			return this.notifications;
		}
	}

});
// Can set constants outside of the service
myMod.constant('MAX_LEN', 10);

// Provider method is most generic, ultimate version of registering objects
// Providers are objects that embed factory functions in their $get property
myMod.provider('notificationsService', function(){
	var config = {
		maxLen: 10
	};
	var notifications = [];

	return {
		setMaxLen: function(maxLen){
			config.maxLen = maxLen || config.maxLen;
		},
		$get: function(notificationsArchive){
			return{
				push: function(notification){
					var newLen, notificationToArchive;

					newLen = this.notifications.unshift(notification);
					if(newLen > config.maxLen){
						notificationToArchive = this.notifications.pop();
						this.notificationsArchive.archive(notificationToArchive);
					}
				},
				getCurrent: function(){
					return this.notifications;
				}
			};
		}
	}
});