# Publiceren op Cloudflare Pages

StemBudget is op dit moment een pure statische SPA/PWA. Er is geen Node-server of build nodig.

1. Open https://dash.cloudflare.com/ en ga naar **Workers & Pages**.
2. Kies **Create application** > **Pages** > **Connect to Git** (of **Import an existing Git repository**).
3. Selecteer de GitHub-repository `verdieping7/stem-budget`.
4. Stel in:
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** `exit 0` (of leeg)
   - **Build output directory:** `.` (root van de repository)
   - **Root directory:** `/`
5. Publiceer en open het toegewezen `*.pages.dev`-adres.
6. Voeg desgewenst onder **Custom domains** een eigen domein toe.

PWA-installatie werkt via HTTPS. De `_headers` van dit project zijn voor Cloudflare Pages en geven onder andere een Content Security Policy.

Elke push naar `main` wordt een productie-deploy. Pull requests krijgen een preview-URL.

## Belangrijk: demo

De huidige stemmen en onderzoeksantwoorden worden alleen lokaal in de browser opgeslagen. Er is nog geen echte centrale uitslag en geen Supabase-koppeling. De verdelingen en projectbedragen zijn demonstratiedata. Maak geen publieke claims over onderzoeksresultaten totdat dat backenddeel is gebouwd.
