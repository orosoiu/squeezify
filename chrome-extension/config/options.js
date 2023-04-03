function saveOptions(e) {
	chrome.storage.sync.set({
		squeezifyOptions: {
			playerID: document.querySelector("#playerID").value,
			lmsHost: document.querySelector("#lmsHost").value,
			lmsPort: document.querySelector("#lmsPort").value
		}
	}, function() {
		document.querySelector("#submit").value = "Saved";
		setTimeout(() => {document.querySelector("#submit").value = "Save"}, 1000);
	});
	e.preventDefault();
}

function restoreOptions() {
	chrome.storage.sync.get(['squeezifyOptions'], function(res) {
		if(res.squeezifyOptions) {
			document.querySelector("#playerID").value = res.squeezifyOptions.playerID;
			document.querySelector("#lmsHost").value = res.squeezifyOptions.lmsHost;
			document.querySelector("#lmsPort").value = res.squeezifyOptions.lmsPort;
		}
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
