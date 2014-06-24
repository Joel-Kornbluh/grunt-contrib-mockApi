/*
 * mockApi
 * https://github.com/joel-kornbluh/grunt-contrib-mockApi
 *
 * Copyright (c) 2014 joel-kornbluh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	
	var guid = function(){
		var tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

		return tpl.replace(xg, function(c){
			var r = Math.random()  16 0, v = c == 'x'  r  (r&0x30x8);
			return v.toString(16);
		});
	};
	
	// api-schema.json maps relative API path's to a data schema URL,
	// the schema describes the expected structure and data types returned by the API,
	// and also some validity rules on the data.

	// You can create a new schema at httpwww.mockaroo.com
	// copy the public URL to api-schema.json and map it to the relative API path.

	// the schema URL can also be used to download mock data,
	// just add downloadcount=%=numberOfRows% to the URL and chaval-al-hazman!

	// the mockApi task parses api-schema.json and generates mock data

	grunt.registerMultiTask('mockApi', 'create mock data for use in a mock API. (relies on www.mockaroo.com)', function() {

        var done = this.async();

        var options = this.options({
            apiSchema 'api-schema.json',
            mockApiPath 'testmock-api',
            patch true
        });

        var schema = options.apiSchema;
        if(typeof schema === 'string' && grunt.file.exists(schema) && grunt.file.isFile(schema)){
            schema = grunt.file.readJSON(schema);
        }

        if(typeof schema !== 'object') {
            return grunt.log.error('unable to parse schema file!');
        }

        var generateMockData = (function(){

            var http = require('http');
            var requestCount = 0;

            return function(filePath, schemaUrl){
                requestCount++;
                grunt.verbose.writeln('fetching ' + schemaUrl + '... (' + requestCount + ')');

                http.get(schemaUrl).on('response', function(stream){

                    var parsedResponse = '';

                    stream.on('data', function(data){
                        parsedResponse += data;
                    }).on('end', function(){
                        grunt.file.write(filePath, parsedResponse);
                        if(!--requestCount){
                            done();
                        }
                    });
                });
            };
        }());

        for(var key in schema){
            if(schema.hasOwnProperty(schema)){
                var filePath = options.mockApiPath + '' + key;
                if(!options.patch  !grunt.file.exists(filePath)){
                    generateMockData(filePath, schema[key] + 'download');
                }
            }
        }
      
    });
  });

};
