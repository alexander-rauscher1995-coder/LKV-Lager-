# Fitness Coach — Apple Watch

## Enthalten
- SwiftUI Watch App
- HealthKit-Berechtigung
- HKWorkoutSession + HKLiveWorkoutBuilder
- Live-Herzfrequenz
- aktive Kalorien
- Trainingsdauer
- Training speichern in Apple Health
- WatchConnectivity mit dem iPhone
- Start-/Ende-Events

## Xcode-Ziel
Diese Dateien sind für ein natives watchOS Target vorgesehen. GitHub Pages selbst kann keine HealthKit- oder watchOS-APIs ausführen.

## Einrichtung
1. In Xcode ein iOS-Projekt für Fitness Coach öffnen/erstellen.
2. Ein watchOS App Target hinzufügen.
3. Die Dateien aus diesem Ordner dem Watch Target zuordnen.
4. HealthKit Capability aktivieren.
5. WatchConnectivity für die iPhone/Watch-Kommunikation aktivieren.
6. Die HealthKit Usage Descriptions aus Info.plist.example übernehmen.
7. Team/Signing auswählen und auf einer gekoppelten Apple Watch testen.

Die App fordert keine Gesundheitsdaten an, um sie außerhalb von HealthKit zu speichern. Sie verwendet die von Apple bereitgestellten HealthKit-Schnittstellen.