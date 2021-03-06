var torpedo = torpedo || {};
var clickTimer = null, countDownTimer = null;
var alreadyClicked = "";
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.handler = torpedo.handler || {};
torpedo.handler.Url;

torpedo.handler.TempTarget;
torpedo.handler.MouseLeavetimer;
torpedo.handler.timeOut;
mouseon = false;
mouseout = [false, false];

torpedo.handler.mouseOverTooltipPane = function (event){
	mouseon = true;
	mouseout[0] = true;
	clearTimeout(torpedo.handler.MouseLeavetimer);
	var panel = document.getElementById("tooltippanel");
	$(panel).contextmenu(function(){
		var menuwindow = document.getElementById("menuwindow");
		var urlbox = document.getElementById("url-box");
		if(torpedo.db.inList(torpedo.baseDomain, "URLDefaultList") || torpedo.db.inList(torpedo.baseDomain, "URLSecondList")) document.getElementById("addtotrusted").disabled = true;
		else  document.getElementById("addtotrusted").disabled = false;
	  menuwindow.openPopup(urlbox, "after_start",0,0, false, false);
	});
};

torpedo.handler.mouseDownTooltipPane = function (event)
{
	var menuwindow = document.getElementById("menuwindow");
	var moreinfos = document.getElementById("moreinfos");
	if(!torpedo.redirectClicked && menuwindow.state != "open" && moreinfos.textContent == "" && !torpedo.redirectClicked){
		mouseon = false;
		torpedo.handler.timeOut = 1500;
		if(torpedo.functions.loop >= 0){
			torpedo.handler.timeOut = 3000;
		}
		torpedo.handler.MouseLeavetimer = setTimeout(function (e)
		{
			if(!mouseon) {
				document.getElementById("tooltippanel").hidePopup();
				torpedo.handler.TempTarget = undefined;
				if(countDownTimer != null)
				{
					clearInterval(countDownTimer);
					countDownTimer = null;
				}

				if(clickTimer != null)
				{
					clearTimeout(clickTimer);
				}
			}
		}, torpedo.handler.timeOut);
	}
};

torpedo.handler.title = "";
torpedo.handler.mouseOverHref = function (event)
{
	var moreinfos = document.getElementById("moreinfos");
	var panel = document.getElementById("tooltippanel");
	// do nothing when user reads infotext or deduces target url
	if((!torpedo.redirectClicked || panel.state == "closed") && (panel.state == "closed" || torpedo.info == "" || moreinfos.textContent == "")){
		torpedo.redirectClicked = false;
		mouseout = mouseout[0] ? [false,true] : [false,false];
		tempTarget = torpedo.functions.findParentTagTarget(event, 'A');
		var url = tempTarget.getAttribute("href");
		// make sure that popup opens up even if popup from another URL is opened
		if(url != "" && torpedo.oldUrl != url) panel.hidePopup();
		if(panel.state == "closed"){
			if(url != "" && url != null && url != undefined ){
				// Initializaion of tooltip
				torpedo.handler.TempTarget = tempTarget;
				torpedo.handler.title = torpedo.handler.TempTarget.textContent.replace(" ","");
				torpedo.handler.clickEnabled = true;
				torpedo.functions.loop = -1;
				torpedo.state = 0;
				torpedo.functions.loopTimer = 2000;
				torpedo.baseDomain = torpedo.functions.getDomainWithFFSuffix(url);
				torpedo.handler.Url = url;
			  torpedo.oldUrl = torpedo.baseDomain;
				panel.style.backgroundColor = "white";
				clearTimeout(torpedo.handler.MouseLeavetimer);
				alreadyClicked = "";
				var redirect = false;
				moreinfos.textContent = "";
				torpedo.info = "";
				document.getElementById("infocheck").hidden = true;

				// check if url is a "redirectUrl=" url (gmxredirect)
				torpedo.gmxRedirect = false;
				while(torpedo.functions.isGmxRedirect(url)){
					url = torpedo.functions.resolveRedirect(url);
					torpedo.gmxRedirect = true;
				}

				// check if url is a normal redirect (tinyurl)
				if(torpedo.functions.isRedirect(url) && torpedo.prefs.getBoolPref("redirection2")){
					redirect = true;
				}
				// start with the opening process
			  torpedo.functions.traceUrl(url, redirect);
			}
		}
	}
};

torpedo.handler.resetCountDownTimer = function (){
	if(countDownTimer != null){
		clearInterval(countDownTimer);
		countDownTimer = null;
	}
	if(clickTimer != null){
		clearTimeout(clickTimer);
	}
	if(countDownTimer == null){
		if(torpedo.state!=6)
			countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer"),'countdown', Url);
		else countDownTimer = torpedo.functions.countdown(torpedo.prefs.getIntPref("blockingTimer")+2,'countdown', Url);
		clickTimer = setTimeout(function(){
			if(clickTimer != null){
				clearTimeout(clickTimer);
			}
		}, torpedo.prefs.getIntPref("blockingTimer")*1000);
	}
};

torpedo.handler.mouseDownHref = function (event)
{
	torpedo.handler.MouseLeavetimer = setTimeout(function (e)
	{
		if(mouseout[1]) torpedo.handler.mouseDownTooltipPane(event);
		else if(!mouseon){
			document.getElementById("tooltippanel").hidePopup();
			torpedo.handler.TempTarget = undefined;
			if(countDownTimer != null)
			{
				clearInterval(countDownTimer);
				countDownTimer = null;
			}

			if(clickTimer != null)
			{
				clearTimeout(clickTimer);
			}
		}
	}, 100);
};

torpedo.handler.mouseClickHref = function (event)
{
	//only do sth if left mouse button is clicked
	if(event.button == 0){
		var url = torpedo.functions.getHref();
		if(alreadyClicked == ""){
			alreadyClicked = url;
		 	if(!torpedo.functions.isRedirect(url)) torpedo.db.pushUrl(torpedo.baseDomain);
		 	torpedo.handler.open(url);
		}
		return false;
	}
};

torpedo.handler.open = function(url){
	var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var uriToOpen = ioservice.newURI(url, null, null);
	var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
	extps.loadURI(uriToOpen, null);
}
torpedo.handler.mouseClickHrefError = function(event){
	if(event.button ==0){
		var panel = document.getElementById("errorpanel");
		panel.openPopup(torpedo.handler.TempTarget, "before_start",0,0, false, false);
		setTimeout(function (e)
		{
			panel.hidePopup();
		}, 2500);
		return false;
	}
};

torpedo.handler.mouseClickInfoButton = function (event)
{
	var moreinfos = document.getElementById("moreinfos");
	var panel = document.getElementById("tooltippanel");
	var warningpic = document.getElementById("warning-pic");
	var phish = document.getElementById("phish");
	if(torpedo.db.unknown(torpedo.baseDomain) && !torpedo.functions.isRedirect(torpedo.oldUrl) && !torpedo.gmxRedirect){
		if(warningpic.hidden){
			torpedo.dialogmanager.createUnknownInfo();
		}
		document.getElementById("infocheck").hidden = false;
		moreinfos.textContent = torpedo.info;
	}
	else{
		if(moreinfos.textContent != ""){
			moreinfos.textContent = "";
		}
		else moreinfos.textContent = torpedo.info;
	}
	if(torpedo.functions.isRedirect(torpedo.oldUrl) || torpedo.gmxRedirect || torpedo.state == 5 || torpedo.state == 6 || torpedo.state == 4) document.getElementById("infocheck").hidden = false;
};

torpedo.handler.mouseClickDeleteButton = function(event){
	torpedo.dialogmanager.createDelete();
};
torpedo.handler.mouseClickDefaultsEditButton = function(event){
	torpedo.dialogmanager.createEditDefaults();
}
torpedo.handler.mouseClickEditButton = function(event){
	torpedo.dialogmanager.createEdit();
};
torpedo.handler.mouseClickDefaultsButton = function (event) {
	torpedo.dialogmanager.showDefaults();
};

torpedo.handler.clickEnabled = true;
torpedo.handler.mouseClickRedirectButton = function (event){
	torpedo.redirectClicked = true;
	event.stopPropagation();
	if(torpedo.handler.clickEnabled) torpedo.functions.traceUrl(torpedo.handler.Url, true);
};

torpedo.handler.mouseClickRedirectShow = function (event) {
	torpedo.dialogmanager.showRedirects();
};
torpedo.handler.mouseClickAddButton = function(event){
	torpedo.dialogmanager.showAdd();
}
torpedo.handler.loadOptions = function (){
	torpedo.stringsBundle = document.getElementById("torpedo-string-bundle");
	document.getElementById('countdown').disabled = !torpedo.prefs.getBoolPref('checkedTimer');
  document.getElementById('listofdefaults').textContent = torpedo.stringsBundle.getString('listofdefaults');
  document.getElementById('activategreen').textContent = torpedo.stringsBundle.getString('activategreen');
  document.getElementById('activateorange').textContent = torpedo.stringsBundle.getString('activateorange');
  var element = document.getElementById("editor");
  element.style.fontSize=""+torpedo.prefs.getIntPref("textsize")+"%";
}

torpedo.handler.tutorial = function(){
	torpedo.dialogmanager.welcome1();
}
