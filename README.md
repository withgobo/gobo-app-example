# Gobo App Example

A simple example application to demonstrate how to build a Gobo-compliant third-party app.

See the [docs](https://docs.gobo.io) for more information.

## Dependencies

-   Node.js v20

## Installation

```bash
$ cp .env.example .env
$ npm install
```

## Configuration

Update the Environment Variables in `.env`:

-   Get `APP_CLIENT_SECRET` from your developer portal.
-   Set `APP_MARKETPLACE_URL` to `https://<YOUR_TENANT_SLUG>.withgobo.com` or `https://<YOUR_CUSTOM_MARKETPLACE_DOMAIN>`.
-   Set `SECRET_KEY` to a cryptographically secure random string of at least 32 characters.

Get a secure URL for this application by deploying it to the Internet or exposing it using a service like [ngrok](https://ngrok.com/). Then in the Gobo developer portal:

-   Set your app's install URL to: `<HOSTED_APP_URL>/install`
-   Set your app's OAuth redirect URL to: `<HOSTED_APP_URL>/callback`

## Run the App

```bash
$ npm start
```

## Local Development

```bash
$ npm run dev
```
