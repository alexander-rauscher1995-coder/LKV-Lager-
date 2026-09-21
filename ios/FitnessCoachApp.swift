import SwiftUI

@main
struct FitnessCoachApp: App {
    @StateObject private var health = HealthKitManager()
    @StateObject private var watch = WatchConnectivityManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(health)
                .environmentObject(watch)
                .task {
                    await health.requestAuthorization()
                    watch.activate()
                }
        }
    }
}

struct ContentView: View {
    @EnvironmentObject private var health: HealthKitManager
    @EnvironmentObject private var watch: WatchConnectivityManager

    var body: some View {
        NavigationStack {
            List {
                Section("Heute") {
                    Label("\(health.steps) Schritte", systemImage: "figure.walk")
                    Label(health.heartRateText, systemImage: "heart.fill")
                    Label("\(health.activeCalories) kcal aktiv", systemImage: "flame.fill")
                }
                Section("Apple Watch") {
                    Label(
                        watch.isReachable ? "Verbunden" : "Bereit für Verbindung",
                        systemImage: watch.isReachable ? "applewatch" : "applewatch.slash"
                    )
                    Button("Training an Watch senden") {
                        watch.send(command: "startTraining")
                    }
                    if let event = watch.lastWatchEvent, !event.isEmpty {
                        Label(event, systemImage: "checkmark.circle")
                            .font(.footnote)
                    }
                }
            }
            .navigationTitle("Fitness Coach")
            .refreshable { await health.refresh() }
        }
    }
}