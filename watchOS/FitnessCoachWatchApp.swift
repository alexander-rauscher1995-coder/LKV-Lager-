import SwiftUI
import HealthKit
import Combine

@main
struct FitnessCoachWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchHomeView()
        }
    }
}

struct WatchHomeView: View {
    @StateObject private var workout = FitnessCoachWorkoutManager()
    @StateObject private var connectivity = FitnessCoachWatchConnectivity.shared

    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: workout.running ? "figure.strengthtraining.traditional" : "applewatch")
                .font(.title)
            Text(workout.running ? "Training läuft" : "Fitness Coach")
                .font(.headline)

            if workout.running {
                if let heartRate = workout.heartRate {
                    Text("\(Int(heartRate)) BPM")
                        .font(.system(size: 22, weight: .semibold, design: .rounded))
                }
                Text("\(Int(workout.activeCalories)) kcal")
                    .font(.caption)
                Button("Training beenden") {
                    workout.stop()
                    connectivity.send(["event": "trainingStopped"])
                }
                .tint(.red)
            } else {
                Button("Training starten") {
                    startTraining()
                }
                .tint(.green)
            }

            Text(connectivity.connected ? "iPhone verbunden" : "iPhone nicht verbunden")
                .font(.caption2)
        }
        .padding()
        .task {
            await workout.requestAuthorization()
            connectivity.activate()
        }
        .onChange(of: connectivity.incomingCommand) { _, command in
            guard let command else { return }
            if command == "startTraining" {
                workout.start()
                connectivity.send(["event": "trainingStarted"])
            } else if command == "stopTraining" {
                workout.stop()
                connectivity.send(["event": "trainingStopped"])
            }
        }
    }

    private func startTraining() {
        workout.start()
        connectivity.send(["event": "trainingStarted"])
    }
}