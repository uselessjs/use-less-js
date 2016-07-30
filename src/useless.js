'use strict';

var useless = (function () {
	var api = {
	  	'constants': function (name, val) {
   			registry.constants[name] = val;
		},
		'application': function(name, dependancies){
			if(Array.isArray(dependancies)) {
                
            }
        },
    	'controller': function(name, handler) {
    		if(Array.isArray(handler)) {
    			var last_index = handler.length-1;
	            var dependancies = handler.slice(0, -1);
	            if (typeof handler[last_index] === "function") {
	                registry.controller[name] = handler[last_index];
	                registry.controller_dependancy[name] =  dependancies;
	                return;
	            }
    		} else if(typeof handler === "function") {
    			registry.controller[name] = handler;
    			return;
    		}
    		throw "controller function is not defined";
    	},
        'loadDependancies' : function(dependancies){
            var dependancy = [], iter;
            for (var i in dependancies) {
            	var dependant = dependancies[i];
                if (typeof dependency === "string") {
                    if (registry.hasOwnProperty(dependant)){
                        dependancy.push(registry[dependant]);
                    } else if (registry.constants.hasOwnProperty(dependant)) {
                            dependancy.push(registry.constants[dependant]);
                    } 
                }
            }
            return dependancy;
        },
    	'routes': function(url, callback) {
    		if(typeof callback === "function") {
   				registry.routes[url] = callback;
   				return;
   			} 
   			throw "route callback is not defined";
    	}
	},
	router = {
		'match': function(url){
			if (registry.routes.hasOwnProperty(url)) {
				registry.routes[url]();
			} else {
				console.log("No matching routes found")
			}
		}
	},
	registry = {
      	'constants' : {},
      	'application' : {},
      	'controller' : {},'controller_dependancy': {},
     	'routes' : {}
	},
	init = function(){
	  	window.onhashchange = function () {
        		router.match(window.location.hash.split('#')[1]);
    	}
	}
	init();

    return {
    	'constants': api.constants,
      	'application': api.application,
      	'controller': api.controller,
      	'routes': api.routes
    }
})();


