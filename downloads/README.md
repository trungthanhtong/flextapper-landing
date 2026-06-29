# Download redirects

The landing page CTA points to:

```txt
/download
```

The direct APK URL remains:

```txt
/downloads/FlexTapper.apk
```

Firebase Hosting redirects it to:

```txt
https://downloads.flextapper.com/latest/FlexTapper.apk
```

The old metadata URL redirects to `/download` so users do not land on raw JSON:

```txt
/downloads/metadata.json
```

Do not commit APK binaries to this repo. The Android repo publishes signed APKs and metadata to Cloudflare R2.
