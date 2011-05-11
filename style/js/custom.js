// CODA-SLIDER  //
		
 $().ready(function() {
       $('#coda-slider-1').codaSlider({
           dynamicArrows: false,
           dynamicTabs: false
    });
});

// FANCYBOX  //

$(document).ready(function() {
		$("a.group").fancybox({
		'speedIn'		:	600,
		'speedOut'		:	200,
		'titlePosition'  : 'over'
	});
});
		

// HIDE THE STUFF MADE FOR JS DISABLED USERS  //
		
$(document).ready(function() {
		$(".hide-on-js").hide();
	});


// BACKGROUND CHANGER  //

<!--
function MM_changeProp(objId,x,theProp,theValue) { //v9.0
  var obj = null; with (document){ if (getElementById)
  obj = getElementById(objId); }
  if (obj){
    if (theValue == true || theValue == false)
      eval("obj.style."+theProp+"="+theValue);
    else eval("obj.style."+theProp+"='"+theValue+"'");
  }
}
//-->


// RUN LOOPED SLIDER  //

$(function(){
		$('#loopedSlider').loopedSlider();
	});
	

// RUN LOOPED CAROUSEL  //

$(function(){
		$('#loopedCarousel').loopedCarousel({
			vertical: true
		});
	});
	