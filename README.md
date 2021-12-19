# Easy HTMLQ V3
## Download
[Releases](https://github.com/Jumagoro/easy-htmlq-v3/releases)

## Ablauf
Interviewer erhalten eine Liste von Statements (Kombination aus einer ID und einem Text), z.B.:

    {
	    "id": 1,
	    "statement":"Pizza Hawaii ist eine valide Pizza",
	    "type": 1 // Optional: 1 (Agree), 2 (Neutral), 3 (Disagree)
    }
Sie sehen jedoch nur das eigentliche Statement, nicht, ob die Reihenfolge vom Ursprung variiert.

## Schritt 1 ("/step-1"):
Im ersten Schritt werden die unsortierten Statements nacheinander den Stapeln "Agree", "Neutral" oder "Disagree" zugeordnet. Diese drei Stapel sind im Speicher (Javascript **DATA** bzw. HTML Input **ehq3_data**) unter **stage1** zu finden. (siehe Abschnitt "*Daten / Konfiguration*"). Sobald alle Statements vom ursprünglichen Stapel einsortiert sind, wird der Weiter / "Continue" Button freigeschaltet.

## Schritt 2 ("/step-2"):
Im zweiten Schritt sieht der Interviewer in der oberen Hälfte eine Tabelle (**Aufbau**: siehe Abschnitt "*Daten / Konfiguration*") und in der unteren Hälfte wieder die drei Stapel "Agree", "Neutral" oder "Disagree", welche die zuvor sortierten Statements enthalten. Der Interviewer soll nun seine Einordnung der Statements verfeinern, indem er die einzelnen Statements von -4 (absolute Ablehnung) bis +4 (absolute Zustimmung) abstuft. Die gesamte Tabelle wird im Speicher (Javascript **DATA** bzw. HTML Input **ehq3_data**) unter **stage2** abgespeichert. Sobald alle Statements aus "stage1" (den ursprünglichen Stapeln) einsortiert wurden, wird der Weiter / "Continue" Button freigeschaltet.

## Schritt 3 ("/step-3"):
Der dritte Schritt ähnelt dem zweiten und legt den Fokus lediglich auf mögliche Umsortierungen. Interviewte sehen nun lediglich die Tabelle (wie aus Schritt 2) und können Ihre Statements, falls nötig, neu anordnen. Dieser Schritt beschreibt dabei ebenfalls komplett den **stage2**-Abschnitts im Speicher (Javascript **DATA** bzw. HTML Input **ehq3_data**).
Dieser Schritt ist optional und kann über die Konfiguration (siehe Abschnitt "*Daten / Konfiguration*") übersprungen werden.

## Schritt 4 ("/step-4"):
Dieser letzte Schritt nimmt alle Statements aus den Extrema des vorherigen Schrittes (Schritt 2 / Schritt 3), also den Spalten "absolute Ablehnung" (-4) und "absolute Zustimmung" (+4) und gibt nun die Möglichkeit, einen Kommentar zu den jeweiligen Statements zu fassen. Schritt 4 verwendet im Speicher (Javascript **DATA** bzw. HTML Input **ehq3_data**) den Bereich **stage4** (genaueres siehe Abschnitt "*Daten / Konfiguration*").
Die Kommentarfelder können dabei jedoch auch leer bleiben, der Weiter / "Continue" Button ist stets vorhanden und beendet zugleich auf die Umfrage (siehe Abschnitt "*Events*").

## Events
Um mit dem Sosci-Wrapper zu kommunizieren werden **Javascript-Events** verwendet, die wiederum auf dem umliegenden **div** mit der **ID** "**sosci-wrapper**" abgehört / dispatched werden (siehe Abschnitt "*Aufbau*").
|Abfolge|Name|Quelle|Funktion|
|--|--|--|--|
|1|ehq3_init|EHQ3|Signalisiert SoSci, dass EHQ3 bereit für die Daten-/Konfigurationsaufnahme ist|
|2|ehq3_input_set|SoSci|Signalisiert EHQ3, dass die Daten in den Inputs liegen (siehe Abschnitt "*Aufbau*")|
|3|ehq3_complete|EHQ3|Signalisiert SoSci, dass der Interviewer den letzten Schritt abgeschlossen hat und die Daten abgerufen werden können|
|-|ehq3_progress|EHQ3|Informiert SoSci über den Fortschritt (progress). Wert zwischen 0-1, entsprechend startDecimal und endDecimal aus Konfiguration|
|-|ehq3_present|EHQ3|Informiert SoSci über das Interagieren mit Hilfe-Button, oder das weiterklicken von Instructions|

Seit v0.4.0:
- *ehq3_present* wurde hinzugefügt

Seit v0.2.0:
- *ehq3_complete* statt *ehq3_onComplete*

## Aufbau
EHQ3 wird wie folgt auf der Website eingebunden. Die eigentliche Angular Anwendung befindet sich dabei jedoch innerhalb des Tags `<app-root></app-root>`.

    ...
    <form>
		<div  id="sosci-wrapper">
			<app-root></app-root>
		</div>

		<input  id="ehq3_data"  type="hidden"  value="">
		<input  id="ehq3_conf"  type="hidden"  value="">
	</form>
	...	
**Wichtig**: Es müssen alle *.js* und *.css* der Angular Anwendung geladen sein. Welche dies sind lässt sich aus den eingebetteten *.js* und *.css* Dateien aus der index.html entnehmen, die in jedem Release enthalten ist.
Die beiden Input-Felder dienen dem Informationsaustausch zwischen SoSci und EHQ3.
Die **Anfangskonfiguration** wird dabei in `<input  id="ehq3_conf"  type="hidden"  value="">` abgelegt.
Die **Daten** (Zwischengespeicherte von SoSci), wie anschließende Nutzereingaben, befinden sich (stets synchronisiert) in `<input  id="ehq3_data"  type="hidden"  value="">`.
Der umliegende **div** mit der **ID** "**sosci-wrapper**" dient der Kommunikation über Events (siehe Abschnitt "*Events*").

## Daten / Konfiguration
Die Daten und die Anfangskonfiguration von EHQ3 werden über Inputs ausgetauscht, die sich außerhalb der eigentlichen Angular Anwendung befinden (siehe Abschnitt "*Aufbau*").
Die Daten werden dabei stets mit dem Datenformat **JSON** formatiert.

### Konfiguration
Im folgenden befinden sich alle möglichen Felder, die über die Konfiguration gesetzt werden können.

    {
	    "structure": {
			"disableStep1": true,
	     	"disableStep3": false,
	     	"disableStep4": false,
	     	"gridColumns": [
			  	{
		  		   	"id": -4,    
		  			"color": "#FFD5D5",    
		  			"amountCells": 2    
		  		},
		  		...
		  		{
			  		"id": 0,    
		  			"color": "#E9E9E9",    
		  			"amountCells": 5    
		  		},
		  		...
		  		{
			  		"id": 4,    
		  			"color":"#9FDFBF",    
		  			"amountCells":1    
		  		},
		  	],
			"step2TableName": "<b>Sort the cards according to your experience with the iPads this semester2</b>",
            "step3TableName": "<b>Sort the cards according to your experience with the iPads this semester3</b>"
		},
	      
	    "design": {
		    "labelAgree": "Zustimmungstext",
		    "labelNeutral": "Neutraltext",
		    "labelDisagree": "Ablehnungstext"
	    },
	      
	    "instructions": {
	      
		    "homeInstruction": "<b>Home Instruction</b><br>Try Html here",
		    "homeButton": "Instruction button",
	      
		    "introductionInstruction": "<b>Second Instruction</b><br>Try Html here",
		    "introductionButton": "Introduction button",
	      
		    "step1Instruction": "<b>Step 1 Instruction</b><br>Try Html here",
		    "step1Button": "Instruction button",
	      
		    "step2Instruction": "<b>Step 2 Instruction</b><br>Try Html here",
		    "step2Button": "Instruction button",
	      
		    "step3Instruction": "<b>Step 3 Instruction</b><br>Try Html here",
		    "step3Button": "Instruction button",
	      
		    "step4Instruction": "<b>Step 4 Instruction</b><br>Try Html here",
		    "step4Button": "Instruction button",
			
			"step4UnfinishedText": "4 beenden!",
			"unfinishedText": "rest beenden!"
	    },
	      
	    "statements": [
		    {
		      "id":1,
		      "statement":"Statement 1 from config"
		    },
		    ...      
	    ],
	      
	    "progressBar": {
		    "startDecimal": 0.3,
		    "endDecimal": 0.7,
			"display": true
	    },

		"footer": {
			"helpMeButtonText": "Help me",
			"continueButtonText": "Continue"
		}
    }

Seit v0.3.0:
- *"progressBar": {"useEHQ3ProgressBar": false}*: Ersetzt null zum deaktivieren

Seit v0.2.0:
- *"progressBar": null* Deaktiviert die Progressbar

## Daten
Im folgenden befinden sich eine Übersicht, wie Eingaben / Daten gespeichert werden.

 

    {
	    "progress": {
		    "furthestStep": 3,
	        "progress": 1
	    },
	    
	    "stage1":{
	        "statements": [ {}, ... ],
	        
	        "agrees":[ {}, ... ],
	        "neutrals":[ {}, ... ],
	        "disagrees":[ {}, ... ],
	        
	        "timestamp":"2021-10-29T11:58:59.207Z"
	    },
	    
	    "stage2":{
			
		  "agrees":[ {}, ... ],
		  "neutrals":[ {}, ... ],
		  "disagrees":[ {}, ... ],
		
          "cols":[
             [ [{}], [{}], ],
             [ [{}], [{}], [{}] ],
             [ [{}], [{}], [{}], [{}] ],
             [ [{}], [{}], [{}], [{}], [{}] ],
             [ [{}], [{}], [{}], [{}], [{}] ],
             [ [{}], [{}], [{}], [{}], [{}] ],
             [ [{}], [{}], [{}], [{}] ],
             [ [{}], [{}], [{}] ],
             [ [{}], [{}] ]
          ],
          "timestamp":"2021-10-29T11:58:59.207Z"
       },

	   	"step3swap": [
		   {
			   "s1": idMovedStatement,
			   "s0": idPassiveStatement,
			   "c1": idNewColumnOfMoved,
			   "c0": idOldColumnOfMoved
		   },
		   ...
	   	],
       
       	"stage4":{
          "agree":[ [{}, "Kommentar zu statement"], ... ],
          "disagree":[ [{}, ""], ... ],
          "timestamp":"2021-10-29T11:59:10.835Z"
       	},
    }
    
 Dabei steht `{}` jeweils für ein (mögliches) Statement-Objekt, `{}, ...` für ein (mögliches) Statement-Objekt oder auch mehrere.
Unter *stage2* -> *cols*: Jedes äußere Array (in dem ersten Array), steht jeweils für eine Spalte, mit der jeweiligen Anzahl an Zellen (z.B. 5). Diese Zellen jedoch sind auch wiederum ein Array, was jedoch i. d. R. nur ein Objekt enthalten soll. Jede Zelle ist hier jedoch ein Array, da aus technischer Sicht jeder Ablagestapel (was eine Zelle hier ist) als ein Array realisiert werden muss. Daher das drei dimensionale Array (obwohl eigentlich nur zwei dimensional benötigt).

Seit v0.4.0:
- Daten enhalten nicht mehr Text von Statements (nur noch id und type)

Seit v0.2.0:
- *step3swap* enthält die Indizes der in Schritt 3 getauschten Statements
- *stage2* enthält nun eine Kopie der in stage1 sortierten Statements, sodass stage1 bis zum Ende erhalten bleibt (Kopien werden gelöscht, wenn leer)

## Farben / Styles / CSS:

### Kartenfarben
Die Farbe von "Agree", "Neutral" und "Disagree" wird unterschiedlich festgelegt.
Die Farbe der Spaltenbeschriftung aus **Stage2** wird beispielsweise direkt über die Konfiguration erledigt.
Die Farben der Statement Karten an sich wird jedoch über folgende CSS-Klassen geregelt:

 - `.bg-agree { background-color: #9fdfbf; }`
 - `.bg-neutral { background-color: #e9e9e9; }`
 - `.bg-disagree { background-color: #ffd5d5; }`

Diese Standardwerte sollten jedoch über ein eigenes CSS (eventuell `!important`benötigt) überschreibbar sein.
Ein Statement erhält diese Klassen abhängig von seinem Typ (1=Agree, 2=Neutral, 3=Disagree).

### Anpassen des vertikalen Grid-Layouts
CSS Klasse *.gridVerticalAlignment* -> *vertical-align: top* Wert ändern

### Anpassen des Weiter / Hilfe Knopf
- .btn-main {}
- .btn-main:hover {}

- .btn-help {}
- .btn-help:hover {}

## Dateien
Die Anwendung besteht aus folgenden Dateien (nach dem Kompilieren):
- index.html
- main.js
- polyfills.js
- runtime.js
- scripts.js
- styles.css

Weniger relevante Dateien (nach dem Kompilieren):
- favicon.ico
- 3rdpartylicenses.txt

Der Output erfolgt ohne Hashes in der Namensgebung, dazu folgendes Kommando verwenden:
	ng build --prod --output-hashing none

