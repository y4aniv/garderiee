
# GARDERIEE

## Installation

### Node.js
Ce script est développé en utilisant Node.js, une plateforme de développement JavaScript côté serveur. Node.js est construit sur le moteur JavaScript V8 de Google Chrome, ce qui lui confère une grande rapidité et une excellente performance.

Avant d'exécuter ce script, assurez-vous d'avoir Node.js installé sur votre système. Vous pouvez vérifier si Node.js est installé en ouvrant une fenêtre de terminal et en exécutant la commande suivante :
```js
node --version
```
Si Node.js n'est pas installé, vous pouvez le télécharger et l'installer à partir du site officiel de Node.js ([https://nodejs.org](https://nodejs.org/)). Assurez-vous d'installer la version compatible avec votre système d'exploitation.

### Dépendances
Ce script utilise des modules externes qui doivent être installés avant de l'exécuter.
Pour installer les dépendances, ouvrez une fenêtre de terminal dans le répertoire où se trouve le script et exécutez la commande suivante : 
```js
npm install
```
![Ouvrir une fenêtre de terminal dans le répertoire où se trouve le script ](https://cdn.discordapp.com/attachments/780505127458570251/1109796030666526770/Capture_decran_2023-05-21_a_12.47.40.png)

## Configuration

### CONFIG.json
Le fichier `./lib/configuration/config.json` est un fichier de configuration utilisé par le script. Il contient des paramètres spécifiques qui peuvent être personnalisés en fonction des besoins de l'utilisateur. Voici une explication des différentes sections de ce fichier :
#### Nodemailer
La section `nodemailer` contient les paramètres de configuration pour l'envoi de courriers électroniques à l'aide du module Nodemailer. Voici la signification des différentes clés :

-   `host`: Il s'agit de l'hôte du serveur SMTP utilisé pour envoyer les courriers électroniques. Vous devez spécifier l'adresse de l'hôte SMTP fournie par votre fournisseur de messagerie ou votre service d'envoi de courrier électronique. _(ex: smtp.orange.fr)_
-   `port`: Il s'agit du port utilisé pour la connexion au serveur SMTP. Vous devez spécifier le numéro de port approprié fourni par votre fournisseur de messagerie ou votre service d'envoi de courrier électronique. _(ex: 465)_
-   `secure`: Il s'agit d'un paramètre booléen qui indique si la connexion avec le serveur SMTP doit être sécurisée ou non. Si la valeur est définie sur "true", une connexion sécurisée sera établie.
-   `sender`: Il s'agit du nom qui apparaitra lors de la réception du mail par les parents. _(ex: Le Petit d'Homme)_
-   `auth`: Cette section contient les informations d'authentification requises pour se connecter au serveur SMTP. Vous devez spécifier le nom d'utilisateur et le mot de passe associés à votre compte de messagerie.

Vous devez modifier les valeurs vides (`""`) pour les clés `host`, `port`, `user` et `pass` avec les informations appropriées pour votre configuration de messagerie.

#### Factures
La section `factures` contient des paramètres spécifiques aux factures. Dans cet exemple, il y a une clé `min` qui indique une valeur minimale de 10 (€) pour les factures.

Vous pouvez modifier la valeur de `min` en fonction de vos besoins. Par exemple, si vous souhaitez que seules les factures d'un montant supérieur ou égal à `5` (€) soient prises en compte, vous pouvez modifier la valeur de `min` à `5`.

### MAIL.txt
Le fichier `./lib/configuration/mail.txt` contient le contenu du courrier électronique qui sera envoyé par le script. Ce fichier peut être utilisé pour stocker des modèles de courrier électronique ou des messages prédéfinis. Il est possible d'utiliser des templates dans ce fichier, où des marqueurs spécifiques sont utilisés pour insérer des valeurs dynamiques lors de l'envoi du courrier électronique.

#### Valeurs dynamiques
Voici une liste des valeurs dynamiques disponibles dans le contexte des courriers électroniques :

1.  `{{PERIODE}}` : Cette valeur dynamique représente la période concernée.
2.  `{{CLASSE}}` : Cette valeur dynamique indique la classe ou le groupe concerné.
3.  `{{TAUX_HORAIRE}}` : Cette valeur dynamique représente le taux horaire appliqué.
4.  `{{TOTAL}}` : Cette valeur dynamique indique le montant total.
5.  `{{NOM}}` : Cette valeur dynamique représente le nom associé.
6.  `{{PRENOM}}` : Cette valeur dynamique indique le prénom associé.

Ces templates peuvent être utilisés dans le contenu du courrier électronique pour personnaliser les informations en fonction des données spécifiques. Les valeurs sont automatiquement changé selon l'élève, la classe et la période.

![Avant/Après traitement du message](https://cdn.discordapp.com/attachments/780505127458570251/1109801859180396614/Capture_decran_2023-05-21_a_13.15.03.png)

## Fichiers Excel
  
Pour que le script puisse fonctionner correctement, il est important de s'assurer que les fichiers Excel requis sont présents dans le répertoire `./lib/data/`. Voici les détails sur les fichiers nécessaires : 
- **Liste complète des inscrits à la garderie** : Ce fichier devrait inclure les informations suivantes pour chaque élève : nom, prénom, classe, email1 et email2
![enter image description here](https://cdn.discordapp.com/attachments/780505127458570251/1109808016217362524/Capture_decran_2023-05-21_a_13.26.40.png)
- **Liste des nombres d'heures de présence de chaque classe** : Ce fichier devrait inclure les informations suivantes pour chaque élève : nom, prénom, id et prix garderie ainsi que le mois de facturation, la classe et le taux horaire
![enter image description here](https://cdn.discordapp.com/attachments/780505127458570251/1109808015940521984/Capture_decran_2023-05-21_a_13.30.39.png)

Il est important de noter que le formatage et la position des colonnes dans les fichiers Excel ne doivent pas être modifiés une fois qu'ils ont été configurés pour fonctionner avec le script. Tout changement dans le formatage ou la position des colonnes peut affecter le bon fonctionnement du script et entraîner des erreurs lors du traitement des données.

## Exécution du script
Pour exécuter le script, suivez les étapes ci-dessous :

- Ouvrez une fenêtre de terminal dans le répertoire où se trouve le script
- Exécutez la commande suivante : 
```js
node . <liste_complete> <liste_classe>
```
Lors de l'exécution du script, vous devez fournir deux arguments en ligne de commande : `<liste_complete>` et `<liste_classe>`. Voici une explication de ce que représentent ces arguments :

-   `<liste_complete>` : Il s'agit du nom du fichier Excel contenant la liste complète des inscrits à la garderie. Ce fichier doit être présent dans le répertoire `./lib/data/`, comme expliqué précédemment. Assurez-vous de fournir le nom exact du fichier, y compris l'extension (.xlsx)
- `<liste_classe>` : Il s'agit du nom du fichier Excel contenant la liste des nombres de 1/4 heure de présence de chaque élève par classe à la garderie. Ce fichier doit également être présent dans le répertoire `./lib/data/`. De même, assurez-vous de fournir le nom exact du fichier, y compris l'extension.

Veillez à remplacer `<liste_complete>` et `<liste_classe>` par les noms réels des fichiers Excel que vous souhaitez utiliser pour l'exécution du script. Par exemple :
```bash
node . Liste complète garderie 2022-2023.xlsx Facture 6-8 ans modèle MC 2022-2023.xlsx
```
Une fois la commande exécutée, suivez les instructions indiqué dans le terminal.

## Erreurs possibles
1.  **Erreur d'ouverture des fichiers** : Si les noms des fichiers fournis en tant qu'arguments sont incorrects ou si les fichiers ne sont pas présents dans le répertoire `./lib/data/`, une erreur d'ouverture des fichiers peut se produire.
    
2.  **Erreur de récupération des données** : Si le formatage ou la position des colonnes dans les fichiers Excel a été modifié, le script peut échouer lors de la récupération des données. Il est essentiel de maintenir le formatage et la structure des fichiers Excel tels qu'ils ont été initialement configurés pour fonctionner avec le script.
    
3.  **Erreur de sauvegarde des factures** : Si l'ordinateur n'a pas suffisamment d'espace disponible pour sauvegarder les factures générées, une erreur de sauvegarde peut se produire.
    
4.  **Erreur lors de l'envoi des e-mails** : Si les adresses e-mail fournies sont incorrectes ou ne sont pas renseignées, une erreur d'envoi des e-mails peut se produire.

## License
MIT License

Copyright (c) 2023 Yaniv DOUIEB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
