import Foundation
import HealthKit
import Combine

@MainActor
final class HealthKitManager: ObservableObject {
    private let store = HKHealthStore()

    @Published var steps = 0
    @Published var activeCalories = 0
    @Published var heartRate: Double?

    var heartRateText: String {
        guard let heartRate else { return "Herzfrequenz –" }
        return "\(Int(heartRate.rounded())) BPM"
    }

    func requestAuthorization() async {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        let read: Set<HKObjectType> = [
            HKObjectType.quantityType(forIdentifier: .stepCount)!,
            HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
            HKObjectType.quantityType(forIdentifier: .heartRate)!
        ]
        do {
            try await store.requestAuthorization(toShare: [], read: read)
            await refresh()
        } catch {
            // Permission can be changed later in Apple Health settings.
        }
    }

    func refresh() async {
        steps = await querySum(.stepCount, unit: .count())
        activeCalories = Int(await querySum(.activeEnergyBurned, unit: .kilocalorie()).rounded())
        heartRate = await queryLatestHeartRate()
    }

    private func querySum(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit) async -> Double {
        guard let type = HKObjectType.quantityType(forIdentifier: identifier) else { return 0 }
        return await withCheckedContinuation { continuation in
            let start = Calendar.current.startOfDay(for: Date())
            let predicate = HKQuery.predicateForSamples(withStart: start, end: Date())
            let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate,
                                          options: .cumulativeSum) { _, stats, _ in
                continuation.resume(returning: stats?.sumQuantity()?.doubleValue(for: unit) ?? 0)
            }
            store.execute(query)
        }
    }

    private func queryLatestHeartRate() async -> Double? {
        guard let type = HKObjectType.quantityType(forIdentifier: .heartRate) else { return nil }
        return await withCheckedContinuation { continuation in
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
            let query = HKSampleQuery(sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
                let value = (samples?.first as? HKQuantitySample)?.quantity.doubleValue(
                    for: HKUnit.count().unitDivided(by: .minute())
                )
                continuation.resume(returning: value)
            }
            store.execute(query)
        }
    }
}
