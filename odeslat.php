<?php
// Zpracování kontaktního formuláře – pošle zprávu e-mailem přes PHP mail() (WEDOS).
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// TODO: doplnit, až bude známá doména a e-mail Natanaely.
// Odesílatel musí být schránka na stejné doméně, jinak zpráva skončí ve spamu.
const PRIJEMCE = 'doplnit@example.cz';
const ODESILATEL = 'web@example.cz';

function odpovez(int $kod, bool $ok, string $zprava): void
{
    http_response_code($kod);
    echo json_encode(['ok' => $ok, 'zprava' => $zprava], JSON_UNESCAPED_UNICODE);
    exit;
}

function pole(string $nazev, int $maxDelka): string
{
    $hodnota = trim((string)($_POST[$nazev] ?? ''));
    return mb_substr($hodnota, 0, $maxDelka);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    odpovez(405, false, 'Nepovolená metoda.');
}

$diky = 'Děkuji, zpráva odešla. Ozvu se vám co nejdřív.';

// Past na roboty: vyplněné skryté pole nebo formulář odeslaný do 3 sekund od načtení.
// Robotovi tváříme úspěch, aby to nezkoušel jinak.
$cas = (int)($_POST['cas'] ?? 0);
if (pole('web', 200) !== '' || ($cas > 0 && (microtime(true) * 1000 - $cas) < 3000)) {
    odpovez(200, true, $diky);
}

// Odstranění zalomení řádků brání vložení dalších hlaviček do e-mailu
$jmeno = str_replace(["\r", "\n"], ' ', strip_tags(pole('jmeno', 100)));
$email = str_replace(["\r", "\n"], '', pole('email', 150));
$telefon = strip_tags(pole('telefon', 30));
$zprava = strip_tags(pole('zprava', 4000));

$moznosti = [
    'uvodni' => 'Úvodní rozhovor',
    'individualni' => 'Individuální koučink',
    'par' => 'Párový koučink',
    'nevim' => 'Zatím nevím',
];
$zajem = $moznosti[pole('zajem', 20)] ?? 'Neuvedeno';

if ($jmeno === '' || $zprava === '') {
    odpovez(422, false, 'Vyplňte prosím jméno a zprávu.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    odpovez(422, false, 'Zkontrolujte prosím e-mailovou adresu.');
}

$zakoduj = static fn(string $text): string => '=?UTF-8?B?' . base64_encode($text) . '?=';

$predmet = $zakoduj("Nová zpráva z webu – {$jmeno} ({$zajem})");
$telo = "Jméno: {$jmeno}\n"
    . "E-mail: {$email}\n"
    . 'Telefon: ' . ($telefon !== '' ? $telefon : '–') . "\n"
    . "Zájem o: {$zajem}\n\n"
    . "Zpráva:\n{$zprava}\n";

$hlavicky = implode("\r\n", [
    'From: ' . $zakoduj('Web Natanaela Prokešová') . ' <' . ODESILATEL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

if (!mail(PRIJEMCE, $predmet, $telo, $hlavicky, '-f' . ODESILATEL)) {
    odpovez(500, false, 'Zprávu se nepodařilo odeslat. Napište mi prosím přímo e-mail.');
}

odpovez(200, true, $diky);
