# Apple Integration — Windows Ready

Die Fitness Coach Web-App bleibt die zentrale Anwendung für Windows und iPhone.

## Ohne Mac
Auf Windows kann die GitHub-Pages-App vollständig verwendet und weiterentwickelt werden. Browser/PWA-Funktionen laufen unabhängig von Xcode.

## Native Apple-Schicht
Die Ordner `ios/` und `watchOS/` enthalten die vorbereiteten Swift-Dateien für HealthKit und WatchConnectivity.

Eine native watchOS-App kann auf Windows nicht mit Xcode gebaut oder signiert werden. Für die finale Installation auf iPhone/Apple Watch wird einmalig ein Mac mit Xcode benötigt.

## Späterer Übergang
Die native Schicht ist bewusst getrennt von der Web-App. Dadurch kann die Web-App weiterlaufen, während die native Apple-Version später gebaut und mit derselben Coach-Logik verbunden wird.

## Kein falsches Versprechen
HealthKit-Daten werden nicht aus JavaScript/GitHub Pages vorgetäuscht. Der echte HealthKit-Zugriff erfolgt ausschließlich über die native Apple-Schicht.