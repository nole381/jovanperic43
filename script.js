var pacijenti = [];

var btnDodajPacijenta = document.getElementById("btnDodajPacijenta");
var btnPrikaziPacijente = document.getElementById("btnPrikaziPacijente");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var pacijentiSekcija = document.getElementById("pacijentiSekcija");

var patientForm = document.getElementById("patientForm");
var editForm = document.getElementById("editForm");

var imeInput = document.getElementById("ime");
var godineInput = document.getElementById("godine");
var visinaInput = document.getElementById("visina"); // Порази
var tezinaInput = document.getElementById("tezina"); // Победе
var napomenaInput = document.getElementById("napomena");

var filterKategorija = document.getElementById("filterKategorija");
var sortiranje = document.getElementById("sortiranje");

var patientsContainer = document.getElementById("patientsContainer");
var brojPacijenata = document.getElementById("brojPacijenata");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajPacijenta.addEventListener("click", prikaziFormu);
btnPrikaziPacijente.addEventListener("click", prikaziPacijente);
btnPrimeni.addEventListener("click", prikaziKarticePacijenata);
patientForm.addEventListener("submit", dodajPacijenta);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
    formaSekcija.classList.remove("d-none");
    pacijentiSekcija.classList.add("d-none");
}

function prikaziPacijente() {
    formaSekcija.classList.add("d-none");
    pacijentiSekcija.classList.remove("d-none");

    var zahtev = new XMLHttpRequest();
    zahtev.open("GET", "php/prikazi_pacijente.php", true);
    zahtev.onload = function() {
        if (zahtev.status === 200) {
            pacijenti = JSON.parse(zahtev.responseText);
            prikaziKarticePacijenata();
        }
    };
    zahtev.send();
}

// Рачунање процента успешности: Победе / Укупно утакмица (Победе + Порази) * 100
function izracunajBMI(porazi, pobede) {
    var ukupno = pobede + porazi;
    if (ukupno === 0) return 0;
    return (pobede / ukupno) * 100;
}

function odrediKategorijuBMI(procenat) {
    if (procenat < 35) {
        return "Pothranjenost"; // Борба за опстанак
    } else if (procenat < 55) {
        return "Normalna težina"; // Средина табеле
    } else if (procenat < 70) {
        return "Prekomerna težina"; // Лига Шампиона
    } else {
        return "Gojaznost"; // Шампионска трка
    }
}

function dodajPacijenta(e) {
    e.preventDefault();

    var ime = imeInput.value.trim();
    var godine = parseInt(godineInput.value);
    var porazi = parseInt(visinaInput.value);
    var pobede = parseInt(tezinaInput.value);
    var napomena = napomenaInput.value.trim();

    if (ime === "" || isNaN(godine) || isNaN(porazi) || isNaN(pobede) || godine <= 0 || porazi < 0 || pobede < 0) {
        alert("Унесите исправне статистичке податке за клуб.");
        return;
    }

    var bmi = izracunajBMI(porazi, pobede);
    var kategorija = odrediKategorijuBMI(bmi);

    var podaci = new FormData(patientForm);
    podaci.append("bmi", bmi);
    podaci.append("kategorija", kategorija);

    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/dodaj_pacijenta.php", true);
    zahtev.onload = function() {
        alert(zahtev.responseText);
        patientForm.reset();
        prikaziPacijente();
    };
    zahtev.send(podaci);
}

function prikaziKarticePacijenata() {
    patientsContainer.innerHTML = "";
    var listaZaPrikaz = [];
    for (var i = 0; i < pacijenti.length; i++) {
        listaZaPrikaz.push(pacijenti[i]);
    }

    var katFilter = filterKategorija.value;
    if (katFilter !== "Sve") {
        var filtrirani = [];
        for (var i = 0; i < listaZaPrikaz.length; i++) {
            if (listaZaPrikaz[i].kategorija === katFilter) {
                filtrirani.push(listaZaPrikaz[i]);
            }
        }
        listaZaPrikaz = filtrirani;
    }

    var nacinSort = sortiranje.value;
    if (nacinSort === "min-max") {
        listaZaPrikaz.sort(function(a, b) { return a.bmi - b.bmi; });
    } else if (nacinSort === "max-min") {
        listaZaPrikaz.sort(function(a, b) { return b.bmi - a.bmi; });
    }

    brojPacijenata.textContent = listaZaPrikaz.length;

    if (listaZaPrikaz.length === 0) {
        patientsContainer.innerHTML = '<div class="col-12 text-center text-muted py-5">Нема пронађених клубова за изабране критеријуме.</div>';
        return;
    }

    for (var i = 0; i < listaZaPrikaz.length; i++) {
        var k = listaZaPrikaz[i];
        var linija = "", badge = "", tekstKat = "";

        if (k.kategorija === "Pothranjenost") {
            linija = "line-pothranjenost"; badge = "bg-danger"; tekstKat = "Борба за опстанак";
        } else if (k.kategorija === "Normalna težina") {
            linija = "line-normalna"; badge = "bg-secondary"; tekstKat = "Средина табеле";
        } else if (k.kategorija === "Prekomerna težina") {
            linija = "line-prekomerna"; badge = "bg-info text-dark"; tekstKat = "Лига Шампиона";
        } else {
            linija = "line-gojaznost"; badge = "bg-warning text-dark"; tekstKat = "Кандидат за Титулу";
        }

        var slikaHTML = '<img src="https://via.placeholder.com/400x200?text=No+Logo" class="card-img-top slika-pacijenta">';
        if (k.slika && k.slika !== "") {
            slikaHTML = '<img src="uploads/' + k.slika + '" class="card-img-top slika-pacijenta">';
        }

        var kartica = document.createElement("div");
        kartica.className = "col-12 col-md-6 col-xl-4";
        kartica.innerHTML = `
            <div class="card h-100 shadow-sm ${linija}">
                ${slikaHTML}
                <div class="card-body">
                    <h5 class="card-title fw-bold">${k.ime}</h5>
                    <p class="card-text mb-1"><strong>Основан:</strong> ${k.godine}. године</p>
                    <p class="card-text mb-1"><strong>Стадион:</strong> ${k.pol}</p>
                    <p class="card-text mb-1"><strong>Победе / Порази:</strong> ${k.tezina} / ${k.visina}</p>
                    <p class="card-text mb-2"><strong>Проценат успешности:</strong> <span class="badge ${badge}">${parseFloat(k.bmi).toFixed(1)}% (${tekstKat})</span></p>
                    <p class="card-text text-muted small border-top pt-2"><strong>Инфо:</strong> ${k.napomena ? k.napomena : 'Нема унетих додатних података.'}</p>
                </div>
                <div class="card-footer bg-white border-0 d-flex justify-content-between pb-3">
                    <button class="btn btn-outline-primary btn-sm px-3 btn-uredi">Измени</button>
                    <button class="btn btn-outline-danger btn-sm px-3 btn-obrisi">Обриши</button>
                </div>
            </div>
        `;

        (function(klubObj) {
            kartica.querySelector(".btn-uredi").addEventListener("click", function() { otvoriUrediModal(klubObj); });
            kartica.querySelector(".btn-obrisi").addEventListener("click", function() { obrisiPacijenta(klubObj.id, klubObj.ime); });
        })(k);

        patientsContainer.appendChild(kartica);
    }
}

function otvoriUrediModal(k) {
    document.getElementById("editId").value = k.id;
    document.getElementById("editIme").value = k.ime;
    document.getElementById("editGodine").value = k.godine;
    document.getElementById("editVisina").value = k.visina;
    document.getElementById("editTezina").value = k.tezina;
    document.getElementById("editNapomena").value = k.napomena || "";
    document.getElementById("editSlika").value = "";

    var editRadios = document.querySelectorAll('input[name="pol"]');
    for (var i = 0; i < editRadios.length; i++) {
        if (editRadios[i].id.startsWith("edit")) {
            editRadios[i].checked = editRadios[i].value === k.pol;
        }
    }
    modalUredi.show();
}

function sacuvajIzmene() {
    var id = document.getElementById("editId").value;
    var ime = document.getElementById("editIme").value.trim();
    var godine = parseInt(document.getElementById("editGodine").value);
    var porazi = parseInt(document.getElementById("editVisina").value);
    var pobede = parseInt(document.getElementById("editTezina").value);

    if (ime === "" || isNaN(godine) || isNaN(porazi) || isNaN(pobede) || godine <= 0 || porazi < 0 || pobede < 0) {
        alert("Попуните поља исправним статистичким вредностима.");
        return;
    }

    var bmi = izracunajBMI(porazi, pobede);
    var kategorija = odrediKategorijuBMI(bmi);

    var podaci = new FormData(editForm);
    podaci.append("bmi", bmi);
    podaci.append("kategorija", kategorija);

    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/uredi_pacijenta.php", true);
    zahtev.onload = function() {
        alert(zahtev.responseText);
        modalUredi.hide();
        prikaziPacijente();
    };
    zahtev.send(podaci);
}

function obrisiPacijenta(id, ime) {
    if (!confirm("Да ли сте сигурни да желите да обришете клуб \"" + ime + "\"?")) {
        return;
    }

    var podaci = new FormData();
    podaci.append("id", id);

    var zahtev = new XMLHttpRequest();
    zahtev.open("POST", "php/obrisi_pacijenta.php", true);
    zahtev.onload = function() {
        alert(zahtev.responseText);
        prikaziPacijente();
    };
    zahtev.send(podaci);
}