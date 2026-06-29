# Download metadata

The landing page shows the current Android build from Cloudflare R2 metadata.

## Public URLs

```txt
https://downloads.flextapper.com/latest/FlexTapper.apk
https://downloads.flextapper.com/latest/metadata.json
```

Firebase Hosting uses these branded paths:

```txt
https://flextapper.com/download
https://flextapper.com/downloads/FlexTapper.apk
https://flextapper.com/api/releases/android/latest.json
```

`/download` is the human-facing page. `/downloads/FlexTapper.apk` redirects to the latest APK. `/api/releases/android/latest.json` redirects to the latest metadata JSON.

The old public metadata URL redirects to the download page:

```txt
https://flextapper.com/downloads/metadata.json -> https://flextapper.com/download
```

## Cloudflare Access

The metadata request must be public to browser `fetch()` calls. If Cloudflare Zero Trust / Access protects `downloads.flextapper.com`, add a Bypass policy for the public download objects or remove Access protection from that hostname.

Public paths needed by the site:

```txt
https://downloads.flextapper.com/latest/metadata.json
https://downloads.flextapper.com/latest/FlexTapper.apk
```

Cloudflare's Access docs describe Bypass policies for public endpoints: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/common-policies/

## Metadata shape

`main.js` expects this JSON:

```json
{
  "appName": "FlexTapper",
  "platform": "android",
  "packageName": "com.bytes.tapper",
  "versionName": "0.1.12",
  "versionCode": 12,
  "updatedAt": "2026-06-28T20:15:00Z",
  "apkUrl": "https://downloads.flextapper.com/latest/FlexTapper.apk",
  "sha256": "hex-encoded-sha256",
  "fileSizeBytes": 18423000,
  "releaseNotes": [
    "Improved subscription status refresh.",
    "Fixed station setup warning navigation."
  ],
  "minimumSupportedVersionCode": 0
}
```

The Android repo workflow generates this file during release publishing.

## Local preview

The page falls back cleanly if R2 has not published metadata yet. Start the static preview with:

```sh
python3 -m http.server 4173
```

Then open:

```txt
http://127.0.0.1:4173/
http://127.0.0.1:4173/download.html
```

Local preview skips the live metadata request by default. To force the metadata fetch during local testing, open:

```txt
http://127.0.0.1:4173/download.html?release-metadata
```
