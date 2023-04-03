# Squeezify - a Spotify to Logitech Media Server bridge

A series of scripts and extensions to enable direct integration between Spotify's web interface and Logitech Media Server (Squeezebox). The squeezify extensions add new buttons to the Spotify album and playlist pages to allow sending individual tracks or an entire album/playlist to LMS.

## Demo

https://user-images.githubusercontent.com/3442410/229207921-41fef87e-8d6f-44d8-b5b6-b6d0a1650b86.mp4


## Installation

### TamperMonkey extension

- install the TamperMonkey addon for Google Chrome or Mozilla Firefox from the respective official extension marketplace
- create a new script by clicking the TamperMonkey extension icon and choosing the "Create a new script..." option
- copy/paste the contents of the ![squeezify extension file](https://github.com/orosoiu/squeezify/blob/master/tampermonkey-script/spotify-lms-integration.js) into the script editor
- make sure to configure the LMS server hostname/IP and the player ID in the script preamble as shown below. You can find the LMS player ID in the LMS web interface by navigating to the LMS information page, Players section: the player ID is the same as the MAC Address
```
// @connect		192.168.1.100

// USER DEFINED VARIABLES
var playerID = "aa-bb-cc-dd-ee";
var lmsHost = "192.168.1.100";
var lmsPort = 9000;
// END USER DEFINED VARIABLES
```
- save the script

### Mozilla Firefox extension

If you do not wish to use the TamperMonkey addon, you can install Squeezify as a [standard Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/squeezify/). After installing you will need to configure it as shown in the video below:

https://user-images.githubusercontent.com/3442410/229485133-d19f9db8-c794-4c40-ade7-92a798119c97.mp4

### Google Chrome extension

Squeezify is currently pending publication in the official Google Chrome extension store.

## Roadmap

- Google Chrome extension
- LMS player auto-discovery


## Acknowledgements

 - [Toastr notification library](https://github.com/CodeSeven/toastr)


## Authors

- [@orosoiu](https://www.github.com/orosoiu)


## License

Squeezify is under [MIT license](https://opensource.org/license/mit/)

