import Foundation
import Combine
import WatchConnectivity

final class FitnessCoachWatchConnectivity: NSObject, ObservableObject, WCSessionDelegate {
    static let shared = FitnessCoachWatchConnectivity()
    @Published private(set) var connected = false
    @Published var incomingCommand: String?

    private override init() { super.init() }

    func activate() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    func send(_ payload: [String: Any]) {
        let session = WCSession.default
        guard session.isReachable else { return }
        session.sendMessage(payload, replyHandler: nil)
    }

    func session(_ session: WCSession,
                 activationDidCompleteWith state: WCSessionActivationState,
                 error: Error?) {
        DispatchQueue.main.async {
            self.connected = state == .activated && session.isReachable
        }
    }

    func sessionReachabilityDidChange(_ session: WCSession) {
        DispatchQueue.main.async {
            self.connected = session.isReachable
        }
    }

    func session(_ session: WCSession,
                 didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            self.incomingCommand = message["command"] as? String
        }
    }
}