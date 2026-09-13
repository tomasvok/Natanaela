# Natanaela Prokešová – vztahový koučink

Statický web (HTML/CSS/JS + PHP formulář) pro Ing. Natanaelu Prokešovou.
Strukturou vychází z webu koucink-poradenstvi.cz (hero s fotkou a podpisem → pro koho → s čím pomáhám → o mně → jak to probíhá → reference → ceník → otázky → kontakt).

## Soubory

- `index.html` – celý web na jedné stránce (sekce s kotvami v menu)
- `styles.css` – design; písmo podpisu se mění v proměnné `--podpis`
- `script.js` – menu na mobilu, animace podpisu, odhalování sekcí, odeslání formuláře
- `odeslat.php` – formulář přes PHP `mail()` (doplnit `PRIJEMCE` a `ODESILATEL`)
- `podpis-varianty.html` – pomocná stránka pro výběr písma podpisu (na server nenahrávat)
- `favicon.svg`

Náhled: `AppResults/.claude/launch.json` → „natanaela“ (python http.server, port 4323).
Formulář lokálně neodešle (python neumí PHP), otestovat až na hostingu.

## Koncept – co chybí od Natanaely

Žlutě označené údaje (`class="todo"`) je potřeba doplnit nebo ověřit:

1. **Fotky** – portrét na úvodu je hotový (`img/natanaela-prokesova.webp`, originál v `_podklady/` – na server nenahrávat). Chybí druhá fotka do sekce O mně; ideálně i profesionální portrét ve vyšším rozlišení (současný má jen 781 × 848 px)
2. **Podpis** – vybrat písmo v `podpis-varianty.html`, případně poslat sken skutečného podpisu z vizitky
3. **Kontakty** – e-mail, telefon, doména, město/adresa, nebo jen online
4. **Ceník** – cena a délka individuálního a párového setkání, je úvodní rozhovor zdarma a jak dlouhý
5. **O mně** – škola a obor (Ing.), koučovací výcvik/akreditace, kolik let praxe, jak přesně to bylo s bankou
6. **Reference** – 2–3 skutečné, se souhlasem se zveřejněním
7. **Služby** – sedí rozdělení jednotlivci / páry / rodina? Pracuje i se vztahy v práci?
8. Dárkové poukazy, storno podmínky, platba (karty Edenred/Pluxee?)
9. Údaje do zásad ochrany osobních údajů (IČO, sídlo/provozovna)

## Před spuštěním

- smazat `.koncept-lista` z `index.html` a `<meta name="robots" content="noindex">`
- doplnit zásady ochrany osobních údajů, 404, `robots.txt`, `sitemap.xml`, OG obrázek, JSON-LD
- zvážit vlastní hostování fontů (GDPR) místo Google Fonts
- po změně CSS/JS zvednout `?v=N` v odkazech
