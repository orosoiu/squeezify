# Squeezify - a Spotify to Logitech Media Server bridge

A series of scripts and extensions to enable direct integration between Spotify's web interface and Logitech Media Server (Squeezebox). The squeezify extensions add new buttons to the Spotify album and playlist pages to allow sending individual tracks or an entire album/playlist to LMS.

## Demo

https://user-images.githubusercontent.com/3442410/229207921-41fef87e-8d6f-44d8-b5b6-b6d0a1650b86.mp4


## Installation

### TamperMonkey extension

- install the TamperMonkey addon for Google Chrome or Mozilla Firefox from the respective official extension marketplace
- create a new script by clicking the TamperMonkey extension icon and choosing the *Create a new script...* option
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

The are currently no plans to publish Squeezify in the official Google Chrome extension store. If you wish to install the extension manually you can do so by following these easy steps:

- download the squeezify repo or just the *chrome-extension* folder somewhere on your computer; you can download the entire repo by clicking the big green *Code* button above then choosing *Download ZIP* option (you will need to unzip the file after downloading)
- in Google Chrome, go to extensions configuration page by clicking the three dots in the upper right corner and choosing *Settings*, then *Extensions* menu entry
- in the newly opened tab, click *Load unpacked*, navigate to and select the *chrome-extension* folder downloaded in the first step then press *Select Folder*
- the entension is now installed; you can configure it as shown in the video above
- optionally, if you are getting *Failed to fetch* errors after configuring, you need to allow insecure calls from the Spotify page to the LMS server <sup>*</sup> by clicking the padlock icon next to the Spotify URL, then *Site Settings* then scroll down to the *Insecure content* option and change it to *Allow*

<sup>*</sup> This is needed because LMS is HTTP only (as per original developers this is by design and not subject to change). Calls from a secure origin (Spotify) to an insecure one (LMS) are considered a security concern and blocked by modern browsers. Since I don't have access to the Spotify servers in order to fix this at the source, the only workaround is to manually enable insecure calls for Spotify in you browser. Read more about Mixed Content [here](https://www.howtogeek.com/443032/what-is-mixed-content-and-why-is-chrome-blocking-it/).

## Roadmap

- LMS player auto-discovery


## Acknowledgements

 - [Toastr notification library](https://github.com/CodeSeven/toastr)


## Authors

- [@orosoiu](https://www.github.com/orosoiu)


## License

Squeezify is under [MIT license](https://opensource.org/license/mit/)

