var torpedo = torpedo || {};
var Url = "";
var redirects = [".tk","1u.ro","1url.com","2pl.us","2tu.us","3.ly","a.gd","a.gg","a.nf","a2a.me","abe5.com","adjix.com","alturl.com","atu.ca","awe.sm","b23.ru","bacn.me","bit.ly","bkite.com","blippr.com","blippr.com","bloat.me","bt.io","budurl.com","buk.me","burnurl.com","c.shamekh.ws","cd4.me","chilp.it","chs.mx","clck.ru","cli.gs","clickthru.ca","cort.as","cuthut.com","cutt.us","cuturl.com","decenturl.com","df9.net","digs.by","doiop.com","dwarfurl.com","easyurl.net","eepurl.com","eezurl.com","ewerl.com","fa.by","fav.me","fb.me","ff.im","fff.to","fhurl.com","flic.kr","flq.us","fly2.ws","fuseurl.com","fwd4.me","getir.net","gl.am","go.9nl.com","go2.me","golmao.com","goo.gl","goshrink.com","gri.ms","gurl.es","hellotxt.com","hex.io","href.in","htxt.it","hugeurl.com","hurl.ws","icanhaz.com","icio.us","idek.net","is.gd","it2.in","ito.mx","j.mp","jijr.com","kissa.be","kl.am","korta.nu","l9k.net","liip.to","liltext.com","lin.cr","linkbee.com","littleurl.info","liurl.cn","ln-s.net","ln-s.ru","lnkurl.com","loopt.us","lru.jp","lt.tl","lurl.no","memurl.com","migre.me","minilien.com","miniurl.com","miniurls.org","minurl.fr","moourl.com","myurl.in","ncane.com","netnet.me","nn.nf","o-x.fr","ofl.me","omf.gd","ow.ly","oxyz.info","p8g.tw","parv.us","pic.gd","ping.fm","piurl.com","plurl.me","pnt.me","poll.fm","pop.ly","poprl.com","post.ly","posted.at","ptiturl.com","qurlyq.com","rb6.me","readthis.ca","redirects.ca","redirx.com","relyt.us","retwt.me","ri.ms","rickroll.it","rly.cc","rsmonkey.com","rubyurl.com","rurl.org","s3nt.com","s7y.us","saudim.ac","short.ie","short.to","shortna.me","shoturl.us","shrinkster.com","shrinkurl.us","shrtl.com","shw.me","simurl.net","simurl.org","simurl.us","sn.im","sn.vc","snipr.com","snipurl.com","snurl.com","soo.gd","sp2.ro","spedr.com","starturl.com","stickurl.com","sturly.com","su.pr","t.co","takemyfile.com","tcrn.ch","teq.mx","thrdl.es","tighturl.com","tiny.cc","tiny.pl","tinyarro.ws","tinytw.it","tinyurl.com","tl.gd","tnw.to","to.ly","togoto.us","tr.im","tr.my","trcb.me","tw0.us","tw1.us","tw2.us","tw5.us","tw6.us","tw8.us","tw9.us","twa.lk","twd.ly","twi.gy","twit.ac","twitthis.com","twiturl.de","twitzap.com","twtr.us","twurl.nl","u.mavrev.com","u.nu","ub0.cc","updating.me","ur1.ca","url.co.uk","url.ie","url.inc-x.eu","url4.eu","urlborg.com","urlbrief.com","urlcut.com","urlhawk.com","urlkiss.com","urlpire.com","urlvi.be","urlx.ie","uservoice.com","ustre.am","virl.com","vl.am","wa9.la","wapurl.co.uk","wipi.es","wkrg.com","wp.me","x.co","x.hypem.com","x.se","xav.cc","xeeurl.com","xr.com","xrl.in","xrl.us","xurl.jp","xzb.cc","yatuc.com","ye-s.com","yep.it","yfrog.com","zi.pe","zz.gd"];
var Application = Components.classes["@mozilla.org/steel/application;1"].getService(Components.interfaces.steelIApplication);

torpedo.functions = torpedo.functions || {};

torpedo.functions.manualRedirect = false;

torpedo.functions.calcWindowPosition = function (windowWidth, windowHeight) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    if (width < screen.width && height < screen.height) {
        width = screen.width;
        height = screen.height;
    }

    var left = ((width / 2) - (windowWidth / 2)) + dualScreenLeft;
    var top = ((height / 2) - (windowHeight / 2)) + dualScreenTop;

    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
}

torpedo.functions.findParentTagTarget = function (event, aTag) {
    var tempTarget = event.target || event.srcElement;

    if (tempTarget.nodeName == aTag) {
       return tempTarget;
    }
    var children = event.target.childNodes;
    for( var i = 0; i < children.length; i++){
        if(children[i].nodeName == aTag){
            return children[i];
        }
    }
    var parent = event.target.parentNode;
    for( var j = 0; j < 5; j++){
        if(parent.nodeName == aTag){
            return parent;
        }
        parent = parent.parentNode;
    }
    return undefined;
}

torpedo.functions.isURL = function (url) {
  url = url.replace(" ", "");
  var regex = new RegExp("/^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([\u00C0-\u017F0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[\u00C0-\u017Fa-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?/g");
  if (regex.test(url)) {
    // check if part after domain is too long, f.e. www.abc.abcd
    try{
      url = torpedo.functions.getDomainWithFFSuffix(url)
      var pos = url.lastIndexOf(".");
      url = url.substring(pos+1, url.length);
      if(url.length > 3){
        if(url[2].match(/^[A-Za-z]+$/) && url[3].match(/^[A-Za-z]+$/)) return false;
      }
    }
    catch(e){
    }
    return true;
  }
  // for problems with first pattern
  if (url.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,3})))(?::\d{2,5})?(?:\/[^\s]*)?$/i)) {
    return true;
  }
  return false;
};

torpedo.functions.getDomainWithFFSuffix = function (url) {
  var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].getService(Components.interfaces.nsIEffectiveTLDService);
  var isIP = String(url).match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g);
  if(isIP){
    start = url.indexOf("://")+3;
    url = url.substr(start, url.length);
    end = url.indexOf("/");
    var baseDomain = url.substr(0,end);
    return baseDomain;
  }
  try {
    var tempURI = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);
    var baseDomain = eTLDService.getBaseDomain(tempURI);
    if(baseDomain.indexOf("www.")==0) {
        var arr = baseDomain.split("www.");
        baseDomain = arr[1];
    }
    return baseDomain;
  }
  catch(err) {
    if (url.indexOf("://") > -1) {
        url = url.split('/')[2];
    }
    else {
        url = url.split('/')[0];
    }
    var regex_var = new RegExp(/[^.]*\.[^.]{2,3}(?:\.[^.]{2,3})?$/);
    var array = regex_var.exec(url);
    try{
        url = array[0];
        array = url.split(".");
        if(array[0] == "www" || array[0].indexOf("http") > -1){
            url = "";
            for(var i = 1; i < array.length-1; i++){
                url += array[i] + ".";
            }
            url += array[array.length-1];
        }
        return url;
    }
    catch(err){
        return url;
    }
  }
};

torpedo.functions.loop;
torpedo.functions.loopTimer = 2000;
resultUrl = "";

torpedo.functions.traceUrl = function (url, redirect) {
    // not opening new popup yet, first some initializaion
    torpedo.updateTooltip(url);
    unknown = true;
    resultUrl = url;
    // check if url is redirect and already in our list of saved entries
    var requestList = torpedo.prefs.getComplexValue("URLRequestList", Components.interfaces.nsISupportsString).data;
    if(redirect && requestList.includes(torpedo.functions.getDomainWithFFSuffix(url)+",")){
      unknown = false;
      var requestArray = requestList.split(",");
      var i = 0;
      var urlPos = 0;
      for(i=0; i<requestArray.length;i++){
        if(requestArray[i] == url){
          urlPos = i;
        }
      }
      var answerList = torpedo.prefs.getComplexValue("URLAnswerList", Components.interfaces.nsISupportsString).data;
      var answerArray = answerList.split(",");
      url = answerArray[urlPos];
      torpedo.updateTooltip(url);
    }
    // if redirect and not in our list, start redirect resolving
    if(redirect && unknown){
        torpedo.functions.containsRedirect(url);
    }
};

torpedo.functions.trace = function (url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function(){
      if(this.readyState == 4){
        torpedo.functions.containsRedirect(xhr.responseURL);
        torpedo.functions.saveRedirection(url, xhr.responseURL);
        resultUrl = xhr.responseURL;
      }
    };
    xhr.send(null);
};

torpedo.functions.containsRedirect = function(url){
    torpedo.functions.loop++;
    torpedo.handler.title = "";
    torpedo.handler.clickEnabled = false;
    var redirect = document.getElementById("redirect");
    redirect.textContent = torpedo.stringsBundle.getString('wait');
    document.getElementById("redirectButton").disabled = true;
    setTimeout(function(e){
        if(torpedo.functions.loop >= 5){
            $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
            torpedo.handler.Url = url;
            torpedo.updateTooltip(url);
        }
        else{
            if(torpedo.functions.loop >= 0){
                torpedo.functions.loopTimer = 0;
            }
            $("#clickbox").unbind("click", torpedo.handler.mouseClickHref);
            torpedo.functions.loop++;
            if(torpedo.functions.isRedirect(url)){
                redirect.textContent = torpedo.stringsBundle.getString('wait');
                torpedo.functions.trace(url);
            }
            else if(torpedo.functions.isGmxRedirect(url)){
              do{
      					url = torpedo.functions.resolveRedirect(url);
      					torpedo.gmxRedirect = true;
      				}while(torpedo.functions.isGmxRedirect(url));
              torpedo.functions.containsRedirect(url);
            }
            else{
                torpedo.handler.Url = url;
                torpedo.updateTooltip(resultUrl);
                torpedo.updateTooltip(url);
            }
        }
    }, torpedo.functions.loopTimer);
};

torpedo.functions.saveRedirection = function(url, response){
  // save redirection URL in user data
  var str1 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var str2 = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
  var preVal1 = torpedo.prefs.getComplexValue("URLRequestList", Components.interfaces.nsISupportsString).data;
  var preVal2 = torpedo.prefs.getComplexValue("URLAnswerList", Components.interfaces.nsISupportsString).data;
  var request = preVal1 + url + ",";
  var answer = preVal2 + response + ",";
  str1.data = request;
  str2.data = answer;
  if(!preVal1.includes(url + ",")){
    torpedo.prefs.setComplexValue("URLRequestList", Components.interfaces.nsISupportsString, str1);
    torpedo.prefs.setComplexValue("URLAnswerList", Components.interfaces.nsISupportsString, str2);
    var requestArray = request.split(",");

    // if list of saved redirections has more than 100 entries
    if(requestArray.length>100){
      var reqWithoutFirst = request.substr(request.indexOf(",")+1,request.length);
      var ansWithoutFirst = answer.substr(answer.indexOf(",")+1,answer.length);
      str1.data = reqWithoutFirst;
      str2.data = ansWithoutFirst;
      torpedo.prefs.setComplexValue("URLRequestList", Components.interfaces.nsISupportsString, str1);
      torpedo.prefs.setComplexValue("URLAnswerList", Components.interfaces.nsISupportsString, str2);
    }
  }
}

// Countdown functions

torpedo.functions.countdown = function (timee, id, url) {
    var startTime = timee;

    var setBaseDomain = document.getElementById("baseDomain");
    var noTimer = ((!torpedo.functions.isChecked("greenActivated") && torpedo.db.inList(torpedo.baseDomain, "URLDefaultList")) ||
            (!torpedo.functions.isChecked("orangeActivated") && torpedo.db.inList(torpedo.baseDomain, "URLSecondList")) ||
          (document.getElementById("redirect").textContent == torpedo.stringsBundle.getString('wait')));

    if (noTimer) {
        startTime = 0;
    }

    function showTime() {
        var second = startTime % 60;
        var panel = document.getElementById("tooltippanel");
        var content = document.getElementById("tooltipcontent");
        strZeit = (second < 10) ? ((second == 0)? second : "0" + second) : second;
        $("#" + id).html(strZeit);

        if (second == 0 && (document.getElementById("redirect").textContent != torpedo.stringsBundle.getString('wait'))) {
            // make URL in tooltip clickable
            $("#clickbox").unbind("click");
            $("#clickbox").bind("click", torpedo.handler.mouseClickHref);
            $(torpedo.handler.TempTarget).unbind("click");
            $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHref);
            $("#clickbox").css("cssText", "cursor:pointer !important");
        }
        else {
            document.getElementById("linkDeactivate").textContent = torpedo.stringsBundle.getString('deactivated');
            $("#clickbox").unbind("click");
            $("#clickbox").bind("click", torpedo.handler.mouseClickHrefError);
            $(torpedo.handler.TempTarget).unbind("click");
            $(torpedo.handler.TempTarget).bind("click", torpedo.handler.mouseClickHrefError);
            $("#clickbox").css("cssText", "cursor:wait !important;");
        }
    }

    showTime();
    if (startTime > 0) {
        --startTime;
    }

    var timerInterval = setInterval(function timer() {
        showTime();
        if (startTime == 0) {
            clearInterval(timerInterval);
        }
        else{
            --startTime;
        }

    }, 1000);

    return timerInterval;
}

torpedo.functions.setHref = function (url) {
    Url = url;
    torpedo.handler.resetCountDownTimer();
}
torpedo.functions.getHref = function () {
    return Url;
}

// text settings

var e = torpedo.prefs.getBoolPref("language");

torpedo.functions.changeLanguage = function(){
    e = !e;
    torpedo.prefs.setBoolPref("language", e);
    if(e) document.getElementById("changeLang").textContent = torpedo.stringsBundle.getString('longtext');
    else document.getElementById("changeLang").textContent = torpedo.stringsBundle.getString('shorttext');
}

torpedo.functions.changeTextsize = function(){
    var notsize;
    var editor = document.getElementById("editor");
    var panel = document.getElementById("changeSize")
    if(panel.textContent == torpedo.stringsBundle.getString('smalltext')){
  		panel.textContent = torpedo.stringsBundle.getString('bigtext');
      notsize = "big";
      torpedo.prefs.setIntPref("textsize", 100);
      torpedo.textSize = 100;
      if(editor!=null) editor.style.fontSize="100%";
    }
    else {
  		  document.getElementById("changeSize").textContent = torpedo.stringsBundle.getString('smalltext');
        notsize = "normal";
        torpedo.prefs.setIntPref("textsize", 115);
        torpedo.textSize = 115;
        if(editor!=null) editor.style.fontSize="115%";
    }
}

// list settings

var a = torpedo.prefs.getBoolPref("checkedGreenList");
var b = torpedo.prefs.getBoolPref("activatedGreenList");
var c = torpedo.prefs.getBoolPref("activatedOrangeList");
var d = torpedo.prefs.getBoolPref("checkedTimer");


torpedo.functions.isChecked = function (color){
    if(color == "green") return torpedo.prefs.getBoolPref("checkedGreenList");
    if(color == "greenActivated") return torpedo.prefs.getBoolPref("activatedGreenList");
    if(color == "orangeActivated") return torpedo.prefs.getBoolPref("activatedOrangeList");
};

torpedo.functions.changeChecked = function (){
    a = !a;
    torpedo.prefs.setBoolPref("checkedGreenlist", a);
};

torpedo.functions.changeActivatedGreen = function (click){
    b = !b;
    torpedo.prefs.setBoolPref("activatedGreenlist", b);
    if(click){
      document.getElementById("greenlistactivated").checked = b;
    }
};

torpedo.functions.changeActivatedOrange = function (click){
    c = !c;
    torpedo.prefs.setBoolPref("activatedOrangelist", c);
    if(click){
      document.getElementById("orangelistactivated").checked = c;
    }
};

// timer settings

torpedo.functions.changeCheckedTimer = function (){
    d = !d;
    torpedo.prefs.setBoolPref("checkedTimer", d);
    if(!d){
        torpedo.prefs.setIntPref("blockingTimer", 0);
        document.getElementById("countdown").disabled = true;
        document.getElementById("greenlistactivated").disabled = true;
        document.getElementById("activategreen").setAttribute("style","color:grey;width:330px; margin-top:10px");
        document.getElementById("orangelistactivated").disabled = true;
        document.getElementById("activateorange").setAttribute("style","color:grey;width:330px; margin-top:15px");
    }
    else{
        torpedo.prefs.setIntPref("blockingTimer", 3);
        document.getElementById("countdown").disabled = false;
        document.getElementById("greenlistactivated").disabled = false;
        document.getElementById("activategreen").removeAttribute("style");
        document.getElementById("activategreen").setAttribute("style","width:330px; margin-top:10px");
        document.getElementById("orangelistactivated").disabled = false;
        document.getElementById("activateorange").removeAttribute("style");
        document.getElementById("activateorange").setAttribute("style","width:330px; margin-top:15px");
    }
}

// redirection settings

torpedo.functions.redirect = function (id){
    torpedo.prefs.setBoolPref("redirection"+id, true);
    var id1 = (id+1)%3;
    var id2 = (id+2)%3;
    torpedo.prefs.setBoolPref("redirection"+id1, false);
    torpedo.prefs.setBoolPref("redirection"+id2, false);

    // prevent user from selecting no option at all in settings
    if(document.getElementById("redirect"+id).checked == false){
        document.getElementById("redirect"+id).checked = true;
    }
};

/*
* check if url
* contains "redirect" or contains domain from list of redirections
*/
torpedo.functions.isRedirect = function(url){
    for(var i = 0; i < redirects.length; i++){
        if(torpedo.functions.getDomainWithFFSuffix(url) == redirects[i]) {
            return true;
        }
    }
    return false;
};

torpedo.functions.resolveRedirect = function(url){
    var index = 0;
    var reUrl = url.indexOf("redirectUrl=");
    var re = url.indexOf("redirect=");
    if(reUrl > -1 ){
        index = reUrl+12;
    }
    else if(re > -1){
        var index = re+9;
    }
    var temp = url.slice(index, url.length);
    temp = decodeURIComponent(temp);
    if(torpedo.functions.isURL(temp)) url = temp;
    return url;
}
torpedo.functions.isGmxRedirect = function(url){
  var temp = torpedo.functions.resolveRedirect(url);
  return(temp != url);
}
