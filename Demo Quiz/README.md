# Portfolio demo — online assessment

Dit is een geanonimiseerde versie van een klantproject, geschikt om als portfolio-case op GitHub te publiceren.

## Geanonimiseerd
- Bedrijfsnaam vervangen door `Demo Company`.
- MailBlue-account URL vervangen door `https://YOUR_ACCOUNT.api-us1.com`.
- MailBlue API-token vervangen door `YOUR_MAILBLUE_API_KEY`.
- Bedrijfsspecifieke MailBlue-tags vervangen door `DEMO-[LEADS]-...`.
- Google Apps Script Web App URL vervangen door `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`.
- Checkout/commerce-URL vervangen door een neutrale voorbeeld-URL.
- Logo en resultaatafbeeldingen vervangen door neutrale placeholder-assets.

## Belangrijk vóór publicatie
De originele API-key stond in het aangeleverde Apps Script. **Als deze sleutel ooit echt actief is geweest, roteer/revoke deze sleutel in MailBlue.** Een sleutel die al in een bestand, chat, commit of repository heeft gestaan, moet je niet opnieuw gebruiken.

Controleer daarnaast of je GitHub-repository geen originele bestanden, afbeeldingen, screenshots, exports, `.env`-bestanden of browser/build-cache bevat.

## Configureren voor lokaal gebruik
Vul in `Apps Script.js` je eigen waarden in:

- `MAILBLUE_API_URL`
- `MAILBLUE_API_KEY`

En vervang in `index.html`:

- `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL`

De HTML-quiz kan als statische pagina worden gebruikt; de formulierverwerking vereist de gekoppelde Google Apps Script Web App.
