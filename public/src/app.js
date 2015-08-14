(function ()
{
	var app = angular.module ('homeworks', []);

	app.factory('socket', function socketFactory()
	{
		var myio = io();

		var f = null;
		myio.on('connect', function () 
  		{
  			console.log ('Established connection');
  		});

		myio.on("output", function(data)
		{
			
			if (f)
			{
				f(data);
			}
		});

  		return{
  			sendKeys: function(keys)
  			{
  				//console.log (keys);
  				myio.emit("input", {keys:keys});
  			},

  			start: function(col, row)
  			{
  				myio.emit("open", {cols: col, rows: row})
  			},

  			registerListener: function(func)
  			{
  				f = func;
  			},
  		};
		
	});

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

				this.link=trust("http://www.ee.surrey.ac.uk/Teaching/Unix/");
				this.hwId='1';
				this.setNewHw = function(link, hwId)
				{
					this.link = trust(link);
					this.hwId = hwId + 1;
				};

				this.showMenu = function()
				{
					console.log("exist");
					$('.ui.sidebar').sidebar('toggle');
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

	app.directive ('consola', ['socket', function (socket)
	{
		return {
			restrict: 'E',
			templateUrl: 'templates/consola.html',
			replace: true,
			scope:
			{
				name: "@"
			},
			controller: function ($scope)
			{
				setTimeout (function ()
				{
					var terminalContainer = document.getElementById($scope.name);
	    			var term = new Terminal();
	    			term.open(terminalContainer);
	    			term.fit();
	    			term.resize (term.cols-12, term.rows-2);
	    			socket.start(term.cols, term.rows);
	    	
	    			var write = function(data)
	    			{
	    				term.write(data.keys);
	    			};

	    			socket.registerListener(write);

	    			term.on('key', function (key, ev)
	    			{
	    				socket.sendKeys(key);
	    			});

				}, 1000);
			},
			
			controllerAs: 'consoleCtrl'
		};
	}]);
})();