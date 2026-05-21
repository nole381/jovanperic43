<?php
session_start();
$greska = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $korisnickoIme = $_POST["korisnicko_ime"];
    $lozinka = $_POST["lozinka"];

    if ($korisnickoIme == "admin" && $lozinka == "12345") {
        $_SESSION["ulogovan"] = true;
        $_SESSION["korisnik"] = $korisnickoIme;
        header("Location: index.php");
        exit();
    } else {
        $greska = "Погрешно корисничко име или лозинка.";
    }
}
?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <title>Пријава - Премијер Лига Евиденција</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">
    <div class="card p-4 shadow" style="width: 400px;">
        <h3 class="text-center mb-4">Премијер Лига Администрација</h3>
        
        <?php if ($greska != "") { ?>
            <div class="alert alert-danger"><?php echo $greska; ?></div>
        <?php } ?>

        <form method="POST" action="login.php">
            <div class="mb-3">
                <label class="form-label">Корисничко име:</label>
                <input type="text" name="korisnicko_ime" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Лозинка:</label>
                <input type="password" name="lozinka" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Пријави се</button>
        </form>
    </div>
</body>
</html>