# Fitness Coach — Native Apple Setup

## iPhone
- [ ] Xcode iOS App Target
- [ ] SwiftUI App
- [ ] HealthKit capability
- [ ] HealthKit usage descriptions
- [ ] WatchConnectivity capability
- [ ] FitnessCoachApp.swift
- [ ] HealthKitManager.swift
- [ ] WatchConnectivityManager.swift

## Apple Watch
- [ ] watchOS App Target
- [ ] HealthKit capability
- [ ] WatchConnectivity
- [ ] FitnessCoachWatchApp.swift
- [ ] FitnessCoachWorkoutManager.swift
- [ ] FitnessCoachWatchConnectivity.swift
- [ ] HealthKit usage descriptions

## Verbindung
1. iPhone und Apple Watch mit demselben Apple-Account/gekoppelten Gerät verwenden.
2. Beide Targets mit gültigem Team/Signing bauen.
3. iPhone-App installieren.
4. Watch-App installieren.
5. HealthKit-Berechtigungen auf dem Gerät bestätigen.
6. WatchConnectivity aktivieren; danach wird der Verbindungsstatus in der Watch-App angezeigt.

## Architektur
Apple Watch → WatchConnectivity/HealthKit → iPhone → Fitness Coach

Die GitHub-Pages-Web-App bleibt die bestehende Web-Oberfläche. Native HealthKit-Daten werden nicht direkt aus JavaScript der GitHub-Pages-Seite gelesen.

## Cloud
Ein echter kontoübergreifender Cloud-Sync ist noch nicht enthalten. Dafür ist ein Backend oder eine passende iCloud/CloudKit-Struktur mit Authentifizierung erforderlich.