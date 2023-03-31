# Squeezify - a Spotify to Logitech Media Server integration

A series of scripts and extensions to enable direct integration between Spotify's web interface and Logitech Media Server (Squeezebox). The squeezify extension adds new buttons to the Spotify album and playlist pages to allow sending individual tracks or an entire album/playlist to LMS.

## Demo

![Demo](https://github.com/orosoiu/squeezify/blob/master/resources/demo.webm?raw=true)


## Installation

### TamperMonkey extension

- install the TamperMonkey addon for Google Chrome or Mozilla Firefox from the respective official extension marketplace
- add a new script and copy/paste the contents of the ![squeezify extension file](https://github.com/orosoiu/squeezify/blob/master/tampermonkey-script/spotify-lms-integration.js)
- make sure to configure the LMS server hostname/IP and the player ID in the script preamble

```
// @connect		192.168.1.100

// USER DEFINED VARIABLES
var playerID = "aa-bb-cc-dd-ee";
var lmsHost = "192.168.1.100";
var lmsPort = 9000;
// END USER DEFINED VARIABLES
```

To find out the player ID, navigate to the LMS information page, Players section; the player ID is the same as the MAC Address


## Roadmap

- Google Chrome and Mozilla Firefox extensions
- LMS player auto-discovery


## Acknowledgements

 - [Toastr notification library](https://github.com/CodeSeven/toastr)


## Authors

- [@orosoiu](https://www.github.com/orosoiu)


## License

Squeezify is under [MIT license](https://opensource.org/license/mit/)

