<?php
include "konekcija_sa_bazom.php";

$sql = "CREATE TABLE IF NOT EXISTS pacijenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ime TEXT,
    godine INTEGER,
    pol TEXT,
    visina REAL,
    tezina REAL,
    bmi REAL,
    kategorija TEXT,
    napomena TEXT,
    slika TEXT
)";

if ($baza->exec($sql)) {
    echo "База података Премијер Лиге је успешно креирана!";
} else {
    echo "Грешка при креирању базе.";
}
?>