$(function () {

	$("#navbarToggle").blur(function(event){
		var screenWidth = window.innerWidth;
		if (screenWidth < 768){
			$("collapsable-nav").collapse('hide');
		}
	});
});

(function (global){
	var fac = {};
	var queueOne = [];
	var queueTwo = [];
	var list = [];

	fac.select = function(id){
		console.log(id);
		ogClasses = document.getElementById(id.toString()).className;
		classes = ogClasses.split(" ");
		if (classes[1] == "selected"){
			var index = list.indexOf(id);
			if (index==-1){
				list.push(-id);
			}else{
			list.splice(index,1);
			}
		    ogClasses = ogClasses.replace(new RegExp(" selected", "g"), "");
		} else {
		    ogClasses += " selected";
			list.push(id);
		}
	    document.getElementById(id.toString()).className = ogClasses;

		var thingy = document.getElementById("sessionMaker");
		thingy.setAttribute("href","sess/"+list);
	};

	fac.times = function(){
		speaker = document.getElementById("speakerT").innerHTML.split(":");
		speaker[0] = parseInt(speaker[0]);
		speaker[1] = parseInt(speaker[1]);

		total = document.getElementById("totalT").innerHTML.split(":");
		total[0] = parseInt(total[0]);
		total[1] = parseInt(total[1]);
		total[2] = parseInt(total[2]);

		total[2]++;
		total[1]+=parseInt(total[2]/60);
		total[2]=total[2]%60;
		total[0]+=parseInt(total[1]/60);
		total[1]=total[1]%60;


		speaker[1]++;
		speaker[0]+=parseInt(speaker[1]/60);
		speaker[1]=speaker[1]%60;

		document.getElementById("speakerT").innerHTML = ("0"+speaker[0]).slice(-2)+":"+("0"+speaker[1]).slice(-2);
		document.getElementById("totalT").innerHTML = ("0"+total[0]).slice(-2)+":"+("0"+total[1]).slice(-2)+":"+("0"+total[2]).slice(-2);
	};

	fac.queue = function(name, priority){
		if (priority == 1){
			queueOne.push(name);
		}
		else{
			queueTwo.push(name);
		}

		printQueue();
	};

	fac.removeQueue = function(name, priority){
		if (priority == 1){
			var index = queueOne.indexOf(name);
			queueOne.splice(index,1);
		}
		else{
			var index = queueTwo.indexOf(name);
			queueTwo.splice(index,1);
		}

		printQueue();
	};

	fac.nextSpeaker = function(){
		var name = queueTwo[0];
		queueTwo.splice(0,1);
		if (!name){
			name = queueOne[0];
			queueOne.splice(0,1);
			if (!name){
				name = "Jane Doe";
			}
		}

		var img = document.getElementById("nextImg");
		img.setAttribute("src","/static/images/"+name+".jpg");
		document.getElementById("nextName").innerHTML = name;
		document.getElementById("speakerT").innerHTML = ("00:00");

		printQueue();
	};

	fac.queueRes = function(ones, twos){
		document.getElementById("tempTitle").innerHTML = "Queue";

		for(var i=0; i<ones.length; i++){
			if (ones[i]==''){continue;}
			$fac.queue(ones[i],1);
		}
		for(var i=0; i<twos.length; i++){
			if (twos[i]==''){continue;}
			$fac.queue(twos[i],2);
		}

	};

	fac.search = function(){
		var name = document.getElementById("search").value;
		var res = document.getElementById(name)
		if (res){
			var searchAnchor = document.createElement('a');
		    searchAnchor.setAttribute("href", "#"+name);
		    searchAnchor.click();
		    searchAnchor.remove();
    		fac.select(parseInt(res.parentElement.id));
		}
	}
	var a;
	fac.delayedSearch = function(){
		clearTimeout(a);
		a = setTimeout(fac.search,1000);
	}

	printQueue = function(){
		q='';
		for (var i=0; i<queueTwo.length; i++){
			name = "'"+queueTwo[i]+"'";
			q+='<div class="col-xs-12"> <div id="next" class="pax-tile-small"> <img id="nextImg" width="40" height="40" src="/static/images/'+queueTwo[i]+'.jpg" alt="Next to talk"> <span id="nextName" class="name">'+queueTwo[i]+'</span> <div onclick="$fac.removeQueue('+name+', 2);"><span class="glyphicon glyphicon-scissors"></span></div> </div> </div>';
		}
		q+='<div class="clearfix"></div> <hr>';
		for (var i=0; i<queueOne.length; i++){
			name = "'"+queueOne[i]+"'";
			q+='<div class="col-xs-12"> <div id="next" class="pax-tile-small"> <img id="nextImg" width="40" height="40" src="/static/images/'+queueOne[i]+'.jpg" alt="Next to talk"> <span id="nextName" class="name">'+queueOne[i]+'</span> <div onclick="$fac.removeQueue('+name+', 1);"><span class="glyphicon glyphicon-scissors"></span></div> </div> </div>';
		}
		document.getElementById("nextElement").innerHTML = q;

		var thingy = document.getElementById("sessionSaver");
		thingy.setAttribute("href","/sess/save/"+queueTwo+"|"+queueOne);
	};

	global.$fac = fac;
})(window);