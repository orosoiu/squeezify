// ==UserScript==
// @name		Spotify - Logitech Media Server integration
// @description	Add buttons to the Spotify web interface to allow sending albums, playlists or individual tracks to Logitech Media Server
// @version		1.0
// @author		Ovidiu Rosoiu
// @namespace	http://occam.ro/greasemonkey/spotify-lms-integration
// @match		https://open.spotify.com/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require		https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource	toastr_css https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @grant		GM.xmlHttpRequest
// @grant		GM_getResourceText
// @grant		GM_addStyle
// @connect		LMS-HOSTNAME-OR-IP
// @run-at		document-end
// ==/UserScript==

var toastrCSSSrc = GM_getResourceText("toastr_css");
GM_addStyle(toastrCSSSrc);
GM_addStyle(".toast { opacity: 1 !important; text-align: center; }");
GM_addStyle("#toast-container.toast-bottom-center>div { width: 40vw !important; }");

// USER DEFINED VARIABLES
var playerID = "LMS-PLAYER-ID";		// id of the player, usually the MAC Address as shown in Information - Players section
var lmsHost = "LMS-HOSTNAME-OR-IP";	// IP or hostname where LMS resides (e.g. 192.168.1.100); add this to @connect tag above as well (e.g. @connect 192.168.1.100)
var lmsPort = 9000;					// port for LMS web interface, default 9000
// END USER DEFINED VARIABLES

var sendToLMSIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"><style>.lmsIcon{fill:#C0C0C0;} .lmsIcon:hover{fill:#E7E7E7; cursor:pointer;}</style><path class="lmsIcon" d="M2 11v2c5 0 9 4 9 9h2c0-6.1-4.9-11-11-11m18-9H10c-1.1 0-2 .9-2 2v6.5c1 .5 1.9 1.2 2.7 1.9c.9-1.4 2.5-2.4 4.3-2.4c2.8 0 5 2.2 5 5s-2.2 5-5 5h-.2c.1.7.2 1.3.2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m0 10c-.2 0-.5 0-.7-.1c-.5-1.5-1.2-2.8-2.1-4c.4-1.1 1.5-2 2.8-2c1.7 0 3 1.3 3 3S16.7 18 15 18M2 15v2c2.8 0 5 2.2 5 5h2c0-3.9-3.1-7-7-7m0 4v3h3c0-1.7-1.3-3-3-3"></path></svg>';
var sendAllToLMSIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 24 24"><style>.lmsIcon{fill:#C0C0C0;} .lmsIcon:hover{fill:#E7E7E7; cursor:pointer;}</style><path class="lmsIcon" d="M2 11v2c5 0 9 4 9 9h2c0-6.1-4.9-11-11-11m18-9H10c-1.1 0-2 .9-2 2v6.5c1 .5 1.9 1.2 2.7 1.9c.9-1.4 2.5-2.4 4.3-2.4c2.8 0 5 2.2 5 5s-2.2 5-5 5h-.2c.1.7.2 1.3.2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m0 10c-.2 0-.5 0-.7-.1c-.5-1.5-1.2-2.8-2.1-4c.4-1.1 1.5-2 2.8-2c1.7 0 3 1.3 3 3S16.7 18 15 18M2 15v2c2.8 0 5 2.2 5 5h2c0-3.9-3.1-7-7-7m0 4v3h3c0-1.7-1.3-3-3-3"></path></svg>';
var lmsURI = "http://" + lmsHost + ":" + lmsPort + "/jsonrpc.js";

function toastNotification(message, status) {
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": true,
		"progressBar": false,
		"positionClass": "toast-bottom-center",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "3000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	toastr[status](message);
}

function sendToLMS(URI, title, notify) {
  GM.xmlHttpRequest({
    method: "POST",
    url: lmsURI,
    data: JSON.stringify({
      id: 1,
      method: "slim.request",
      params: [playerID,["playlist","add",URI]]
      }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    onload: function(response) {
		if (notify) {
			toastNotification("<strong>" + title + "</strong> was sent to LMS", "success");
		}
    },
	onerror: function(response) {
		if (notify) {
			toastNotification("LMS returned error status, please check server configuration", "error");
		}
	}
  });
}

function sendAllToLMS() {
	var trackLinks = document.querySelectorAll("a[href^='/track']");
	if (trackLinks) {
		for (var i = 0, l = trackLinks.length; i < l; i++) {
			var trackLink = trackLinks[i];
			// sometimes albums/playlist contain some hidden tracks which are not shown in the UI but are present in DOM
			// apparently these hidden tracks all have clientHeight and clientWidth properties set to 0, so use this to filter them
			if (trackLink.clientHeight > 0 && trackLink.clientWidth > 0) {
				sendToLMS(trackLink.href, trackLink.text, false);
			}
		}
		const albumPlaylistName = document.querySelector("h1").textContent;
		toastNotification("<strong>" + albumPlaylistName + "</strong> was sent to LMS", "success");
	}
}

function injectCastToLMSButton() {
	// spotify page change does not trigger @match check so we have to verify manually
	if (!(window.location.href.startsWith("https://open.spotify.com/playlist") || window.location.href.startsWith("https://open.spotify.com/album"))) {
		return;
	}
	var trackLinks = document.querySelectorAll("a[href^='/track']");
	if (trackLinks) {
		for (var i = 0, l = trackLinks.length; i < l; i++) {
			var trackLink = trackLinks[i];
			if (trackLink.parentElement.parentElement.lastChild.name != "sendToLMSIcon") {
				const trackUrl = trackLink.href;
				const trackName = trackLink.textContent;
				var sendToLMSIcon = document.createElement('div');
				sendToLMSIcon.name = "sendToLMSIcon";
				sendToLMSIcon.style.cursor = 'pointer';
				sendToLMSIcon.style.display = 'grid';
				sendToLMSIcon.innerHTML = sendToLMSIconSVG;
				sendToLMSIcon.title = "Send track to LMS";
				sendToLMSIcon.onclick = function() {
					sendToLMS(trackUrl, trackName, true);
				};
				trackLink.parentElement.parentElement.appendChild(sendToLMSIcon);
			}
		}
	}
}

function injectCastAllToLMSButton() {
	// spotify page change does not trigger @match check so we have to verify manually
	if (!(window.location.href.startsWith("https://open.spotify.com/playlist") || window.location.href.startsWith("https://open.spotify.com/album"))) {
		return;
	}
	var actionBar = document.querySelector("div[data-testid='action-bar-row']");
	if(actionBar && actionBar.childElementCount > 0 && !document.querySelector("div[name='sendAllToLMSIcon']")) {
		var sendAllToLMSIcon = document.createElement('div');
		sendAllToLMSIcon.name = "sendAllToLMSIcon";
		sendAllToLMSIcon.style.cursor = 'pointer';
		sendAllToLMSIcon.style.display = 'grid';
		sendAllToLMSIcon.innerHTML = sendAllToLMSIconSVG;
		sendAllToLMSIcon.title = "Send all tracks to LMS";
		sendAllToLMSIcon.onclick = function() {
			sendAllToLMS();
		};
		actionBar.insertBefore(sendAllToLMSIcon, actionBar.childNodes[actionBar.childElementCount - 1]);
	}
}

waitForKeyElements("a[href^='/track']", injectCastToLMSButton);
waitForKeyElements("div[data-testid='action-bar-row']", injectCastAllToLMSButton);