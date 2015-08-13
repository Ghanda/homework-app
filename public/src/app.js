(function ()
{
	var app = angular.module ('homeworks', []);

	app.directive ('homeworks', function ()
	{
		return {
			restrict: 'E',
			templateUrl: 'templates/homeworks.html',
			replace: true,
			controller: function($http, $sce)
			{
				var hws = this;
				hws.homeworks = [];

				$http.get('/homeworks.json')
					.success(function(data)
				{
					hws.homeworks = data;
				});

				function trust(link)
				{
					return $sce.trustAsResourceUrl(link);
				}

				this.link=trust("http://ocw.cs.pub.ro/courses/uso/tema-1");
				this.hwId='1';
				this.setNewHw = function(link, hwId)
				{
					this.link = trust(link);
					this.hwId = hwId + 1;
				};
			},
			controllerAs: 'hwsCtrl'
		};
	});

	app.directive ('menu', function ()
	{
		return {
			restrict: 'E',
			templateUrl: 'templates/menu.html',
			replace: true,
			scope:
			{
				hws: "=",
				newLink:"&"
			},
			controller: function ($scope)
			{
				this.activetab = 0;
				
				this.isSetTab = function(id)
				{
					return this.activetab === id;
				};

				this.setTab = function(id)
				{
					this.activetab = id;
				};

				this.setLink = function(lnk, id)
				{
					$scope.newLink({link: lnk, hwId: id});
				};

				this.click = function(id, lnk)
				{
					this.setLink(lnk, id);
					this.setTab(id);	
				};
			},
			controllerAs: 'menuCtrl'
		};
	});

	app.directive ('enunt', function ()
	{
		return {
			restrict: 'E',
			templateUrl: 'templates/enunt.html',
			replace: true,
			scope:
			{
				link:"=",
				hwId:"=",
			},
			controller: function ($scope)
			{

			},
			controllerAs: 'enuntCtrl'
		};
	});

	app.directive ('consola', function ()
	{
		return {
			restrict: 'E',
			templateUrl: 'templates/consola.html',
			replace: true,
			controller: function ()
			{

			},
			controllerAs: 'consoleCtrl'
		};
	});
})();