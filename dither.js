/*jslint white: false, undef: false, browser: true, eqeqeq: true, regexp: false, newcap: true, immed: true, onevar: false, plusplus: false maxerr: 50 */
/*global YUI:false, window:false*/
/* $Id$ */
YUI.add('dither', function (Y) {
	
	var photo, floyd = 0;
	
	function dither(photo, callback){

		var canvas = document.createElement('canvas'),
		    ctx = canvas.getContext('2d'),
		    that = this,
		    thisRow,
		    out = [],
		    img = new Image(),
		    data,
		    that = this;
		
		function findClosestValue(pixel){
			// return(Math.round(pixel/255));
			if(pixel > 130){
				return 255;
			}else{
				return 0;
			}

		}
		
		function getAverage(x, y){
			var i = getPixelIndex(x,y);
			return (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
		}
		
		function getPixelIndex(x, y){
			return (y * 4) * data.width + x * 4;
		}
		
		function setPixel(x, y, value){
			var i = getPixelIndex(x,y);
			data.data[i] = value;
			data.data[i + 1] = value;
			data.data[i + 2] = value;
		}
		
		
		img.onload = function(){
			
			canvas.height = img.height;
			canvas.width = img.width;
			
			var index;

			ctx.drawImage(img, 0,0, img.width, img.height);

			data = ctx.getImageData(0,0, img.width, img.height);
			
			var i, avg, color, ch;
			

			for(var y = 0; y < data.height; y++){
				thisRow = [];
				for(var x = 0; x < data.width; x++){
					i = (y * 4) * data.width + x * 4;
					avg = getAverage(x, y);
					var newavg = findClosestValue(avg);
					

					setPixel(x, y, newavg);
					var err = avg - newavg;
					
					if(floyd){
						setPixel(x+1, y, getAverage(x+1, y) + (7/16) * err);
						setPixel(x-1, y+1, Math.round(getAverage(x-1, y+1) + (3/16) * err));
						setPixel(x, y+1, Math.round(getAverage(x, y+1) + (5/16) * err));
						setPixel(x+1, y+1, Math.round(getAverage(x+1, y+1) + (1/16) * err));
					}else{
						setPixel(x+1, y, getAverage(x+1, y) + (1/8) * err);
						setPixel(x+2, y, getAverage(x+2, y) + (1/8) * err);
						setPixel(x-1, y+1, getAverage(x-1, y+1) + (1/8) * err);
						setPixel(x, y+1, getAverage(x, y+1) + (1/8) * err);
						setPixel(x+1, y+1, getAverage(x+1, y+1) + (1/8) * err);
						setPixel(x, y+2, getAverage(x, y+2) + (1/8) * err);
						
					}

				}
			}
			
			
			ctx.putImageData(data, 0, 0);
			
			callback(canvas.toDataURL());
		}
		
		img.crossOrigin = "";
		img.src = photo;
		
		
	}
	
	function doDither(img, callback, steinberg){
		var photo = Y.one(img);
		
		if(steinberg){
			floyd = 1;
		}
		dither(photo.get('src'), callback);
	}

	/**
	  * Dither takes three params, an image node (or selector for one), a callback function
	  * and optionally, steinberg. If steinberg is true this will use the Floyd-Steinberg
	  * dither rather than the default (Atkinson)
	  */
	Y.dither = doDither;

}, '0.0.1', {
	requires: ['node']
});