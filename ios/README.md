# Fitness Coach – iPhone + Apple Watch

Diese Dateien bilden die native HealthKit-/WatchConnectivity-Schicht für Fitness Coach.

## Einrichtung in Xcode
1. Ein neues **iOS App**-Projekt mit SwiftUI anlegen.
2. Diese Swift-Dateien dem iOS Target hinzufügen.
3. Einen **watchOS App** Target hinzufügen und `watchOS/FitnessCoachWatchApp.swift` zuordnen.
4. In beiden Targets **HealthKit** aktivieren.
5. Im iOS Target **Background Modes** nach Bedarf für Health-/Workout-Szenarien konfigurieren.
6. Die HealthKit Usage Descriptions aus `Info.plist.example` in die Target-Einstellungen übernehmen.
7. Für echte Live-Workouts anschließend `HKWorkoutSession`/WorkoutKit bzw. die passenden watchOS Workout APIs ergänzen.

## Datenfluss

Apple Watch → HealthKit → iPhone → Fitness Coach

Die bestehende Web-App bleibt die UI-/Coach-Plattform. Die native Schicht stellt HealthKit und WatchConnectivity bereit.

## Wichtig

GitHub Pages kann keine HealthKit- oder watchOS-Berechtigungen direkt ausführen. Die native iPhone-/Watch-App muss deshalb als Apple-App in Xcode gebaut und signiert werden.