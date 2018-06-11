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
	var undo = []; //name, priority, position add/remove/both, oldspeaker


	//select participants for session
	fac.select = function(id){
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

	//increment speaker and total time
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

	//add name to queue 
	fac.queue = function(name, priority){
		if (priority == 1){
			queueOne.push(name);
			undo = [name, priority, queueOne.length-1, 'remove'];
		}
		else{
			queueTwo.push(name);
			undo = [name, priority, queueTwo.length-1, 'remove'];
		}

		printQueue();
	};

	//remove name from queue
	fac.removeQueue = function(name, priority){
		if (priority == 1){
			var index = queueOne.indexOf(name);
			queueOne.splice(index,1);
		}
		else{
			var index = queueTwo.indexOf(name);
			queueTwo.splice(index,1);
		}
		undo = [name, priority, index, 'add'];
		printQueue();
	};

	fac.nextSpeaker = function(){
		var img = document.getElementById("nextImg");

		oldSpeaker = img.src.split('/')
		oldSpeaker = oldSpeaker[oldSpeaker.length-1].split('.')[0];

		var name = queueTwo[0];
		queueTwo.splice(0,1);
		undo = [name, 2, 0, 'both', oldSpeaker, document.getElementById("speakerT").innerHTML];
		if (!name){
			name = queueOne[0];
			queueOne.splice(0,1);
			undo = [name, 1, 0, 'both', oldSpeaker, document.getElementById("speakerT").innerHTML];
			if (!name){
				name = "Jane Doe";
				undo = [];
			}
		}

		img.setAttribute("src","/static/images/"+name+".jpg");
		document.getElementById("nextName").innerHTML = name;
		document.getElementById("speakerT").innerHTML = ("00:00");

		printQueue();
	};

	fac.setSpeaker = function(name, priority){
		var img = document.getElementById("nextImg");

		oldSpeaker = img.src.split('/');
		oldSpeaker = oldSpeaker[oldSpeaker.length-1].split('.')[0];

		if (priority==1){
			var index = queueOne.indexOf(name);
			queueOne.splice(index,1);
			undo = [name, priority, index, 'both', oldSpeaker, document.getElementById("speakerT").innerHTML];
		}else{
			var index = queueTwo.indexOf(name);
			queueTwo.splice(index,1);
			undo = [name, priority, index, 'both', oldSpeaker, document.getElementById("speakerT").innerHTML];
		}

		img.setAttribute("src","/static/images/"+name+".jpg");
		document.getElementById("nextName").innerHTML = name;
		document.getElementById("speakerT").innerHTML = ("00:00");

		printQueue();
	};

	//resume queue from previous session
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

	fac.toggleView = function(mode){
		var j=0;
		var choice = ["pax-tile", "pax-tile-comp"];

		var ele = document.getElementsByClassName(choice[mode]);
		var s = ele.length;
		if (s==0){return;}
		for (var i =0; i<s; i++){
			if (ele[j].id=="next"){j+=1;continue;}
			ele[j].className = choice[1-mode];
		}
	};

	fac.search = function(){
		var name = document.getElementById("search").value;
		var res = document.querySelector('[id^="'+name+'"]');
		if (res){
			words = res.id.split(" ")
			for (i in words){
				console.log(words[i])
				if (name==words[i] || name==res.id){
					var searchAnchor = document.createElement('a');
			    	searchAnchor.setAttribute("href", "#"+res.id);
			    	searchAnchor.click();
			    	searchAnchor.remove();
	        		// fac.select(parseInt(res.parentElement.id));
				}
			}
		}
	};

	var a;
	fac.delayedSearch = function(){
		clearTimeout(a);
		a = setTimeout(fac.search,1000);
	};

	printQueue = function(){
		q='High Priority: '+queueTwo.length+' remaining';
		for (var i=0; i<queueTwo.length; i++){
			name = "'"+queueTwo[i]+"'";
			q+='<div class="col-xs-12"> <div id="next" class="pax-tile-small"> <img id="nextImg" width="40" height="40" src="/static/images/'+queueTwo[i]+'.jpg" alt="" onclick="$fac.setSpeaker('+name+',2);"> <span id="nextName" class="name" onclick="$fac.setSpeaker('+name+',2);">'+queueTwo[i]+'</span> <div onclick="$fac.removeQueue('+name+', 2);"><span class="glyphicon glyphicon-scissors"></span></div> </div> </div>';
		}
		q+='<div class="clearfix"></div> <hr> Low Priority: '+queueOne.length+' remaining';
		for (var i=0; i<queueOne.length; i++){
			name = "'"+queueOne[i]+"'";
			q+='<div class="col-xs-12"> <div id="next" class="pax-tile-small"> <img id="nextImg" width="40" height="40" src="/static/images/'+queueOne[i]+'.jpg" alt="" onclick="$fac.setSpeaker('+name+',1);"> <span id="nextName" class="name" onclick="$fac.setSpeaker('+name+',1);">'+queueOne[i]+'</span> <div onclick="$fac.removeQueue('+name+', 1);"><span class="glyphicon glyphicon-scissors"></span></div> </div> </div>';
		}
		document.getElementById("nextElement").innerHTML = q;

		var thingy = document.getElementById("sessionSaver");
		thingy.setAttribute("href","/sess/save/"+queueTwo+"|"+queueOne);
	};

	undoing = function(){
		var evtobj = window.event? event : e;
        if (evtobj.keyCode == 90 && evtobj.ctrlKey){
			if (undo[3]=="add"){
				if (undo[1] == 1){
					queueOne.splice(undo[2],0,undo[0]);
				}else{
					queueTwo.splice(undo[2],0,undo[0]);
				}
			}else if (undo[3]=="remove"){
				if (undo[1] == 1){
					queueOne.splice(undo[2],1);
				}else{
					queueTwo.splice(undo[2],1);
				}
			}else if(undo[3]=="both"){

				if (undo[1] == 1){
					queueOne.splice(undo[2],0,undo[0]);
				}else{
					queueTwo.splice(undo[2],0,undo[0]);
				}

				var img = document.getElementById("nextImg");
				img.setAttribute("src","/static/images/"+undo[4]+".jpg");
				document.getElementById("nextName").innerHTML = undo[4].replace("%20", " ");
				document.getElementById("speakerT").innerHTML = (undo[5]);
			}
			undo = [];
			printQueue();
		}
	};
	
	document.onkeydown = undoing;

	global.$fac = fac;
})(window);