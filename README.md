# FlexTapper Landing Page

Plain HTML, CSS, and JavaScript landing page for FlexTapper.

## Local Preview

```sh
python3 -m http.server 4173
```

Then open:

```txt
http://127.0.0.1:4173/
```

## APK Download

The primary CTA points to:

```txt
downloads/FlexTapper.apk
```

Place the production APK at that path before publishing.

## Deployment

This repo is static. Deploy the folder to any static host, including Cloudflare Pages, Netlify, Vercel static output, S3, Firebase Hosting, or a simple Nginx server.

Update these values before launch:

- `SITE_URL` in `main.js`
- canonical, Open Graph, Twitter, robots, and sitemap URLs
- `CONTACT_EMAIL` in `main.js`
- `downloads/FlexTapper.apk`

## Verification

- Run a local preview with `python3 -m http.server 4173`.
- Check mobile and desktop widths: 390, 768, 1280, and 1440 px.
- Run Lighthouse and target 90+ for Performance, Accessibility, Best Practices, and SEO.
- Confirm the page does not claim Amazon Flex auto-accept behavior.
