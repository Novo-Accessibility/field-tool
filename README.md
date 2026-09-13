# Senior Home Safety — Assessment Tool

The field assessment tool used during Senior Home Safety home visits, packaged
to run from a web address and to keep working with no signal.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The assessment tool. Everything is in this one file — fonts included — so it has no outside dependencies. |
| `sw.js` | Offline cache. Stores the tool on the device at first load and refreshes it quietly in the background. |
| `manifest.webmanifest` | Home screen settings: name, colours, icon. |
| `icon-*.png` | Home screen icons. |

## Publishing

Push to a repository, then turn on Pages for the `main` branch, root folder.
The tool is then live at the Pages address.

After changing `index.html`, bump `CACHE_VERSION` at the top of `sw.js`.
Devices pick up the new version on the launch after next — once to fetch it,
once to run it.

## Two rules for the field

**Open it from the home screen icon, never from Safari.** iOS gives a home
screen web app its own separate storage. Mixing the two means two different
sets of assessments.

**Export after every visit.** Browser storage is working space, not a backup.
The Export button writes one file holding the intake, every score, every
measurement and every photograph. That file belongs in the client folder
before leaving the property.

## On privacy

No client data reaches this server. Assessments live in the browser's own
storage on the device that recorded them. The server holds the blank tool and
nothing else.
