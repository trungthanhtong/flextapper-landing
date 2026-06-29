# Download metadata

The landing page shows the current Android build from Cloudflare R2 metadata.

## Public URLs

```txt
https://downloads.flextapper.com/latest/FlexTapper.apk
https://downloads.flextapper.com/latest/metadata.json
```

Firebase Hosting also redirects the branded path:

```txt
https://flextapper.com/downloads/FlexTapper.apk
https://flextapper.com/downloads/metadata.json
```

to the R2 URLs.

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
```

Local preview skips the live metadata request by default. To force the metadata fetch during local testing, open:

```txt
http://127.0.0.1:4173/?release-metadata
```
