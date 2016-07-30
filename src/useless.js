'use strict';

var Application = (function (appName, appDependencies) {
	var api = {
	  	'constants': function (name, val) {
   			registry.constants[name] = val;
		},
		'service': function (name, handler) {
			var serviceObj = {};
			handler.apply(serviceObj);
   			registry.service[name] = serviceObj;
		},
    	'controller': function(name, handler) {
    		if(Array.isArray(handler)) {
    			var last_index = handler.length-1;
	            var ctlDepdendencies = handler.slice(0, -1);
	            if (typeof handler[last_index] === "function") {
	                registry.controller[name] = handler[last_index].apply({}, api.loadCtrlDependencies(ctlDepdendencies));
	                return;
	            }
    		} else if(typeof handler === "function") {
    			registry.controller[name] = handler.apply({});
    			return;
    		}
    		throw "controller function is not defined";
    	},
        'loadCtrlDependencies' : function(ctlDepdendencies){
            var dependancy = [];
            for (var i in ctlDepdendencies) {
            	var dependant = ctlDepdendencies[i];
                if (typeof dependant === "string") {
                    if (registry.hasOwnProperty(dependant)){
                        dependancy.push(registry[dependant]);
                    } else if (registry.service.hasOwnProperty(dependant)) {
                        dependancy.push(registry.service[dependant]);
                    } else if (registry.appDependency.hasOwnProperty(dependant)) {
                    	dependancy.push(registry.appDependency[dependant]);
                    } else {
                    	throw "Ctrl dependency "+dependant+"is undefined";
                    }
                }
            }
            return dependancy;
        },
        'loadAppDependencies' : function(){
        		for(var i in appDependencies) {
        	if(Array.isArray(appDependencies)) {
        			var dependantAppName = appDependencies[i];
        			if(UseLess.appRegistry.hasOwnProperty(dependantAppName)) {
        				registry.appDependency[dependantAppName] = UseLess.appRegistry[dependantAppName]
        			} else {
        				throw "Dependant app "+dependantAppName+" is undefined";
        			}
        		}
        	}
        },
    	'route': function(url, mapping) {
    		if(typeof mapping === "object") {
   				registry.route[url] = new Router(mapping);
   				return this;
   			} 
   			throw "route mapping is not defined";
    	}
	},
	router = {
		'match': function(url){
			if (registry.route.hasOwnProperty(url)) {
				registry.route[url].render();
			} else {
				console.log("No matching route found")
			}
		}
	},
	registry = {
		'constants': {},
      	'service' : {},
      	'controller' : {},
      	'appDependency': {},
     	'route' : {}
	},
	init = function(){
		api.loadAppDependencies();
	  	window.onhashchange = function () {
        	router.match(window.location.hash.split('#')[1]);
    	}
	}
	init();

    return {
    	'constants': api.constants,
    	'service': api.service,
      	'controller': api.controller,
      	'route': api.route
    }
});

var Router = (function(mapping){
	var api = {
		'render': function() {
			alert(mapping.template);
		}
	}
	return {
		render: api.render
	}
});

var UseLess = (function(){
	var api = {
		'create': function(name, dependencies) {
			var app = new Application(name, dependencies);
			registry[name] = app;
			return app;
		}
	},
	registry = {}

	return {
		'create': api.create,
		'appRegistry': registry
	};
})();


