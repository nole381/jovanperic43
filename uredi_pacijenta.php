<?php
include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$ime = $_POST["ime"];
$godine = $_POST["godine"];
$pol = $_POST["pol"];
$visina = $_POST["visina"];
$tezina = $_POST["tezina"];
$bmi = $_POST["bmi"];
$kategorija = $_POST["kategorija"];
$napomena = $_POST["napomena"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM pacijenti WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";
    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];
    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);
    
    $nazivSlike = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    move_uploaded_file($privremenaPutanja, $folder . $nazivSlike);
}

$upit = $baza->prepare("UPDATE pacijenti SET 
    ime = :ime, godine = :godine, pol = :pol, visina = :visina, 
    tezina = :tezina, bmi = :bmi, kategorija = :kategorija, 
    napomena = :napomena, slika = :slika 
WHERE id = :id");

$upit->bindValue(":id", $id);
$upit->bindValue(":ime", $ime);
$upit->bindValue(":godine", $godine);
$upit->bindValue(":pol", $pol);
$upit->bindValue(":visina", $visina);
$upit->bindValue(":tezina", $tezina);
$upit->bindValue(":bmi", $bmi);
$upit->bindValue(":kategorija", $kategorija);
$upit->bindValue(":napomena", $napomena);
$upit->bindValue(":slika", $nazivSlike);

if ($upit->execute()) {
    echo "Подаци о клубу су успешно измењени!";
} else {
    echo "Грешка приликом измене клуба.";
}
?>