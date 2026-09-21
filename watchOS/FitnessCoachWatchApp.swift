import SwiftUI
import HealthKit

@main
struct FitnessCoachWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchHomeView()
        }
    }
}

struct WatchHomeView: View {
    @State private var running = false
    @State private var seconds = 0
    @State private var timer: Timer?

    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: running ? "figure.run" : "applewatch")
                .font(.title)
            Text(running ? "Training läuft" : "Fitness Coach")
                .font(.headline)
            if running {
                Text(timeString(seconds))
                    .font(.system(size: 30, weight: .bold, design: .rounded))
                Button("Training beenden") {
                    stop()
                }
                .tint(.green)
            } else {
                Button("Training starten") {
                    start()
                }
                .tint(.green)
            }
        }
        .padding()
    }

    private func start() {
        running = true
        seconds = 0
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            seconds += 1
        }
    }

    private func stop() {
        timer?.invalidate()
        timer = nil
        running = false
    }

    private func timeString(_ value: Int) -> String {
        String(format: "%02d:%02d", value / 60, value % 60)
    }
}