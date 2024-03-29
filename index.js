var colors = require('colors');
var xlsx = require('node-xlsx').default;
var asciiTable = require('ascii-table');
var pdf = require("pdf-creator-node")
var keypress = require('keypress');
var nodemailer = require('nodemailer');
var config = require("./lib/configuration/config.json")
var fs = require("fs")

var transporter = nodemailer.createTransport({
  auth: {
    user: config.nodemailer.auth.user,
    pass: config.nodemailer.auth.pass
  },
  pool: true,
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  secure: true
})

keypress(process.stdin);

var args = process.argv.slice(2);

var options = {
  ListeInscriptionGarderieXLSX_Path: args[0],
  ListeEleveTotalXLSX_Path: args[1],
}

console.clear();

console.log(`
  ___   _   ___ ___  ___ ___ ___ ___ ___ 
 / __| /_\\ | _ \\   \\| __| _ \\_ _| __| __|
| (_ |/ _ \\|   / |) | _||   /| || _|| _| 
 \\___/_/ \\_\\_|_\\___/|___|_|_\\___|___|___|                                    
`.blue)
console.log(`> Le Petit d'Homme`.blue)
console.log(`> Jardins d'enfants, École privée Montessori`.blue)
console.log(`> 6/8 rue des Bluets 75011`.blue)

console.log("")

console.log(`[+] Récupération de la liste d'élèves inscrits à la garderie`.green)
var ListeInscriptionGarderieXLSX = xlsx.parse(`${__dirname}/lib/data/${options.ListeInscriptionGarderieXLSX_Path}`)[0].data
var ListeInscriptionGarderie = []

for (var i = 1; i < ListeInscriptionGarderieXLSX.length; i++) {
  var EleveInfo = {
    Nom: ListeInscriptionGarderieXLSX[i][5],
    Prenom: ListeInscriptionGarderieXLSX[i][6],
    Email1: ListeInscriptionGarderieXLSX[i][7],
    Email2: ListeInscriptionGarderieXLSX[i][8],
    Classe: ListeInscriptionGarderieXLSX[i][11],
  }

  ListeInscriptionGarderie.push(EleveInfo)
}
console.log(`[+] ${ListeInscriptionGarderie.length} élèves inscrits à la garderie`.green)

console.log("")

console.log("[+] Récupération des informations de facturation".green)
var ListeEleveTotalXLSX = xlsx.parse(`${__dirname}/lib/data/${options.ListeEleveTotalXLSX_Path}`)
var ListeEleveTotal = []
var InfoFacturation = {}
for (var i = 0; i < ListeEleveTotalXLSX.length; i++) {
  if (isNaN(ListeEleveTotalXLSX[i].name)) {
    InfoFacturation.Periode = ListeEleveTotalXLSX[i].data[1][1].toLowerCase()
    InfoFacturation.Classe = ListeEleveTotalXLSX[i].data[3][1].replace(/[()]/g, "");
    InfoFacturation.TauxHoraire = ListeEleveTotalXLSX[i].data[5][1]
    InfoFacturation.Total = 0
    InfoFacturation.NbEleve = 0
    console.log("")
    console.log(`> ${InfoFacturation.Periode}`.blue)
    console.log(`> ${InfoFacturation.Classe}`.blue)
    console.log(`> ${InfoFacturation.TauxHoraire}€/15mn`.blue)

    console.log("")

    console.log("[+] Récupération du total de chaque élève".green)
    for (var j = 0; j < ListeEleveTotalXLSX[i].data.length; j++) {
      if (j > 2) {
        if (!isNaN(ListeEleveTotalXLSX[i].data[j][2])) {
          try{
            if(InfoFacturation.Classe == "Familles"){
                var EleveInfo = {
                    Nom: ListeEleveTotalXLSX[i].data[j][3].split(",")[0],
                    Prenom: ListeEleveTotalXLSX[i].data[j][3].split(",")[1].replace(" ", ""),
                    Famille: ListeEleveTotalXLSX[i].data[j][3].replace(",", " "),
                    Total: ListeEleveTotalXLSX[i].data[j][7],
                }
              }else{
                var EleveInfo = {
                    Nom: ListeEleveTotalXLSX[i].data[j][3].split(",")[0],
                    Prenom: ListeEleveTotalXLSX[i].data[j][3].split(",")[1].replace(" ", ""),
                    Famille: ListeEleveTotalXLSX[i].data[j][3].split(",")[0] + " " + ListeEleveTotalXLSX[i].data[j][3].split(",")[1].replace(" ", ""),
                    Total: ListeEleveTotalXLSX[i].data[j][7],
                  }
              }
          }catch{
            console.log(`Erreur de récupération de l'élève ${ListeEleveTotalXLSX[i].data[j]}`.red)
          }
          InfoFacturation.Total += ListeEleveTotalXLSX[i].data[j][7]
          if (EleveInfo.Total > 0) {
            InfoFacturation.NbEleve += 1
          }
          ListeEleveTotal.push(EleveInfo)
        }
      }
    }
    console.log(`[+] ${InfoFacturation.Total}€ à facturer sur ${ListeEleveTotal.length} élèves`.green)
    var Table = new asciiTable(`${InfoFacturation.Periode} (${InfoFacturation.Classe})`)
    Table.setHeading('Nom', 'Prénom', 'Total')
    for (var j = 0; j < ListeEleveTotal.length; j++) {
      Table.addRow(ListeEleveTotal[j].Nom, ListeEleveTotal[j].Prenom, `${ListeEleveTotal[j].Total}€`)
    }
    console.log("")
    console.log(Table.toString().blue)
  }
}

console.log("")
console.log("[+] Génération des factures".green)
for (var i = 0; i < ListeEleveTotal.length; i++) {
  var HTML = `
  <html>
    <head>
      <style>
        body {
          font-family: Roboto, sans-serif;
        }
      </style>
    </head>
    <body>
      <center>
        <p>Le Petit d'Homme</p>
        <p>Jardins d'enfants, École privée Montessori</p>
        <p>6/8 rue des Bluets 75011</p>
        <p>TEL : 01 43 55 40 19</p>
        <br>
        <br>
        <br>
        <p>${ListeEleveTotal[i].Famille}&nbsp;&nbsp;&nbsp;(${InfoFacturation.Classe})</p>
        <p>Facture de garderie des mois de ${InfoFacturation.Periode}</p>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <b><p>Net à payer : ${ListeEleveTotal[i].Total}€</p></b>
        <br>
        <br>
        <br>
        <p>Association loi 1901 SIRET 333 905 29700029</p>
      </center>
    </body>
  </html>
`
  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  }
  var document = {
    html: HTML,
    data: {},
    path: `./lib/factures/${InfoFacturation.Periode}_${InfoFacturation.Classe.replace("/", "-")}/${ListeEleveTotal[i].Nom}_${ListeEleveTotal[i].Prenom}.pdf`,
    type: "",
  }
  pdf.create(document, options)
  if (i == ListeEleveTotal.length - 1) {
    console.log(`[+] ${ListeEleveTotal.length} factures générées dans ${__dirname}/lib/factures/${InfoFacturation.Periode}_${InfoFacturation.Classe.replace("/", "-")}/`.green)
  }
}

console.log("")

console.log("[+] Récupération des adresses email".green)

for (var i = 0; i < ListeEleveTotal.length; i++) {
  for (var j = 0; j < ListeInscriptionGarderie.length; j++) {
    if (ListeEleveTotal[i].Nom == ListeInscriptionGarderie[j].Nom && ListeEleveTotal[i].Prenom == ListeInscriptionGarderie[j].Prenom) {
      ListeEleveTotal[i].Email1 = ListeInscriptionGarderie[j].Email1
      ListeEleveTotal[i].Email2 = ListeInscriptionGarderie[j].Email2
    }
  }
}
console.log(`[+] ${ListeEleveTotal.length} adresses email récupérées`.green)

console.log("")

console.log("[!] Appuyez sur la touche 'Entrée' pour envoyer les factures par email ou appuyez sur 'ctrl'+'c' pour annuler".bgYellow.black.bold)

process.stdin.on('keypress', function (ch, key) {
  process.stdin.pause();
  sendEmails()
});

function sendEmails() {
  for (var i = 0; i < ListeEleveTotal.length; i++) {
    sendEmail(i)
  }
}
var I = 0
function sendEmail(i) {
  var MAIL_CONTENT = fs.readFileSync(`./lib/configuration/mail.txt`, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    return data
  })

  MAIL_CONTENT = MAIL_CONTENT.replace(/{{PERIODE}}/g, InfoFacturation.Periode)
  MAIL_CONTENT = MAIL_CONTENT.replace(/{{CLASSE}}/g, InfoFacturation.Classe)
  MAIL_CONTENT = MAIL_CONTENT.replace(/{{TAUX_HORAIRE}}/g, `${InfoFacturation.TauxHoraire}€/15mn`)
  MAIL_CONTENT = MAIL_CONTENT.replace(/{{TOTAL}}/g, `${ListeEleveTotal[i].Total}€`)
  MAIL_CONTENT = MAIL_CONTENT.replace(/{{NOM}}/g, ListeEleveTotal[i].Nom)
  MAIL_CONTENT = MAIL_CONTENT.replace(/{{PRENOM}}/g, ListeEleveTotal[i].Prenom)

  var MailOptions = {
    from: `${config.nodemailer.sender} <${config.nodemailer.auth.user}>`,
    to: [undefined],
    subject: `Facture de garderie des mois de ${InfoFacturation.Periode}`,
    text: MAIL_CONTENT,
    attachments: [
      {
        filename: `${ListeEleveTotal[i].Nom}_${ListeEleveTotal[i].Prenom}.pdf`,
        path: `./lib/factures/${InfoFacturation.Periode}_${InfoFacturation.Classe.replace("/", "-")}/${ListeEleveTotal[i].Nom}_${ListeEleveTotal[i].Prenom}.pdf`,
        contentType: 'application/pdf'
      }
    ]
  }
  if (ListeEleveTotal[i].Total >= config.factures.min) {
    transporter.sendMail(MailOptions, function (error, info) {
      if (!error) {
        console.log(`> ${ListeEleveTotal[i].Nom} ${ListeEleveTotal[i].Prenom} <${ListeEleveTotal[i].Email1}> <${ListeEleveTotal[i].Email2}>`.blue + `[OK]`.green)
      } else {
        console.log(`> ${ListeEleveTotal[i].Nom} ${ListeEleveTotal[i].Prenom} <${ListeEleveTotal[i].Email1}> <${ListeEleveTotal[i].Email2}>`.blue + `[ERREUR]`.red)
      }
      if (I == ListeEleveTotal.length - 1) {
        console.log("")
        console.log("[+] Toutes les factures ont été envoyées par email".green)
        console.log("")
        process.exit()
      } else {
        I++
      }
    })
  } else {
    console.log(`> ${ListeEleveTotal[i].Nom} ${ListeEleveTotal[i].Prenom} <${ListeEleveTotal[i].Email1}> <${ListeEleveTotal[i].Email2}>`.blue + `[<${config.factures.min}€]`.red)
    if (I == ListeEleveTotal.length - 1) {
      console.log("")
      console.log("[+] Toutes les factures ont été envoyées par email".green)
      console.log("")
      process.exit()
    } else {
      I++
    }
  }
}
