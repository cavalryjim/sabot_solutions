/*
 * 	loopedCarousel 0.5 - jQuery plugin
 *	written by Nathan Searles, based on loopedSlider (http://github.com/nathansearles/loopedSlider)	
 *	http://github.com/nathansearles/loopedCarousel
 *
 *	Copyright (c) 2009 Nathan Searles (http://nathansearles.com/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */

/*
 *	markup example for $("#loopedCarousel").loopedCarousel();
 *
 *	<div id="loopedCarousel">	
 *		<div class="container">
 *			<div class="slides">
 *		<ul>
 *			<li>1</li>
 *			<li>2</li>
 *			<li>3</li>
 *			<li>4</li>
 *		</ul>
 *		<ul>
 *			<li>5</li>
 *			<li>6</li>
 *			<li>7</li>
 * 			<li>8</li>
 *		</ul>
 *		<ul>
 *			<li>9</li>
 *			<li>10</li>
 *			<li>11</li>
 *			<li>12</li>
 *		</ul>
 *		<ul>
 *			<li>13</li>
 *			<li>14</li>
 *			<li>15</li>
 *			<li>16</li>
 *		</ul>
 *			</div>
 *		</div>
 *		<a href="#" class="previous">previous</a>
 *		<a href="#" class="next">next</a>	
 *	</div>
 *
 */

(function($) {
	$.fn.loopedCarousel = function(options) {
		
	var defaults = {			
		container: '.container2',
		slides: '.slides2',
		pagination: '.pagination',
		autoStart: 0, // Set to positive number for auto interval and interval time
		slidespeed: 300, // Speed of slide animation
		fadespeed: 200, // Speed of fade animation
		items: 2, // Items show
		padding: 25, // Padding between items
		showPagination: true, // Shows pagination links
		vertical: false
	};
		
	this.each(function() {	
		var obj = $(this);
		var o = $.extend(defaults, options);
		var i = o.items;
		var m = 0;
		var t = 1;
		var s = $(o.slides,obj).children().size();
		var w = $(o.slides,obj).children().outerWidth()+o.padding;
		var h = $(o.slides,obj).children().outerHeight()+o.padding;
		var c = Math.ceil($(o.slides,obj).children().size()/i);
		var pd = o.padding/2;
		var p = 0;
		var u = false;
		var n = 0;
		var pt = 0;
		var os = i*c-s;
		var params = {}; 
		
		if (o.vertical===true) { w = h; }
			
		if(o.showPagination){
			var buttons = s/i;
			$(obj).append('<ul class="pagination">');
			$(o.slides,obj).children().each(function(){
				if (n<buttons) {
					$(o.pagination,obj).append('<li><a rel="'+(n+1)+'" href="#" >'+(n+1)+'</a></li>');
					n = n+1;
				} else {
					n = 0;
					return false;
				}
				$(o.pagination+' li a:eq(0)',obj).parent().addClass('active');
			});
		}
		
		if (o.vertical===true) {
			$(o.container,obj).css({height:(w*i)});
			$(o.slides,obj).css({height:(s*w)});
		} else {
			$(o.container,obj).css({width:(w*i)});
			$(o.slides,obj).css({width:(s*w)});
		}
		
		$(o.slides,obj).children().each(function(){
			if (o.vertical===true) {
				$(this).css({position:'absolute',top:p+pd,display:'block'});
			} else {
				$(this).css({position:'absolute',left:p+pd,display:'block'});
			}
			p=p+w;
		});

		$(o.slides,obj).children().each(function(){
			pt = pt+1;
			if (pt<i+1) {
				params[o.vertical ? 'top' : 'left'] = (-w*pt)+pd-(w*os);
				$(o.slides,obj).children(':eq('+(s-pt)+')').css(params);
			}
			if (pt===i+2) {
				pt = 0;
				return false;
			}
		});
		
		$('.next',obj).click(function(){
			if(u===false) {
				animate('next',true);
				if(o.autoStart){clearInterval(sliderIntervalID);}
			}
			return false;
		});
		
		$('.previous',obj).click(function(){
			if(u===false) {	
				animate('prev',true);
				if(o.autoStart){clearInterval(sliderIntervalID);}
			} return false;
		});
		
		$(o.pagination+' li a',obj).click(function(){
			if ($(this).parent().hasClass('active')) {return false;}
			else {
				t = $(this).attr('rel');
				$(o.pagination+' li a',obj).parent().siblings().removeClass('active');
				$(this).parent().addClass('active');
				animate('fade',t);
				if(o.autoStart){clearInterval(sliderIntervalID);}
			} return false;
		});
		
		if (o.autoStart) {
			sliderIntervalID = setInterval(function(){
				if(u===false) {animate('next',true);}
			}, o.autoStart);
		}
		
		function current(t) {
			if(t===c+1){t=1;}
			if(t===0){t=c;}
			$(o.pagination+' li a',obj).parent().siblings().removeClass('active');
			$(o.pagination+' li a[rel="' + (t) + '"]',obj).parent().addClass('active');
		}
		
		function animate(dir,clicked){	
			u = true;	
			switch(dir){
				case 'next':
					t = t+1;
					m = (-(t*w-w)*i);
					current(t);		
					params[o.vertical ? 'top' : 'left'] = m;				
					$(o.slides,obj).animate(params, o.slidespeed,function(){
						if (t===c+1) {
							t = 1;
							params[o.vertical ? 'top' : 'left'] = 0;
							$(o.slides,obj).css(params,function(){
								$(o.slides,obj).animate(params);
							});						
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = (w*pt)+pd;
									$(o.slides,obj).children(':eq('+pt+')').css(params);
									params[o.vertical ? 'top' : 'left'] = -(w*(pt+os+1)-pd);
									$(o.slides,obj).children(':eq('+(s-(pt+1))+')').css(params);
								} else {
									pt = 0; 
									return false;
								}
								pt = pt+1;
							});	
						}
						if (t===c) {
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = w*(s+pt+os)+pd;
									$(o.slides,obj).children(':eq('+(pt)+')').css(params);
								} else {
									pt = 0;
									return false;
								}
								pt = pt+1;
							});
						}
						if (t===2) {
							$(o.slides,obj).children().each(function(){
								pt = pt+1;
								if (pt<i+1) {									
									params[o.vertical ? 'top' : 'left'] = ((w*s)+pd)-(w*pt);
									$(o.slides,obj).children(':eq('+(s-pt)+')').css(params);
								} else {
									pt = 0;
									return false;
								}
							});
						}
						u = false;
					});					
					break; 
				case 'prev':
					t = t-1;
					m = (-(t*w-w)*i);
					current(t);
					params[o.vertical ? 'top' : 'left'] = m;
					$(o.slides,obj).animate(params, o.slidespeed,function(){
						if (t===0) {
							t = c;
							params[o.vertical ? 'top' : 'left'] = -w*(s-i)-(w*os);
							$(o.slides,obj).css(params);
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = w*(s+pt+os)+pd;
									$(o.slides,obj).children(':eq('+pt+')').css(params);									
									params[o.vertical ? 'top' : 'left'] = (s*w)+pd-(pt*w)-w;
									$(o.slides,obj).children(':eq('+((s-1)-pt)+')').css(params);
								} else {
									pt = 0; 
									return false;
								}
								pt = pt+1;
							});
						}
						if (t===2) {
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = (w*pt)+pd;
									$(o.slides,obj).children(':eq('+pt+')').css(params);
								} else {
									pt = 0; 
									return false;
								}
								pt = pt+1;
							});
						}
						if (t===1) {
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = -(w*pt)-w+pd-(w*os);
									$(o.slides,obj).children(':eq('+((s-1)-pt)+')').css(params);
								} else {
									pt = 0; 
									return false;
								}
								pt = pt+1;
							});
						}

						u = false;
					});
					break;
				case 'fade':
					t = [t]*1;
					m = (-(t*w-w)*i);
					current(t);
					$(o.slides,obj).children().fadeOut(o.fadespeed, function(){
						params[o.vertical ? 'top' : 'left'] = m;
						$(o.slides,obj).css(params);
						$(o.slides,obj).children().each(function(){	
							if (pt<i) {
								params[o.vertical ? 'top' : 'left'] = (pt*w)+pd;
								$(o.slides,obj).children(':eq('+pt+')').css(params);
								params[o.vertical ? 'top' : 'left'] = w*(s-pt)-w+pd;
								$(o.slides,obj).children(':eq('+((s-1)-pt)+')').css(params);
							} else {
								pt = 0; 
								return false;
							}
							pt = pt+1;
						});
						
						if(t===c){						
							$(o.slides,obj).children().each(function(){	
								if (pt<i) {
									params[o.vertical ? 'top' : 'left'] = w*(s+pt+os)+pd;
									$(o.slides,obj).children(':eq('+(pt)+')').css(params);
								} else {
									pt = 0;
									return false;
								}
								pt = pt+1;
							});
						}
						if(t===1){
							$(o.slides,obj).children().each(function(){
								pt = pt+1;
								if (pt<i+1) {
									params[o.vertical ? 'top' : 'left'] = -(w*pt)+pd-(w*os);
									$(o.slides,obj).children(':eq('+(s-pt)+')').css(params);
								} else {
									pt = 0;
									return false;
								}
							});
						}
						$(o.slides,obj).children().fadeIn(o.fadespeed);
						u = false;
					});
					break; 
				default:
					break;
				}					
			}
		});
	};
})(jQuery);

/*
 * 	loopedSlider 0.5.6 - jQuery plugin
 *	written by Nathan Searles	
 *	http://nathansearles.com/loopedslider/
 *
 *	Copyright (c) 2009 Nathan Searles (http://nathansearles.com/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *	Compatible with jQuery 1.3.2+
 *
 */

/*
 *	markup example for $("#loopedSlider").loopedSlider();
 *
 *	<div id="loopedSlider">	
 *		<div class="container">
 *			<div class="slides">
 *				<div><img src="01.jpg" alt="" /></div>
 *				<div><img src="02.jpg" alt="" /></div>
 *				<div><img src="03.jpg" alt="" /></div>
 *				<div><img src="04.jpg" alt="" /></div>
 *			</div>
 *		</div>
 *		<a href="#" class="previous">previous</a>
 *		<a href="#" class="next">next</a>	
 *	</div>
 *
*/

$(function(){
	$("ul").removeClass("disabled");
	
});

if(typeof jQuery != 'undefined') {
	jQuery(function($) {
		$.fn.extend({
			loopedSlider: function(options) {
				var settings = $.extend({}, $.fn.loopedSlider.defaults, options);
			
				return this.each(
					function() {
					if($.fn.jquery < '1.3.2') {return;}
					var $t = $(this);
					var o = $.metadata ? $.extend({}, settings, $t.metadata()) : settings;
					
					var distance = 0;
					var times = 1;
					var slides = $(o.slides,$t).children().size();
					var width = $(o.slides,$t).children().outerWidth();
					var position = 0;
					var active = false;
					var number = 0;
					var interval = 0;
					var restart = 0;
					var pagination = $("."+o.pagination+" li a",$t);

					if(o.addPagination && !$(pagination).length){
						var buttons = slides;
						$($t).append("<ul class="+o.pagination+">");
						$(o.slides,$t).children().each(function(){
							if (number<buttons) {
								$("."+o.pagination,$t).append("<li><a rel="+(number+1)+" href=\"#\" >"+(number+1)+"</a></li>");
								number = number+1;
							} else {
								number = 0;
								return false;
							}
							$("."+o.pagination+" li a:eq(0)",$t).parent().addClass("active");
						});
						pagination = $("."+o.pagination+" li a",$t);
					} else {
						$(pagination,$t).each(function(){
							number=number+1;
							$(this).attr("rel",number);
							$(pagination.eq(0),$t).parent().addClass("active");
						});
					}

					if (slides===1) {
						$(o.slides,$t).children().css({position:"absolute",left:position,display:"block"});
						return;
					}

					$(o.slides,$t).css({width:(slides*width)});

					$(o.slides,$t).children().each(function(){
						$(this).css({position:"absolute",left:position,display:"block"});
						position=position+width;
					});

					$(o.slides,$t).children(":eq("+(slides-1)+")").css({position:"absolute",left:-width});

					if (slides>3) {
						$(o.slides,$t).children(":eq("+(slides-1)+")").css({position:"absolute",left:-width});
					}

					if(o.autoHeight){autoHeight(times);}

					$(".next",$t).click(function(){
						if(active===false) {
							animate("next",true);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					$(".previous",$t).click(function(){
						if(active===false) {	
							animate("prev",true);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					if (o.containerClick) {
						$(o.container,$t).click(function(){
							if(active===false) {
								animate("next",true);
								if(o.autoStart){
									if (o.restart) {autoStart();}
									else {clearInterval(sliderIntervalID);}
								}
							} return false;
						});
					}

					$(pagination,$t).click(function(){
						if ($(this).parent().hasClass("active")) {return false;}
						else {
							times = $(this).attr("rel");
							$(pagination,$t).parent().siblings().removeClass("active");
							$(this).parent().addClass("active");
							animate("fade",times);
							if(o.autoStart){
								if (o.restart) {autoStart();}
								else {clearInterval(sliderIntervalID);}
							}
						} return false;
					});

					if (o.autoStart) {
						sliderIntervalID = setInterval(function(){
							if(active===false) {animate("next",true);}
						},o.autoStart);
						function autoStart() {
							if (o.restart) {
							clearInterval(sliderIntervalID,interval);
							clearTimeout(restart);
								restart = setTimeout(function() {
									interval = setInterval(	function(){
										animate("next",true);
									},o.autoStart);
								},o.restart);
							} else {
								sliderIntervalID = setInterval(function(){
									if(active===false) {animate("next",true);}
								},o.autoStart);
							}
						};
					}

					function current(times) {
						if(times===slides+1){times = 1;}
						if(times===0){times = slides;}
						$(pagination,$t).parent().siblings().removeClass("active");
						$(pagination+"[rel='" + (times) + "']",$t).parent().addClass("active");
					};

					function autoHeight(times) {
						if(times===slides+1){times=1;}
						if(times===0){times=slides;}	
						var getHeight = $(o.slides,$t).children(":eq("+(times-1)+")",$t).outerHeight();
						$(o.container,$t).animate({height: getHeight},o.autoHeight);					
					};		

					function animate(dir,clicked){	
						active = true;	
						switch(dir){
							case "next":
								times = times+1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								if(slides<3){
									if (times===3){$(o.slides,$t).children(":eq(0)").css({left:(slides*width)});}
									if (times===2){$(o.slides,$t).children(":eq("+(slides-1)+")").css({position:"absolute",left:width});}
								}
								$(o.slides,$t).animate({left: distance}, o.slidespeed,function(){
									if (times===slides+1) {
										times = 1;
										$(o.slides,$t).css({left:0},function(){$(o.slides,$t).animate({left:distance})});							
										$(o.slides,$t).children(":eq(0)").css({left:0});
										$(o.slides,$t).children(":eq("+(slides-1)+")").css({ position:"absolute",left:-width});				
									}
									if (times===slides) $(o.slides,$t).children(":eq(0)").css({left:(slides*width)});
									if (times===slides-1) $(o.slides,$t).children(":eq("+(slides-1)+")").css({left:(slides*width-width)});
									active = false;
								});					
								break; 
							case "prev":
								times = times-1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								if (slides<3){
									if(times===0){$(o.slides,$t).children(":eq("+(slides-1)+")").css({position:"absolute",left:(-width)});}
									if(times===1){$(o.slides,$t).children(":eq(0)").css({position:"absolute",left:0});}
								}
								$(o.slides,$t).animate({left: distance}, o.slidespeed,function(){
									if (times===0) {
										times = slides;
										$(o.slides,$t).children(":eq("+(slides-1)+")").css({position:"absolute",left:(slides*width-width)});
										$(o.slides,$t).css({left: -(slides*width-width)});
										$(o.slides,$t).children(":eq(0)").css({left:(slides*width)});
									}
									if (times===2 ) $(o.slides,$t).children(":eq(0)").css({position:"absolute",left:0});
									if (times===1) $(o.slides,$t).children(":eq("+ (slides-1) +")").css({position:"absolute",left:-width});
									active = false;
								});
								break;
							case "fade":
								times = [times]*1;
								distance = (-(times*width-width));
								current(times);
								if(o.autoHeight){autoHeight(times);}
								$(o.slides,$t).children().fadeOut(o.fadespeed, function(){
									$(o.slides,$t).css({left: distance});
									$(o.slides,$t).children(":eq("+(slides-1)+")").css({left:slides*width-width});
									$(o.slides,$t).children(":eq(0)").css({left:0});
									if(times===slides){$(o.slides,$t).children(":eq(0)").css({left:(slides*width)});}
									if(times===1){$(o.slides,$t).children(":eq("+(slides-1)+")").css({ position:"absolute",left:-width});}
									$(o.slides,$t).children().fadeIn(o.fadespeed);
									active = false;
								});
								break; 
							default:
								break;
							}					
						};
					}
				);
			}
		});
		$.fn.loopedSlider.defaults = {
			container: ".container", //Class/id of main container. You can use "#container" for an id.
			slides: ".slides", //Class/id of slide container. You can use "#slides" for an id.
			pagination: "pagination", //Class name of parent ul for numbered links. Don't add a "." here.
			containerClick: false, //Click slider to goto next slide? true/false
			autoStart: 0, //Set to positive number for true. This number will be the time between transitions.
			restart: 0, //Set to positive number for true. Sets time until autoStart is restarted.
			slidespeed: 300, //Speed of slide animation, 1000 = 1second.
			fadespeed: 200, //Speed of fade animation, 1000 = 1second.
			autoHeight: 0, //Set to positive number for true. This number will be the speed of the animation.
			addPagination: false //Add pagination links based on content? true/false
		};
	});
}