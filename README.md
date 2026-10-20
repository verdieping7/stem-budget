# StemBudget — burgerpotjes (SPA/PWA demo v2)

Een interactieve Nederlandstalige SPA waarin je **100 budgetpunten** verdeelt over **17 herkenbare onderwerpen** en **78 concrete subpotjes**. Per onderwerp kun je punten aan de hele groep geven of direct aan een concreet onderdeel, zoals wegenonderhoud, bruggen, bosbeheer of woningisolatie.

## In deze versie

- Zoek in de potjes en klap onderwerpen open voor detailkeuzes.
- Geef een onderwerp een algemene toewijzing of geef punten aan specifieke subpotjes.
- Totaal mag maximaal 100 punten bedragen. Met 100 punten leg je een lokale demostem vast.
- Vergelijk jouw verdeling op onderwerp- en subpotniveau met een **fictief voorbeeldprofiel**.
- Fictieve plannen met bedragen en berekende tekorten, gekoppeld aan concrete potjes.
- Voeg lokaal een voorstel toe en steun voorbeeldplannen.
- Vrijwillig onderzoeksformulier met toestemming en mogelijkheid tot wissen.
- PWA-ondersteuning en offline caching wanneer op HTTPS gehost.

**Alle stemmen en antwoorden blijven in localStorage.** Er is geen centrale telling en er zijn geen trackingdiensten of externe API-verzoeken. Bronverwijzingen zijn uitsluitend externe links die de bezoeker zelf kan openen.

## Officiële begroting versus burgerpotjes

Het Ministerie van Financiën publiceert de **ontwerpbegroting 2027** in machineleesbare vorm, onder meer JSON en CSV. Er zijn vijf hiërarchische niveaus: hoofdstuk, artikel, artikelonderdeel, financieel instrument en detail. Niet alle artikelen zijn op alle niveaus uitgesplitst. Sommige taken vallen onder premiegefinancierde zorg of sociale zekerheid, provincies of gemeenten. Het is dus niet verantwoord één burgerpotje rechtstreeks aan één bedrag te koppelen zonder een gecontroleerde mapping.

De begrijpelijke categorieën in deze demo zijn **door StemBudget voorgestelde termen**: niet letterlijke begrotingsregels. Elke groep verwijst naar een relevant officiële begrotingshoofdstuk van 2027. De gebruiker ziet **nog geen echte rijksbegrotingsbedragen**. De voorbeeldprojectbudgetten zijn fictief.

Gegevensbronnen:

- Dataset-index 2027: https://www.rijksfinancien.nl/overzicht-datasets
- Open datadefinitie: https://www.rijksfinancien.nl/open-data/budgettaire%20tabellen%20rijksbegroting
- Mobiliteitsfonds 2027: https://www.rijksfinancien.nl/memorie-van-toelichting/2027/OWB/A
- Natuur (LVVN) 2027: https://www.rijksfinancien.nl/memorie-van-toelichting/2027/OWB/XIV
- Klimaat en energie 2027: https://www.rijksfinancien.nl/memorie-van-toelichting/2027/OWB/XXIII

### Voor een echte 1-op-1 koppeling

1. Download de officiële begrotingsdata 2027, in twee varianten: met en zonder premies; selecteer de juiste, leg inclusies vast, combineer die niet zomaar.
2. Gebruik hoofdstuk/artikel/artikelonderdeel/instrument/detail en bewaar de originele officiële code, omschrijving, publicatiefase en bron in een genormaliseerde database.
3. Voeg een redactionele vertaallaag toe van begrotingsregel naar burgerpotje (één potje kan meerdere regels bevatten; één officiële regel kan niet zonder uitsplitsing worden onderverdeeld).
4. Houd ongeclassificeerde/overkoepelende posten apart en toon ze expliciet in plaats van ze te verbergen.
5. Toon bij echte bedragen ook het jaartal, fase (ontwerp versus vastgesteld versus realisatie), netto/bruto, verplicht versus vrij besteedbaar en Rijk versus gemeente/provincie.
6. Publiceer de mapping, uitzonderingen en totalen als auditbaar overzicht.

## Lokaal gebruiken

Start een statische server vanuit deze map:

```sh
python3 -m http.server 8080
```

Open http://localhost:8080 en gebruik op HTTPS de PWA-installatiefunctie.

## Privacy en statistiek

Demostemmen zijn geen echt onderzoek. Een publiek onderzoek heeft centrale, verifieerbare telling nodig, privacybescherming, anti-dubbelstemoplossing, AVG-beoordeling van politieke voorkeuren en zorgvuldige representativiteitsclaims. Deze demo voert geen officiële belastingstemming uit en beïnvloedt geen begrotingswetten.

## Techniek

Pure HTML, CSS, JavaScript, zonder bundler of server. Statische hosting mogelijk op Cloudflare Pages.

Bestanden: `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `assets/`, `potjes-voorlopige-indeling.csv` (conceptclassificatie met bronhoofdstukken, expliciet nog geen exacte begrotingsmapping).
