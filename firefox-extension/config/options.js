function saveOptions(e) {
	browser.storage.sync.set({
		squeezifyOptions: {
			playerID: document.querySelector("#playerID").value,
			lmsHost: document.querySelector("#lmsHost").value,
			lmsPort: document.querySelector("#lmsPort").value
		}
	}).then(function() {
		document.querySelector("#submit").value = "Saved";
		setTimeout(() => {document.querySelector("#submit").value = "Save"}, 1000);
	});
	e.preventDefault();
}

function restoreOptions() {
  let squeezifyOptionsGet = browser.storage.sync.get('squeezifyOptions');
  squeezifyOptionsGet.then((res) => {
    document.querySelector("#playerID").value = res.squeezifyOptions.playerID;
    document.querySelector("#lmsHost").value = res.squeezifyOptions.lmsHost;
    document.querySelector("#lmsPort").value = res.squeezifyOptions.lmsPort;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
