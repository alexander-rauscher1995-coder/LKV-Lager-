# Fitness Coach Native Apple Build

Die nativen Swift-Dateien für iPhone und Apple Watch sind vorbereitet.

## Einmalig in Xcode
1. Neues iOS-App-Projekt mit SwiftUI anlegen.
2. Apple-Watch-App-Target hinzufügen.
3. Dateien aus `ios/` dem iOS-Target zuordnen.
4. Dateien aus `watchOS/` dem Watch-Target zuordnen.
5. HealthKit für beide Targets aktivieren.
6. WatchConnectivity aktivieren.
7. Bundle Identifier und Signing Team setzen.
8. HealthKit-Texte aus den jeweiligen Info.plist-Beispielen übernehmen.
9. iPhone und gekoppelte Watch als Run Destinations auswählen.
10. iPhone-App bauen und anschließend Watch-App installieren.
11. HealthKit-Berechtigungen auf den Geräten bestätigen.

## Verbindungstest
- Watch-App öffnen.
- „Training starten“ drücken.
- Auf dem iPhone muss das Watch-Ereignis ankommen.
- Herzfrequenz und aktive Kalorien werden während des Workouts von HealthKit geliefert.
- „Training beenden“ speichert das Workout in Apple Health und meldet das Ende an das iPhone.

## Wichtig
GitHub Pages kann keine nativen HealthKit/watchOS APIs ausführen. Das Repository enthält deshalb die native Schicht; Build, Signing und Geräteinstallation erfolgen durch Xcode.

Ein echter Cloud-/Account-Sync über mehrere Geräte ist ein separater Backend-/CloudKit-Schritt und wird nicht vorgetäuscht.