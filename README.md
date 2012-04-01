Y.dither
--------

This is a YUI/canvas implementation of the [Atkinson Dither](http://verlagmartinkoch.at/software/dither/index.html). It also contains an impementation of [Floyd-Steinberg](http://en.wikipedia.org/wiki/Floyd–Steinberg_dithering) dithering, for those that prefer that look. Only supports 1bit.

Usage:

	YUI().use('dither', function(Y){
		Y.dither('#main-photo-container img', function(img){
			Y.one('#main-photo-container img').set('src', img);
		});		
	})

As used on Flickr for April fools. YUI Module. Released without license, as is, with no guarantee, support or anything else.