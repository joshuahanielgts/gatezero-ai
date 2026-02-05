// Simulates live data updates for demo purposes
import { GateEvent, Trip, vehicles, trips as baseTrips, gateEvents as baseEvents } from "./mockData";

const vehicleNumbers = vehicles.map(v => v.regNo);

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEWayBill(): string {
  const prefix = randomElement(['33', '29', '27', '37', '24', '08', '09', '19']);
  return prefix + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
}

// Generate a new gate event with current timestamp
export function generateNewGateEvent(): GateEvent {
  const outcome = Math.random() > 0.15 ? 'Approved' : 'Blocked';
  return {
    id: `G${Date.now()}`,
    vehicleNo: randomElement(vehicleNumbers),
    outcome,
    timestamp: new Date().toISOString(),
    eWayBillNo: generateEWayBill(),
  };
}

// Get updated gate events with possibility of new event
export function getUpdatedGateEvents(currentEvents: GateEvent[]): GateEvent[] {
  // 40% chance of new event on each refresh
  if (Math.random() > 0.6) {
    const newEvent = generateNewGateEvent();
    return [newEvent, ...currentEvents.slice(0, 9)];
  }
  return currentEvents;
}

// Update trip progress realistically
export function getUpdatedTrips(currentTrips: Trip[]): Trip[] {
  return currentTrips.map(trip => {
    let newProgress = trip.progressPercent;
    let newStatus = trip.status;

    // Update progress for active trips
    if (trip.status === 'On Route' || trip.status === 'Delayed') {
      // Add 1-5% progress
      newProgress = Math.min(100, trip.progressPercent + Math.floor(Math.random() * 5) + 1);
      
      // Mark as arrived if 100%
      if (newProgress >= 100) {
        newStatus = 'At Destination';
        newProgress = 100;
      }
      // Small chance of becoming delayed
      else if (trip.status === 'On Route' && Math.random() < 0.05) {
        newStatus = 'Delayed';
      }
    }
    // Loading trips may start moving
    else if (trip.status === 'Loading' && Math.random() < 0.2) {
      newStatus = 'On Route';
      newProgress = 5;
    }
    // Unloading trips may complete
    else if (trip.status === 'Unloading' && Math.random() < 0.15) {
      newStatus = 'At Destination';
    }

    return {
      ...trip,
      progressPercent: newProgress,
      status: newStatus,
    };
  });
}

// Initialize with base data
let currentGateEvents = [...baseEvents];
let currentTrips = [...baseTrips];

export function getLiveGateEvents(): GateEvent[] {
  currentGateEvents = getUpdatedGateEvents(currentGateEvents);
  return currentGateEvents;
}

export function getLiveTrips(): Trip[] {
  currentTrips = getUpdatedTrips(currentTrips);
  return currentTrips;
}

// Reset to base data
export function resetLiveData() {
  currentGateEvents = [...baseEvents];
  currentTrips = [...baseTrips];
}
