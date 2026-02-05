// WayGuard AI - Mock Data
// Indian Logistics Context

export type VehicleType = 'Truck' | 'Trailer' | 'Container' | 'Tanker' | 'Mini Truck';
export type InsuranceStatus = 'Active' | 'Expired' | 'Expiring Soon';
export type TripStatus = 'On Route' | 'Delayed' | 'At Destination' | 'Loading' | 'Unloading';
export type VerificationOutcome = 'Approved' | 'Blocked';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Vehicle {
  id: string;
  regNo: string;
  type: VehicleType;
  insuranceExpiry: string;
  insuranceStatus: InsuranceStatus;
  rcExpiry: string;
  permitExpiry: string;
  assignedDriver: string | null;
  isBlacklisted: boolean;
  riskLevel: RiskLevel;
  gstin: string;
  ownerName: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNo: string;
  licenseExpiry: string;
  phone: string;
  assignedVehicle: string | null;
  status: 'Active' | 'Inactive' | 'On Leave';
  aadharNo: string;
  address: string;
}

export interface Trip {
  id: string;
  vehicleNo: string;
  driverName: string;
  origin: string;
  destination: string;
  departureTime: string;
  eta: string;
  status: TripStatus;
  eWayBillNo: string;
  distance: number;
  progressPercent: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  vehicleNo: string;
  eWayBillNo: string;
  outcome: VerificationOutcome;
  operator: string;
  userIP: string;
  checks: {
    name: string;
    status: 'passed' | 'failed' | 'warning';
    details: string;
    timestamp: string;
  }[];
  errors?: string[];
  apiResponses?: {
    vahan: object;
    gst: object;
    insurance: object;
  };
}

export interface GateEvent {
  id: string;
  vehicleNo: string;
  outcome: VerificationOutcome;
  timestamp: string;
  eWayBillNo: string;
}

// Mock Vehicles (15+ entries)
export const vehicles: Vehicle[] = [
  {
    id: 'V001',
    regNo: 'TN-01-AB-1234',
    type: 'Truck',
    insuranceExpiry: '2025-08-15',
    insuranceStatus: 'Active',
    rcExpiry: '2027-03-20',
    permitExpiry: '2025-12-31',
    assignedDriver: 'D001',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '33AAAAA0000A1Z5',
    ownerName: 'Rajesh Transport Co.'
  },
  {
    id: 'V002',
    regNo: 'KA-05-MJ-5678',
    type: 'Container',
    insuranceExpiry: '2025-02-01',
    insuranceStatus: 'Expiring Soon',
    rcExpiry: '2026-11-10',
    permitExpiry: '2025-06-30',
    assignedDriver: 'D002',
    isBlacklisted: false,
    riskLevel: 'Medium',
    gstin: '29BBBBB1111B2Y6',
    ownerName: 'Karnataka Freight Ltd.'
  },
  {
    id: 'V003',
    regNo: 'MH-12-CD-9012',
    type: 'Tanker',
    insuranceExpiry: '2024-12-15',
    insuranceStatus: 'Expired',
    rcExpiry: '2025-09-25',
    permitExpiry: '2024-11-30',
    assignedDriver: 'D003',
    isBlacklisted: true,
    riskLevel: 'High',
    gstin: '27CCCCC2222C3X7',
    ownerName: 'Mumbai Tankers Pvt.'
  },
  {
    id: 'V004',
    regNo: 'TN-09-BE-3456',
    type: 'Trailer',
    insuranceExpiry: '2025-11-20',
    insuranceStatus: 'Active',
    rcExpiry: '2028-01-15',
    permitExpiry: '2026-03-31',
    assignedDriver: 'D004',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '33DDDDD3333D4W8',
    ownerName: 'SNR Logistics'
  },
  {
    id: 'V005',
    regNo: 'AP-16-EF-7890',
    type: 'Truck',
    insuranceExpiry: '2025-04-10',
    insuranceStatus: 'Active',
    rcExpiry: '2026-08-05',
    permitExpiry: '2025-09-30',
    assignedDriver: 'D005',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '37EEEEE4444E5V9',
    ownerName: 'Andhra Express'
  },
  {
    id: 'V006',
    regNo: 'GJ-01-GH-2345',
    type: 'Container',
    insuranceExpiry: '2025-01-28',
    insuranceStatus: 'Expiring Soon',
    rcExpiry: '2025-12-12',
    permitExpiry: '2025-05-15',
    assignedDriver: 'D006',
    isBlacklisted: false,
    riskLevel: 'Medium',
    gstin: '24FFFFF5555F6U0',
    ownerName: 'Gujarat Cargo Services'
  },
  {
    id: 'V007',
    regNo: 'RJ-14-IJ-6789',
    type: 'Mini Truck',
    insuranceExpiry: '2025-07-22',
    insuranceStatus: 'Active',
    rcExpiry: '2027-05-18',
    permitExpiry: '2026-01-31',
    assignedDriver: 'D007',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '08GGGGG6666G7T1',
    ownerName: 'Jaipur Movers'
  },
  {
    id: 'V008',
    regNo: 'DL-08-KL-1234',
    type: 'Truck',
    insuranceExpiry: '2024-11-30',
    insuranceStatus: 'Expired',
    rcExpiry: '2025-06-20',
    permitExpiry: '2024-10-15',
    assignedDriver: null,
    isBlacklisted: true,
    riskLevel: 'High',
    gstin: '07HHHHH7777H8S2',
    ownerName: 'Delhi Transport Union'
  },
  {
    id: 'V009',
    regNo: 'UP-32-MN-5678',
    type: 'Tanker',
    insuranceExpiry: '2025-09-05',
    insuranceStatus: 'Active',
    rcExpiry: '2027-02-28',
    permitExpiry: '2026-06-30',
    assignedDriver: 'D008',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '09IIIII8888I9R3',
    ownerName: 'Lucknow Fuels Ltd.'
  },
  {
    id: 'V010',
    regNo: 'WB-06-OP-9012',
    type: 'Trailer',
    insuranceExpiry: '2025-03-18',
    insuranceStatus: 'Active',
    rcExpiry: '2026-10-08',
    permitExpiry: '2025-08-31',
    assignedDriver: 'D009',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '19JJJJJ9999J0Q4',
    ownerName: 'Bengal Carriers'
  },
  {
    id: 'V011',
    regNo: 'TN-07-QR-3456',
    type: 'Truck',
    insuranceExpiry: '2025-06-25',
    insuranceStatus: 'Active',
    rcExpiry: '2027-04-12',
    permitExpiry: '2026-02-28',
    assignedDriver: 'D010',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '33KKKKK0000K1P5',
    ownerName: 'Chennai Freight'
  },
  {
    id: 'V012',
    regNo: 'KL-07-ST-7890',
    type: 'Container',
    insuranceExpiry: '2025-02-08',
    insuranceStatus: 'Expiring Soon',
    rcExpiry: '2026-07-30',
    permitExpiry: '2025-04-30',
    assignedDriver: 'D011',
    isBlacklisted: false,
    riskLevel: 'Medium',
    gstin: '32LLLLL1111L2O6',
    ownerName: 'Kochi Shipping Co.'
  },
  {
    id: 'V013',
    regNo: 'MP-09-UV-2345',
    type: 'Truck',
    insuranceExpiry: '2025-10-12',
    insuranceStatus: 'Active',
    rcExpiry: '2028-03-05',
    permitExpiry: '2026-07-31',
    assignedDriver: 'D012',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '23MMMMM2222M3N7',
    ownerName: 'Bhopal Logistics'
  },
  {
    id: 'V014',
    regNo: 'HR-26-WX-6789',
    type: 'Mini Truck',
    insuranceExpiry: '2024-12-20',
    insuranceStatus: 'Expired',
    rcExpiry: '2025-05-15',
    permitExpiry: '2024-09-30',
    assignedDriver: 'D013',
    isBlacklisted: false,
    riskLevel: 'High',
    gstin: '06NNNNN3333N4M8',
    ownerName: 'Gurgaon Express'
  },
  {
    id: 'V015',
    regNo: 'PB-10-YZ-1234',
    type: 'Tanker',
    insuranceExpiry: '2025-05-30',
    insuranceStatus: 'Active',
    rcExpiry: '2027-08-22',
    permitExpiry: '2026-04-30',
    assignedDriver: 'D014',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '03OOOOO4444O5L9',
    ownerName: 'Punjab Petroleum'
  },
  {
    id: 'V016',
    regNo: 'OR-02-AB-5678',
    type: 'Truck',
    insuranceExpiry: '2025-08-08',
    insuranceStatus: 'Active',
    rcExpiry: '2026-12-18',
    permitExpiry: '2025-11-30',
    assignedDriver: 'D015',
    isBlacklisted: false,
    riskLevel: 'Low',
    gstin: '21PPPPP5555P6K0',
    ownerName: 'Odisha Transport'
  },
];

// Mock Drivers
export const drivers: Driver[] = [
  {
    id: 'D001',
    name: 'Ramesh Kumar',
    licenseNo: 'TN-0120180012345',
    licenseExpiry: '2026-05-15',
    phone: '9876543210',
    assignedVehicle: 'TN-01-AB-1234',
    status: 'Active',
    aadharNo: '1234-5678-9012',
    address: 'Chennai, Tamil Nadu'
  },
  {
    id: 'D002',
    name: 'Suresh Gowda',
    licenseNo: 'KA-0520190023456',
    licenseExpiry: '2025-08-20',
    phone: '9876543211',
    assignedVehicle: 'KA-05-MJ-5678',
    status: 'Active',
    aadharNo: '2345-6789-0123',
    address: 'Bangalore, Karnataka'
  },
  {
    id: 'D003',
    name: 'Anil Patil',
    licenseNo: 'MH-1220170034567',
    licenseExpiry: '2024-12-10',
    phone: '9876543212',
    assignedVehicle: 'MH-12-CD-9012',
    status: 'Inactive',
    aadharNo: '3456-7890-1234',
    address: 'Pune, Maharashtra'
  },
  {
    id: 'D004',
    name: 'Venkat Rajan',
    licenseNo: 'TN-0920200045678',
    licenseExpiry: '2027-03-25',
    phone: '9876543213',
    assignedVehicle: 'TN-09-BE-3456',
    status: 'Active',
    aadharNo: '4567-8901-2345',
    address: 'Coimbatore, Tamil Nadu'
  },
  {
    id: 'D005',
    name: 'Krishna Reddy',
    licenseNo: 'AP-1620180056789',
    licenseExpiry: '2026-01-18',
    phone: '9876543214',
    assignedVehicle: 'AP-16-EF-7890',
    status: 'Active',
    aadharNo: '5678-9012-3456',
    address: 'Vijayawada, Andhra Pradesh'
  },
  {
    id: 'D006',
    name: 'Mukesh Patel',
    licenseNo: 'GJ-0120190067890',
    licenseExpiry: '2025-11-30',
    phone: '9876543215',
    assignedVehicle: 'GJ-01-GH-2345',
    status: 'Active',
    aadharNo: '6789-0123-4567',
    address: 'Ahmedabad, Gujarat'
  },
  {
    id: 'D007',
    name: 'Rajendra Singh',
    licenseNo: 'RJ-1420200078901',
    licenseExpiry: '2027-06-12',
    phone: '9876543216',
    assignedVehicle: 'RJ-14-IJ-6789',
    status: 'Active',
    aadharNo: '7890-1234-5678',
    address: 'Jaipur, Rajasthan'
  },
  {
    id: 'D008',
    name: 'Santosh Yadav',
    licenseNo: 'UP-3220180089012',
    licenseExpiry: '2026-04-08',
    phone: '9876543217',
    assignedVehicle: 'UP-32-MN-5678',
    status: 'Active',
    aadharNo: '8901-2345-6789',
    address: 'Lucknow, Uttar Pradesh'
  },
  {
    id: 'D009',
    name: 'Biswajit Das',
    licenseNo: 'WB-0620190090123',
    licenseExpiry: '2025-09-22',
    phone: '9876543218',
    assignedVehicle: 'WB-06-OP-9012',
    status: 'Active',
    aadharNo: '9012-3456-7890',
    address: 'Kolkata, West Bengal'
  },
  {
    id: 'D010',
    name: 'Muthu Selvam',
    licenseNo: 'TN-0720200101234',
    licenseExpiry: '2027-02-14',
    phone: '9876543219',
    assignedVehicle: 'TN-07-QR-3456',
    status: 'Active',
    aadharNo: '0123-4567-8901',
    address: 'Madurai, Tamil Nadu'
  },
  {
    id: 'D011',
    name: 'Joseph Thomas',
    licenseNo: 'KL-0720180112345',
    licenseExpiry: '2026-07-05',
    phone: '9876543220',
    assignedVehicle: 'KL-07-ST-7890',
    status: 'Active',
    aadharNo: '1234-5678-9013',
    address: 'Kochi, Kerala'
  },
  {
    id: 'D012',
    name: 'Ashok Sharma',
    licenseNo: 'MP-0920190123456',
    licenseExpiry: '2025-10-28',
    phone: '9876543221',
    assignedVehicle: 'MP-09-UV-2345',
    status: 'Active',
    aadharNo: '2345-6789-0124',
    address: 'Bhopal, Madhya Pradesh'
  },
  {
    id: 'D013',
    name: 'Vikram Rana',
    licenseNo: 'HR-2620200134567',
    licenseExpiry: '2027-01-20',
    phone: '9876543222',
    assignedVehicle: 'HR-26-WX-6789',
    status: 'On Leave',
    aadharNo: '3456-7890-1235',
    address: 'Gurgaon, Haryana'
  },
  {
    id: 'D014',
    name: 'Gurpreet Singh',
    licenseNo: 'PB-1020180145678',
    licenseExpiry: '2026-08-15',
    phone: '9876543223',
    assignedVehicle: 'PB-10-YZ-1234',
    status: 'Active',
    aadharNo: '4567-8901-2346',
    address: 'Ludhiana, Punjab'
  },
  {
    id: 'D015',
    name: 'Prakash Mohanty',
    licenseNo: 'OR-0220190156789',
    licenseExpiry: '2025-12-08',
    phone: '9876543224',
    assignedVehicle: 'OR-02-AB-5678',
    status: 'Active',
    aadharNo: '5678-9012-3457',
    address: 'Bhubaneswar, Odisha'
  },
];

// Mock Active Trips (15+ entries)
export const trips: Trip[] = [
  {
    id: 'T001',
    vehicleNo: 'TN-01-AB-1234',
    driverName: 'Ramesh Kumar',
    origin: 'Chennai',
    destination: 'Bangalore',
    departureTime: '2025-02-05T06:00:00',
    eta: '2025-02-05T14:30:00',
    status: 'On Route',
    eWayBillNo: '331000000001',
    distance: 350,
    progressPercent: 65
  },
  {
    id: 'T002',
    vehicleNo: 'KA-05-MJ-5678',
    driverName: 'Suresh Gowda',
    origin: 'Bangalore',
    destination: 'Hyderabad',
    departureTime: '2025-02-05T04:30:00',
    eta: '2025-02-05T16:00:00',
    status: 'Delayed',
    eWayBillNo: '291000000002',
    distance: 570,
    progressPercent: 40
  },
  {
    id: 'T003',
    vehicleNo: 'TN-09-BE-3456',
    driverName: 'Venkat Rajan',
    origin: 'Coimbatore',
    destination: 'Kochi',
    departureTime: '2025-02-05T07:00:00',
    eta: '2025-02-05T13:00:00',
    status: 'On Route',
    eWayBillNo: '331000000003',
    distance: 190,
    progressPercent: 78
  },
  {
    id: 'T004',
    vehicleNo: 'AP-16-EF-7890',
    driverName: 'Krishna Reddy',
    origin: 'Vijayawada',
    destination: 'Chennai',
    departureTime: '2025-02-05T05:00:00',
    eta: '2025-02-05T15:00:00',
    status: 'On Route',
    eWayBillNo: '371000000004',
    distance: 450,
    progressPercent: 55
  },
  {
    id: 'T005',
    vehicleNo: 'GJ-01-GH-2345',
    driverName: 'Mukesh Patel',
    origin: 'Ahmedabad',
    destination: 'Mumbai',
    departureTime: '2025-02-05T03:00:00',
    eta: '2025-02-05T12:00:00',
    status: 'At Destination',
    eWayBillNo: '241000000005',
    distance: 530,
    progressPercent: 100
  },
  {
    id: 'T006',
    vehicleNo: 'RJ-14-IJ-6789',
    driverName: 'Rajendra Singh',
    origin: 'Jaipur',
    destination: 'Delhi',
    departureTime: '2025-02-05T08:00:00',
    eta: '2025-02-05T14:00:00',
    status: 'On Route',
    eWayBillNo: '081000000006',
    distance: 280,
    progressPercent: 30
  },
  {
    id: 'T007',
    vehicleNo: 'UP-32-MN-5678',
    driverName: 'Santosh Yadav',
    origin: 'Lucknow',
    destination: 'Kanpur',
    departureTime: '2025-02-05T09:00:00',
    eta: '2025-02-05T11:30:00',
    status: 'On Route',
    eWayBillNo: '091000000007',
    distance: 80,
    progressPercent: 85
  },
  {
    id: 'T008',
    vehicleNo: 'WB-06-OP-9012',
    driverName: 'Biswajit Das',
    origin: 'Kolkata',
    destination: 'Bhubaneswar',
    departureTime: '2025-02-05T02:00:00',
    eta: '2025-02-05T11:00:00',
    status: 'Delayed',
    eWayBillNo: '191000000008',
    distance: 440,
    progressPercent: 60
  },
  {
    id: 'T009',
    vehicleNo: 'TN-07-QR-3456',
    driverName: 'Muthu Selvam',
    origin: 'Madurai',
    destination: 'Trichy',
    departureTime: '2025-02-05T10:00:00',
    eta: '2025-02-05T13:00:00',
    status: 'On Route',
    eWayBillNo: '331000000009',
    distance: 140,
    progressPercent: 45
  },
  {
    id: 'T010',
    vehicleNo: 'KL-07-ST-7890',
    driverName: 'Joseph Thomas',
    origin: 'Kochi',
    destination: 'Trivandrum',
    departureTime: '2025-02-05T06:30:00',
    eta: '2025-02-05T12:30:00',
    status: 'On Route',
    eWayBillNo: '321000000010',
    distance: 220,
    progressPercent: 70
  },
  {
    id: 'T011',
    vehicleNo: 'MP-09-UV-2345',
    driverName: 'Ashok Sharma',
    origin: 'Bhopal',
    destination: 'Indore',
    departureTime: '2025-02-05T07:30:00',
    eta: '2025-02-05T11:30:00',
    status: 'At Destination',
    eWayBillNo: '231000000011',
    distance: 195,
    progressPercent: 100
  },
  {
    id: 'T012',
    vehicleNo: 'PB-10-YZ-1234',
    driverName: 'Gurpreet Singh',
    origin: 'Ludhiana',
    destination: 'Chandigarh',
    departureTime: '2025-02-05T11:00:00',
    eta: '2025-02-05T13:00:00',
    status: 'Loading',
    eWayBillNo: '031000000012',
    distance: 100,
    progressPercent: 0
  },
  {
    id: 'T013',
    vehicleNo: 'OR-02-AB-5678',
    driverName: 'Prakash Mohanty',
    origin: 'Bhubaneswar',
    destination: 'Visakhapatnam',
    departureTime: '2025-02-05T04:00:00',
    eta: '2025-02-05T14:00:00',
    status: 'On Route',
    eWayBillNo: '211000000013',
    distance: 440,
    progressPercent: 50
  },
  {
    id: 'T014',
    vehicleNo: 'TN-01-AB-1234',
    driverName: 'Ramesh Kumar',
    origin: 'Salem',
    destination: 'Erode',
    departureTime: '2025-02-04T22:00:00',
    eta: '2025-02-05T02:00:00',
    status: 'At Destination',
    eWayBillNo: '331000000014',
    distance: 95,
    progressPercent: 100
  },
  {
    id: 'T015',
    vehicleNo: 'GJ-01-GH-2345',
    driverName: 'Mukesh Patel',
    origin: 'Surat',
    destination: 'Vadodara',
    departureTime: '2025-02-05T12:00:00',
    eta: '2025-02-05T15:00:00',
    status: 'Loading',
    eWayBillNo: '241000000015',
    distance: 140,
    progressPercent: 0
  },
  {
    id: 'T016',
    vehicleNo: 'KA-05-MJ-5678',
    driverName: 'Suresh Gowda',
    origin: 'Mysore',
    destination: 'Mangalore',
    departureTime: '2025-02-05T01:00:00',
    eta: '2025-02-05T08:00:00',
    status: 'Unloading',
    eWayBillNo: '291000000016',
    distance: 260,
    progressPercent: 100
  },
];

// Mock Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: 'A001',
    timestamp: '2025-02-05T08:45:23',
    vehicleNo: 'TN-01-AB-1234',
    eWayBillNo: '331000000001',
    outcome: 'Approved',
    operator: 'Admin User',
    userIP: '192.168.1.105',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active, Valid until 2027-03-20', timestamp: '2025-02-05T08:45:24' },
      { name: 'Insurance Verification', status: 'passed', details: 'Policy Active, Expires 2025-08-15', timestamp: '2025-02-05T08:45:25' },
      { name: 'GSTIN Validation', status: 'passed', details: 'GSTIN 33AAAAA0000A1Z5 - Active', timestamp: '2025-02-05T08:45:26' },
      { name: 'E-Way Bill Validation', status: 'passed', details: 'E-Way Bill Valid, Distance: 350km', timestamp: '2025-02-05T08:45:27' },
      { name: 'Route Distance Check', status: 'passed', details: 'PIN Code Gap: 3.2% (Within limits)', timestamp: '2025-02-05T08:45:28' },
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2027-03-20', ownerName: 'Rajesh Transport Co.' },
      gst: { gstin: '33AAAAA0000A1Z5', status: 'Active', legalName: 'Rajesh Transport Co.' },
      insurance: { policyNo: 'INS-2024-001234', validUntil: '2025-08-15', insurer: 'New India Assurance' }
    }
  },
  {
    id: 'A002',
    timestamp: '2025-02-05T07:30:15',
    vehicleNo: 'MH-12-CD-9012',
    eWayBillNo: '271000000002',
    outcome: 'Blocked',
    operator: 'Gate Operator 1',
    userIP: '192.168.1.112',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-05T07:30:16' },
      { name: 'Insurance Verification', status: 'failed', details: 'Policy Expired on 2024-12-15', timestamp: '2025-02-05T07:30:17' },
      { name: 'GSTIN Validation', status: 'warning', details: 'GSTIN 27CCCCC2222C3X7 - Under Review', timestamp: '2025-02-05T07:30:18' },
    ],
    errors: [
      'Insurance Expired 52 days ago',
      'GSTIN Status: Under Review - Potential compliance issue'
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2025-09-25' },
      gst: { gstin: '27CCCCC2222C3X7', status: 'Under Review' },
      insurance: { policyNo: 'INS-2023-098765', validUntil: '2024-12-15', insurer: 'ICICI Lombard' }
    }
  },
  {
    id: 'A003',
    timestamp: '2025-02-05T06:15:42',
    vehicleNo: 'KA-05-MJ-5678',
    eWayBillNo: '291000000016',
    outcome: 'Approved',
    operator: 'Gate Operator 2',
    userIP: '192.168.1.118',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-05T06:15:43' },
      { name: 'Insurance Verification', status: 'warning', details: 'Policy Expiring Soon - 2025-02-01', timestamp: '2025-02-05T06:15:44' },
      { name: 'GSTIN Validation', status: 'passed', details: 'GSTIN Active', timestamp: '2025-02-05T06:15:45' },
      { name: 'E-Way Bill Validation', status: 'passed', details: 'E-Way Bill Valid', timestamp: '2025-02-05T06:15:46' },
      { name: 'Route Distance Check', status: 'passed', details: 'PIN Code Gap: 5.1% (Within limits)', timestamp: '2025-02-05T06:15:47' },
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2026-11-10' },
      gst: { gstin: '29BBBBB1111B2Y6', status: 'Active' },
      insurance: { policyNo: 'INS-2024-567890', validUntil: '2025-02-01', insurer: 'Bajaj Allianz' }
    }
  },
  {
    id: 'A004',
    timestamp: '2025-02-05T05:00:08',
    vehicleNo: 'DL-08-KL-1234',
    eWayBillNo: '071000000017',
    outcome: 'Blocked',
    operator: 'Night Shift Operator',
    userIP: '192.168.1.125',
    checks: [
      { name: 'Blacklist Check', status: 'failed', details: 'Vehicle is Blacklisted', timestamp: '2025-02-05T05:00:09' },
    ],
    errors: [
      'Vehicle DL-08-KL-1234 is on the blacklist',
      'Dispatch automatically blocked - No further checks performed'
    ],
    apiResponses: {
      vahan: {},
      gst: {},
      insurance: {}
    }
  },
  {
    id: 'A005',
    timestamp: '2025-02-04T22:30:55',
    vehicleNo: 'TN-09-BE-3456',
    eWayBillNo: '331000000003',
    outcome: 'Approved',
    operator: 'Admin User',
    userIP: '192.168.1.105',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-04T22:30:56' },
      { name: 'Insurance Verification', status: 'passed', details: 'Policy Active', timestamp: '2025-02-04T22:30:57' },
      { name: 'GSTIN Validation', status: 'passed', details: 'GSTIN Active', timestamp: '2025-02-04T22:30:58' },
      { name: 'E-Way Bill Validation', status: 'passed', details: 'E-Way Bill Valid', timestamp: '2025-02-04T22:30:59' },
      { name: 'Route Distance Check', status: 'passed', details: 'PIN Code Gap: 2.8%', timestamp: '2025-02-04T22:31:00' },
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2028-01-15' },
      gst: { gstin: '33DDDDD3333D4W8', status: 'Active' },
      insurance: { policyNo: 'INS-2024-345678', validUntil: '2025-11-20', insurer: 'HDFC Ergo' }
    }
  },
  {
    id: 'A006',
    timestamp: '2025-02-04T18:45:12',
    vehicleNo: 'HR-26-WX-6789',
    eWayBillNo: '061000000018',
    outcome: 'Blocked',
    operator: 'Gate Operator 1',
    userIP: '192.168.1.112',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-04T18:45:13' },
      { name: 'Insurance Verification', status: 'failed', details: 'Policy Expired on 2024-12-20', timestamp: '2025-02-04T18:45:14' },
      { name: 'Permit Verification', status: 'failed', details: 'Permit Expired on 2024-09-30', timestamp: '2025-02-04T18:45:15' },
    ],
    errors: [
      'Insurance Expired 47 days ago',
      'National Permit Expired 128 days ago'
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2025-05-15' },
      gst: { gstin: '06NNNNN3333N4M8', status: 'Active' },
      insurance: { policyNo: 'INS-2023-111222', validUntil: '2024-12-20', insurer: 'Oriental Insurance' }
    }
  },
  {
    id: 'A007',
    timestamp: '2025-02-04T15:20:33',
    vehicleNo: 'AP-16-EF-7890',
    eWayBillNo: '371000000004',
    outcome: 'Approved',
    operator: 'Gate Operator 2',
    userIP: '192.168.1.118',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-04T15:20:34' },
      { name: 'Insurance Verification', status: 'passed', details: 'Policy Active', timestamp: '2025-02-04T15:20:35' },
      { name: 'GSTIN Validation', status: 'passed', details: 'GSTIN Active', timestamp: '2025-02-04T15:20:36' },
      { name: 'E-Way Bill Validation', status: 'passed', details: 'E-Way Bill Valid', timestamp: '2025-02-04T15:20:37' },
      { name: 'Route Distance Check', status: 'passed', details: 'PIN Code Gap: 4.5%', timestamp: '2025-02-04T15:20:38' },
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2026-08-05' },
      gst: { gstin: '37EEEEE4444E5V9', status: 'Active' },
      insurance: { policyNo: 'INS-2024-789012', validUntil: '2025-04-10', insurer: 'United India Insurance' }
    }
  },
  {
    id: 'A008',
    timestamp: '2025-02-04T12:10:45',
    vehicleNo: 'GJ-01-GH-2345',
    eWayBillNo: '241000000005',
    outcome: 'Approved',
    operator: 'Admin User',
    userIP: '192.168.1.105',
    checks: [
      { name: 'Vahan API Verification', status: 'passed', details: 'RC Status: Active', timestamp: '2025-02-04T12:10:46' },
      { name: 'Insurance Verification', status: 'warning', details: 'Policy Expiring Soon', timestamp: '2025-02-04T12:10:47' },
      { name: 'GSTIN Validation', status: 'passed', details: 'GSTIN Active', timestamp: '2025-02-04T12:10:48' },
      { name: 'E-Way Bill Validation', status: 'passed', details: 'E-Way Bill Valid', timestamp: '2025-02-04T12:10:49' },
      { name: 'Route Distance Check', status: 'passed', details: 'PIN Code Gap: 1.2%', timestamp: '2025-02-04T12:10:50' },
    ],
    apiResponses: {
      vahan: { status: 'active', rcValidUntil: '2025-12-12' },
      gst: { gstin: '24FFFFF5555F6U0', status: 'Active' },
      insurance: { policyNo: 'INS-2024-234567', validUntil: '2025-01-28', insurer: 'Tata AIG' }
    }
  },
];

// Recent Gate Events for Live Feed
export const gateEvents: GateEvent[] = [
  { id: 'G001', vehicleNo: 'TN-01-AB-1234', outcome: 'Approved', timestamp: '2025-02-05T08:45:23', eWayBillNo: '331000000001' },
  { id: 'G002', vehicleNo: 'MH-12-CD-9012', outcome: 'Blocked', timestamp: '2025-02-05T07:30:15', eWayBillNo: '271000000002' },
  { id: 'G003', vehicleNo: 'KA-05-MJ-5678', outcome: 'Approved', timestamp: '2025-02-05T06:15:42', eWayBillNo: '291000000016' },
  { id: 'G004', vehicleNo: 'DL-08-KL-1234', outcome: 'Blocked', timestamp: '2025-02-05T05:00:08', eWayBillNo: '071000000017' },
  { id: 'G005', vehicleNo: 'TN-09-BE-3456', outcome: 'Approved', timestamp: '2025-02-04T22:30:55', eWayBillNo: '331000000003' },
  { id: 'G006', vehicleNo: 'HR-26-WX-6789', outcome: 'Blocked', timestamp: '2025-02-04T18:45:12', eWayBillNo: '061000000018' },
  { id: 'G007', vehicleNo: 'AP-16-EF-7890', outcome: 'Approved', timestamp: '2025-02-04T15:20:33', eWayBillNo: '371000000004' },
  { id: 'G008', vehicleNo: 'GJ-01-GH-2345', outcome: 'Approved', timestamp: '2025-02-04T12:10:45', eWayBillNo: '241000000005' },
  { id: 'G009', vehicleNo: 'WB-06-OP-9012', outcome: 'Approved', timestamp: '2025-02-04T09:55:18', eWayBillNo: '191000000008' },
  { id: 'G010', vehicleNo: 'RJ-14-IJ-6789', outcome: 'Approved', timestamp: '2025-02-04T08:20:30', eWayBillNo: '081000000006' },
];

// Dashboard KPI Data
export const dashboardKPIs = {
  riskScore: {
    value: 'Medium',
    numericValue: 42,
    trend: '+5%',
    description: 'Based on fleet compliance status'
  },
  activeBlocks: {
    value: 3,
    trend: '-2',
    description: 'Trucks stopped today'
  },
  savedPenalties: {
    value: 245000,
    trend: '+18%',
    description: 'Estimated ₹ saved this month'
  },
  complianceRate: {
    value: 94.5,
    trend: '+2.3%',
    description: 'Pass rate this week'
  }
};

// Weekly Trend Data for Chart
export const weeklyTrendData = [
  { day: 'Mon', passed: 45, blocked: 3 },
  { day: 'Tue', passed: 52, blocked: 5 },
  { day: 'Wed', passed: 48, blocked: 2 },
  { day: 'Thu', passed: 61, blocked: 4 },
  { day: 'Fri', passed: 55, blocked: 6 },
  { day: 'Sat', passed: 38, blocked: 2 },
  { day: 'Sun', passed: 22, blocked: 1 },
];
