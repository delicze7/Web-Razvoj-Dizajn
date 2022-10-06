let napravi_stavke=(opcije) =>{

    let s="";
    opcije.forEach(x => {
        s+=`<option>${x}</option>`
    });

    return s;
};
let preuzmi = () => {
    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20220910/Get6Ponuda`;
    let divDest = document.getElementById("destinacije");
    divDest.innerHTML = "";
    fetch(url).then(r => {
        if (r.status != 200) {
            alert("Server javlja gresku " + r.status);
            return;
        }
        r.json().then(obj => {
            for (const i of obj.podaci) //<--- ovdje se koristi property "podaci" - pogledati json rezultat API-a
			{
                divDest.innerHTML += `
                <div class="offer">
                <div class="akcija">${i.akcijaPoruka}</div>
                <div  class="offer-image" style="background-image: url('${i.imageUrl}');" ></div>
                    <div class="offer-details">
                        <div class="offer-destination">${i.mjestoDrzava}</div>
                        <div class="offer-price">$${i.cijenaDolar}</div>
                        <div class="offer-description">${i.opisPonude}</div>
                        <select class="offer-option">${napravi_stavke(i.opcije)}</select>
                    </div>
                    <div class="ponuda-dugme-1" onclick="odaberiPonudu1('${i.mjestoDrzava}', ${i.cijenaDolar}, this)">Odaberi za destinaciju 1</div>
                    <div class="ponuda-dugme-1" onclick="odaberiPonudu2('${i.mjestoDrzava}', ${i.cijenaDolar}, this)">Odaberi za destinaciju 2</div>
                </div>`;
            }
            resetOkvir();
        })
    }).catch(error => {
        alert("Greska u komunikaciji sa serverom " + error.status);
    })
}

let resetOkvir= ()=>{
	//dodatak: ovo nije traženo u ispitnom zadatku
    document.querySelectorAll(".offer").forEach(a=>a.style.border="4px solid rgba(0,0,0,0)");   
}


let odaberiPonudu1 = (dest, cijena, dugme) => {
	// parent element od dumgeta je DIV offer. Unutar njega tražimo combobx (html element select)- te uzimamo označenu vrijednost sa propertijem "value"
    let opcija = dugme.parentElement.querySelector(".offer-option").value;
	
    document.getElementById("destinacija-1").value = dest + ", " + opcija;
    document.getElementById("cijena-1").value = cijena;
    document.getElementById("cijena-ukupno").value = Number(document.getElementById("cijena-2").value) + cijena;
    resetOkvir();
	
    dugme.parentElement.style.border="4px solid yellow";
   
    
}

let odaberiPonudu2 = (dest, cijena, dugme) => {
	// parent element od dumgeta je DIV offer. Unutar njega tražimo combobx (html element select)- te uzimamo označenu vrijednost sa propertijem "value"
    let opcija = dugme.parentElement.querySelector(".offer-option").value;
	
    document.getElementById("destinacija-2").value = dest + ", " + opcija;
    document.getElementById("cijena-2").value = cijena;
    document.getElementById("cijena-ukupno").value = Number(document.getElementById("cijena-1").value) + cijena;
    resetOkvir();
	
    dugme.parentElement.style.border="4px solid yellow";
   
    
}

let ErrorBackgroundColor="#FE7D7D";
let OkBackgroundColor="#DFF6D8";


let test_email = ()=>{
    let txt=document.getElementById("email");
    if (!/^[a-z]+(\.|\-|\_)?[a-z]*\@edu.fit.ba$/.test(txt.value)){
        txt.style.backgroundColor = ErrorBackgroundColor;
        return "Email nije u ispravnom formatu!\n";
    }
    else{
        txt.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}
let test_phone = ()=>{
    let txt=document.getElementById("phone");
    if (!/\+\d{3}\-\d{2}\-\d{3}\-\d{3}$/.test(txt.value)){
        txt.style.backgroundColor = ErrorBackgroundColor;
        return "Telefon nije u ispravnom formatu!\n";
    }
    else{
        txt.style.backgroundColor = OkBackgroundColor;
        return "";
    }
}

let posalji = () => {

    let url = `https://restapiexample.wrd.app.fit.ba/Ispit20220910/Add`;
    let s="";

    s+= test_email();
    s+= test_phone();
    
    if (s !== "")
    {
        alert(s);
        return;
    }
    let obj = new Object();
    obj.destinacija1Soba = document.getElementById("destinacija-1").value;
    obj.destinacija2Soba = document.getElementById("destinacija-2").value;
    obj.imeGosta = document.getElementById("first-name").value;
    obj.prezimeGosta = document.getElementById("last-name").value;
    obj.poruka = document.getElementById("messagetxt").value;
    obj.email = document.getElementById("email").value;
    obj.telefon =  document.getElementById("phone").value;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    }).then(r => {
        if (r.status != 200) {
            alert("Server javlja gresku " + r.status);
            return;
        }
        r.json().then(x => {
            alert("Vasa rezervacija je poslana. Broj rezervacije: " + x.brojRezervacije);
        });
        
    }).catch(error => {
        alert("Greska u komunikaciji sa serverom " + error.status);
    })
}