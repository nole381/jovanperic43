<?php
include "konekcija_sa_bazom.php";

$id = $_POST["id"];

$slikaUpit = $baza->prepare("SELECT slika FROM pacijenti WHERE id = :id");
$slikaUpit->bindValue(":id", $id);
$slikaRez = $slikaUpit->execute();
$slikaRed = $slikaRez->fetchArray(SQLITE3_ASSOC);

if ($slikaRed && $slikaRed["slika"] != "") {
    $putanjaSlike = __DIR__ . "/../uploads/" . $slikaRed["slika"];
    if (file_exists($putanjaSlike)) {
        unlink($putanjaSlike);
    }
}

$upit = $baza->prepare("DELETE FROM pacijenti WHERE id = :id");
$upit->bindValue(":id", $id);

if ($upit->execute()) {
    echo "Клуб је успешно обрисан из каталога.";
} else {
    echo "Грешка при брисању клуба.";
}
?>