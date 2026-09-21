import Foundation
import Combine
import WatchConnectivity

@MainActor
final class WatchConnectivityManager: NSObject, ObservableObject, WCSessionDelegate {
    @Published private(set) var isReachable = false
    @Published private(set) var lastWatchEvent = "Noch kein Watch-Ereignis"

    func activate() {
        guard WCSession.isSupported() else { return }
        let session = WCSession.default
        session.delegate = self
        session.activate()
        isReachable = session.isReachable
    }

    func send(command: String) {
        let session = WCSession.default
        guard session.isReachable else { return }
        session.sendMessage(["command": command], replyHandler: nil)
    }

    nonisolated func session(_ session: WCSession,
                             activationDidCompleteWith state: WCSessionActivationState,
                             error: Error?) {
        Task { @MainActor in
            self.isReachable = state == .activated && session.isReachable
        }
    }

    nonisolated func sessionReachabilityDidChange(_ session: WCSession) {
        Task { @MainActor in
            self.isReachable = session.isReachable
        }
    }

    nonisolated func session(_ session: WCSession,
                             didReceiveMessage message: [String: Any]) {
        let event = message["event"] as? String
        Task { @MainActor in
            if let event {
                self.lastWatchEvent = event == "trainingStarted"
                    ? "Training auf der Watch gestartet"
                    : event == "trainingFinished"
                    ? "Training auf der Watch beendet"
                    : event
            }
        }
    }
}