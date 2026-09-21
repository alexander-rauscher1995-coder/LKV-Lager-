import Foundation
import HealthKit

final class FitnessCoachWorkoutManager: NSObject, ObservableObject {
    private let healthStore = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?

    @Published private(set) var running = false
    @Published private(set) var heartRate: Double?
    @Published private(set) var activeCalories = 0.0

    func requestAuthorization() async {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        let workout = HKObjectType.workoutType()
        let heartRate = HKObjectType.quantityType(forIdentifier: .heartRate)!
        let energy = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!
        do {
            try await healthStore.requestAuthorization(toShare: [workout], read: [heartRate, energy])
        } catch {}
    }

    func start() {
        guard !running else { return }
        let config = HKWorkoutConfiguration()
        config.activityType = .traditionalStrengthTraining
        config.locationType = .indoor
        do {
            let newSession = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            let newBuilder = newSession.associatedWorkoutBuilder()
            newSession.delegate = self
            newBuilder.delegate = self
            newBuilder.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore, workoutConfiguration: config)
            session = newSession
            builder = newBuilder
            newSession.startActivity(with: Date())
            newBuilder.beginCollection(withStart: Date()) { _, _ in }
            DispatchQueue.main.async { self.running = true }
        } catch {}
    }

    func stop() {
        guard let session, let builder else { return }
        session.end()
        builder.endCollection(withEnd: Date()) { _, _ in
            builder.finishWorkout { _, _ in
                DispatchQueue.main.async {
                    self.running = false
                    self.session = nil
                    self.builder = nil
                }
            }
        }
    }
}

extension FitnessCoachWorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        DispatchQueue.main.async { self.running = toState == .running }
    }
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        DispatchQueue.main.async { self.running = false }
    }
}

extension FitnessCoachWorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf types: Set<HKSampleType>) {
        for type in types {
            guard let quantityType = type as? HKQuantityType,
                  let statistics = workoutBuilder.statistics(for: quantityType) else { continue }
            if quantityType.identifier == HKQuantityTypeIdentifier.heartRate.rawValue {
                let unit = HKUnit.count().unitDivided(by: .minute())
                if let value = statistics.mostRecentQuantity()?.doubleValue(for: unit) {
                    DispatchQueue.main.async { self.heartRate = value }
                }
            }
            if quantityType.identifier == HKQuantityTypeIdentifier.activeEnergyBurned.rawValue {
                if let value = statistics.sumQuantity()?.doubleValue(for: .kilocalorie()) {
                    DispatchQueue.main.async { self.activeCalories = value }
                }
            }
        }
    }
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}
}