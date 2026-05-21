<?php
include "konekcija_sa_bazom.php";

$rezultat = $baza->query("SELECT * FROM pacijenti ORDER BY id DESC");
$klubovi = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $klubovi[] = $red;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($klubovi, JSON_UNESCAPED_UNICODE);
?>