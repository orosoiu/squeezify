var sendToLMSIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="lmsIcon" width="16" height="16" aria-hidden="true" viewBox="0 0 24 24"><style>.lmsIcon{fill:#C0C0C0;} .lmsIcon:hover{fill:#E7E7E7;}</style><path d="M2 11v2c5 0 9 4 9 9h2c0-6.1-4.9-11-11-11m18-9H10c-1.1 0-2 .9-2 2v6.5c1 .5 1.9 1.2 2.7 1.9c.9-1.4 2.5-2.4 4.3-2.4c2.8 0 5 2.2 5 5s-2.2 5-5 5h-.2c.1.7.2 1.3.2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m0 10c-.2 0-.5 0-.7-.1c-.5-1.5-1.2-2.8-2.1-4c.4-1.1 1.5-2 2.8-2c1.7 0 3 1.3 3 3S16.7 18 15 18M2 15v2c2.8 0 5 2.2 5 5h2c0-3.9-3.1-7-7-7m0 4v3h3c0-1.7-1.3-3-3-3"></path></svg>';
var sendAllToLMSIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="lmsIcon" width="32" height="32" viewBox="0 0 24 24"><style>.lmsIcon{fill:#C0C0C0;} .lmsIcon:hover{fill:#E7E7E7;}</style><path d="M2 11v2c5 0 9 4 9 9h2c0-6.1-4.9-11-11-11m18-9H10c-1.1 0-2 .9-2 2v6.5c1 .5 1.9 1.2 2.7 1.9c.9-1.4 2.5-2.4 4.3-2.4c2.8 0 5 2.2 5 5s-2.2 5-5 5h-.2c.1.7.2 1.3.2 2h5c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m0 10c-.2 0-.5 0-.7-.1c-.5-1.5-1.2-2.8-2.1-4c.4-1.1 1.5-2 2.8-2c1.7 0 3 1.3 3 3S16.7 18 15 18M2 15v2c2.8 0 5 2.2 5 5h2c0-3.9-3.1-7-7-7m0 4v3h3c0-1.7-1.3-3-3-3"></path></svg>';
var callFailedErrMsg = "LMS call failed with error <strong>%err%</strong>, please check server configuration in the addon configuration page and make sure to enable the <strong>Insecure content</strong> option in the <strong>Site settings</strong> page. See <a href='https://github.com/orosoiu/squeezify#google-chrome-extension' target='#blank'>the official documentation</a> for more details.";

var lmsURI;
chrome.storage.sync.get(['squeezifyOptions'], function(result) {
	playerID = result.squeezifyOptions.playerID;
	lmsHost = result.squeezifyOptions.lmsHost;
	lmsPort = result.squeezifyOptions.lmsPort;
	if(!playerID || !lmsHost || !lmsPort) {
		throw new Error("Missing configuration data, please check extension configuration page");
	}
	lmsURI = "http://" + lmsHost + ":" + lmsPort + "/jsonrpc.js";
	waitForKeyElements("a[href^='/track']", injectCastToLMSButton);
	waitForKeyElements("div[data-testid='action-bar-row']", injectCastAllToLMSButton);
});

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
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	toastr[status](message);
}

async function sendToLMS(trackUrl) {
	return fetch(lmsURI, {
		method: "POST",
		mode: "no-cors",
		body: JSON.stringify({
			id: 1,
			method: "slim.request",
			params: [playerID,["playlist","add",trackUrl]]
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});
}

async function sendAllToLMS() {
	var trackLinks = document.querySelectorAll("div[role='presentation']>div[role='row']>div[role='presentation']>div[role='gridcell']>div>a[href^='/track']");
	if (trackLinks) {
		for (var i = 0, l = trackLinks.length; i < l; i++) {
			var trackLink = trackLinks[i];
			// sometimes albums/playlist contain some hidden tracks which are not shown in the UI but are present in DOM
			// apparently these hidden tracks all have clientHeight and clientWidth properties set to 0, so use this to filter them
			if (trackLink.clientHeight > 0 && trackLink.clientWidth > 0) {
				try {
					const response = await sendToLMS(trackLink.href);
				} catch (error) {
					toastNotification(callFailedErrMsg.replace("%err%", error.message), "error");
					return;
				}
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
	var trackLinks = document.querySelectorAll("div[role='presentation']>div[role='row']>div[role='presentation']>div[role='gridcell']>div>a[href^='/track']");
	if (trackLinks) {
		for (var i = 0, l = trackLinks.length; i < l; i++) {
			var trackLink = trackLinks[i];
			var lastColumn = trackLink.parentElement.parentElement.parentElement.lastChild;
			if (lastColumn.firstChild.name != "sendToLMSIcon") {
				const trackUrl = trackLink.href;
				const trackName = trackLink.textContent;
				var sendToLMSIcon = document.createElement('button');
				sendToLMSIcon.type = "button";
				sendToLMSIcon.name = "sendToLMSIcon";
				sendToLMSIcon.style.cursor = 'pointer';
				sendToLMSIcon.innerHTML = sendToLMSIconSVG;
				sendToLMSIcon.setAttribute("title", "Send track to LMS");
				sendToLMSIcon.setAttribute("class", lastColumn.lastChild.getAttribute("class"));
				$(sendToLMSIcon).click(async function() {
					$(this).prop("disabled", true);
					$(this).css('cursor', 'wait');
					try {
						const response = await sendToLMS(trackUrl);
						if (response.type === "opaque" || response.ok) {
							toastNotification("<strong>" + trackName + "</strong> was sent to LMS", "success");
						} else {
							toastNotification("LMS call failed, please check server configuration in the addon configuration page", "error");
						}
					} catch (error) {
						toastNotification(callFailedErrMsg.replace("%err%", error.message), "error");
					}
					$(this).prop("disabled",false);
					$(this).css('cursor', 'pointer');
				});
				lastColumn.prepend(sendToLMSIcon);
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
		var sendAllToLMSIcon = document.createElement('button');
		sendAllToLMSIcon.type = "button";
		sendAllToLMSIcon.name = "sendAllToLMSIcon";
		sendAllToLMSIcon.style.cursor = 'pointer';
		sendAllToLMSIcon.innerHTML = sendAllToLMSIconSVG;
		sendAllToLMSIcon.setAttribute("class", actionBar.lastChild.getAttribute("class"));
		sendAllToLMSIcon.title = "Send all tracks to LMS";
		$(sendAllToLMSIcon).click(async function() {
			$(this).prop("disabled", true);
			$(this).css('cursor', 'wait');
			try {
				await sendAllToLMS();
			} catch (error) {}
			$(this).prop("disabled",false);
			$(this).css('cursor', 'pointer');
		});
		actionBar.insertBefore(sendAllToLMSIcon, actionBar.childNodes[actionBar.childElementCount - 1]);
	}
}