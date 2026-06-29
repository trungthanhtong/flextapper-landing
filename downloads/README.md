# APK download redirect

The landing page keeps this URL for the download CTA:

```txt
/downloads/FlexTapper.apk
```

Firebase Hosting redirects it to:

```txt
https://downloads.flextapper.com/latest/FlexTapper.apk
```

Do not commit APK binaries to this repo. The Android repo publishes signed APKs and metadata to Cloudflare R2.
