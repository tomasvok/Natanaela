(() => {
  const koren = document.documentElement;

  // Menu na mobilu
  const prepinac = document.querySelector('.menu-prepinac');
  const menu = document.getElementById('menu');
  const nastavMenu = (otevrit) => {
    menu.classList.toggle('otevrene', otevrit);
    prepinac.setAttribute('aria-expanded', String(otevrit));
  };
  prepinac.addEventListener('click', () => nastavMenu(!menu.classList.contains('otevrene')));
  menu.querySelectorAll('a').forEach((odkaz) => odkaz.addEventListener('click', () => nastavMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') nastavMenu(false); });

  // Linka pod hlavičkou, jakmile se stránka odroluje
  const hlavicka = document.querySelector('.hlavicka');
  const priRolovani = () => hlavicka.classList.toggle('je-posunuto', window.scrollY > 8);
  window.addEventListener('scroll', priRolovani, { passive: true });
  priRolovani();

  // Podpis se začne „psát", až je načtené jeho písmo – jinak by na chvíli problikl náhradní font.
  // Název písma se bere z CSS proměnné --podpis, takže při změně fontu stačí upravit styles.css.
  const podpisPripraven = () => koren.classList.add('podpis-pripraven');
  const pismoPodpisu = getComputedStyle(koren).getPropertyValue('--podpis').split(',')[0].trim();
  if (document.fonts && pismoPodpisu) {
    Promise.race([
      document.fonts.load(`1em ${pismoPodpisu}`, 'Natanaela Prokešová'),
      new Promise((hotovo) => setTimeout(hotovo, 2500)),
    ]).then(podpisPripraven, podpisPripraven);
  } else {
    podpisPripraven();
  }

  // Postupné odhalování sekcí a „psaní" podpisu v sekci O mně
  const sledovane = document.querySelectorAll('[data-odhalit], .podpis--pozdeji');
  if ('IntersectionObserver' in window) {
    const pozorovatel = new IntersectionObserver((zaznamy) => {
      zaznamy.forEach((zaznam) => {
        if (!zaznam.isIntersecting) return;
        const prvek = zaznam.target;
        prvek.classList.add(prvek.classList.contains('podpis--pozdeji') ? 'pise' : 'viditelne');
        pozorovatel.unobserve(prvek);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    sledovane.forEach((prvek) => pozorovatel.observe(prvek));
  } else {
    sledovane.forEach((prvek) => prvek.classList.add('viditelne', 'pise'));
  }

  // Tlačítka v ceníku předvyplní „Mám zájem o"
  const zajem = document.getElementById('zajem');
  document.querySelectorAll('[data-zajem]').forEach((odkaz) => {
    odkaz.addEventListener('click', () => { zajem.value = odkaz.dataset.zajem; });
  });

  // Odeslání formuláře bez přenačtení stránky (zpracuje odeslat.php)
  const formular = document.getElementById('formular');
  const stav = formular.querySelector('.formular__stav');
  const tlacitko = formular.querySelector('button[type="submit"]');
  const cas = formular.querySelector('[name="cas"]');
  cas.value = Date.now();

  formular.addEventListener('submit', async (e) => {
    e.preventDefault();
    tlacitko.disabled = true;
    stav.className = 'formular__stav';
    stav.textContent = 'Odesílám…';

    let chyba = 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo mi napište e-mail.';
    try {
      const odpoved = await fetch(formular.action, {
        method: 'POST',
        body: new FormData(formular),
        headers: { Accept: 'application/json' },
      });
      const data = await odpoved.json().catch(() => null);
      if (odpoved.ok && data && data.ok) {
        stav.classList.add('ok');
        stav.textContent = data.zprava;
        formular.reset();
        cas.value = Date.now();
        return;
      }
      if (data && data.zprava) chyba = data.zprava;
    } catch (_) {
      // síťová chyba – zobrazí se obecná hláška
    } finally {
      tlacitko.disabled = false;
    }
    stav.classList.add('chyba');
    stav.textContent = chyba;
  });

  // Aktuální rok v patičce
  document.querySelectorAll('[data-rok]').forEach((prvek) => { prvek.textContent = new Date().getFullYear(); });

  // Lišta konceptu
  const lista = document.querySelector('.koncept-lista');
  if (lista) lista.querySelector('button').addEventListener('click', () => lista.remove());
})();
