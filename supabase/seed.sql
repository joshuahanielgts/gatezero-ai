-- GateZero - Seed Data for Development
-- Run this after schema.sql to populate test data

-- =====================================================
-- SEED VEHICLES (16 entries)
-- =====================================================

INSERT INTO vehicles (vehicle_no, owner_name, vehicle_type, rc_status, rc_expiry, insurance_expiry, insurance_policy_no, insurer_name, permit_expiry, gstin, is_blacklisted, blacklist_reason, risk_score) VALUES
('TN-01-AB-1234', 'Rajesh Transport Co.', 'Truck', 'Active', '2027-03-20', '2025-08-15', 'INS-2024-001234', 'New India Assurance', '2025-12-31', '33AAAAA0000A1Z5', false, NULL, 15),
('KA-05-MJ-5678', 'Karnataka Freight Ltd.', 'Container', 'Active', '2026-11-10', '2025-02-01', 'INS-2024-567890', 'Bajaj Allianz', '2025-06-30', '29BBBBB1111B2Y6', false, NULL, 45),
('MH-12-CD-9012', 'Mumbai Tankers Pvt.', 'Tanker', 'Active', '2025-09-25', '2024-12-15', 'INS-2023-098765', 'ICICI Lombard', '2024-11-30', '27CCCCC2222C3X7', true, 'Multiple violations - Insurance expired', 85),
('TN-09-BE-3456', 'SNR Logistics', 'Trailer', 'Active', '2028-01-15', '2025-11-20', 'INS-2024-345678', 'HDFC Ergo', '2026-03-31', '33DDDDD3333D4W8', false, NULL, 10),
('AP-16-EF-7890', 'Andhra Express', 'Truck', 'Active', '2026-08-05', '2025-04-10', 'INS-2024-789012', 'United India Insurance', '2025-09-30', '37EEEEE4444E5V9', false, NULL, 20),
('GJ-01-GH-2345', 'Gujarat Cargo Services', 'Container', 'Active', '2025-12-12', '2025-01-28', 'INS-2024-234567', 'Tata AIG', '2025-05-15', '24FFFFF5555F6U0', false, NULL, 35),
('RJ-14-IJ-6789', 'Jaipur Movers', 'Mini Truck', 'Active', '2027-05-18', '2025-07-22', NULL, NULL, '2026-01-31', '08GGGGG6666G7T1', false, NULL, 15),
('DL-08-KL-1234', 'Delhi Transport Union', 'Truck', 'Expired', '2025-06-20', '2024-11-30', NULL, NULL, '2024-10-15', '07HHHHH7777H8S2', true, 'RC Expired - Pending renewal', 90),
('UP-32-MN-5678', 'Lucknow Fuels Ltd.', 'Tanker', 'Active', '2027-02-28', '2025-09-05', NULL, NULL, '2026-06-30', '09IIIII8888I9R3', false, NULL, 20),
('WB-06-OP-9012', 'Bengal Carriers', 'Trailer', 'Active', '2026-10-08', '2025-03-18', NULL, NULL, '2025-08-31', '19JJJJJ9999J0Q4', false, NULL, 25),
('TN-07-QR-3456', 'Chennai Freight', 'Truck', 'Active', '2027-04-12', '2025-06-25', NULL, NULL, '2026-02-28', '33KKKKK0000K1P5', false, NULL, 15),
('KL-07-ST-7890', 'Kochi Shipping Co.', 'Container', 'Active', '2026-07-30', '2025-02-08', NULL, NULL, '2025-04-30', '32LLLLL1111L2O6', false, NULL, 40),
('MP-09-UV-2345', 'Bhopal Logistics', 'Truck', 'Active', '2028-03-05', '2025-10-12', NULL, NULL, '2026-07-31', '23MMMMM2222M3N7', false, NULL, 15),
('HR-26-WX-6789', 'Gurgaon Express', 'Mini Truck', 'Active', '2025-05-15', '2024-12-20', 'INS-2023-111222', 'Oriental Insurance', '2024-09-30', '06NNNNN3333N4M8', false, NULL, 70),
('PB-10-YZ-1234', 'Punjab Petroleum', 'Tanker', 'Active', '2027-08-22', '2025-05-30', NULL, NULL, '2026-04-30', '03OOOOO4444O5L9', false, NULL, 15),
('OR-02-AB-5678', 'Odisha Transport', 'Truck', 'Active', '2026-12-18', '2025-08-08', NULL, NULL, '2025-11-30', '21PPPPP5555P6K0', false, NULL, 20);

-- =====================================================
-- SEED DRIVERS (15 entries)
-- =====================================================

INSERT INTO drivers (name, license_no, license_expiry, phone, aadhar_no, address, status, assigned_vehicle_no) VALUES
('Ramesh Kumar', 'TN-0120180012345', '2026-05-15', '9876543210', '1234-5678-9012', 'Chennai, Tamil Nadu', 'Active', 'TN-01-AB-1234'),
('Suresh Gowda', 'KA-0520190023456', '2025-08-20', '9876543211', '2345-6789-0123', 'Bangalore, Karnataka', 'Active', 'KA-05-MJ-5678'),
('Anil Patil', 'MH-1220170034567', '2024-12-10', '9876543212', '3456-7890-1234', 'Pune, Maharashtra', 'Inactive', 'MH-12-CD-9012'),
('Venkat Rajan', 'TN-0920200045678', '2027-03-25', '9876543213', '4567-8901-2345', 'Coimbatore, Tamil Nadu', 'Active', 'TN-09-BE-3456'),
('Krishna Reddy', 'AP-1620180056789', '2026-01-18', '9876543214', '5678-9012-3456', 'Vijayawada, Andhra Pradesh', 'Active', 'AP-16-EF-7890'),
('Mukesh Patel', 'GJ-0120190067890', '2025-11-30', '9876543215', '6789-0123-4567', 'Ahmedabad, Gujarat', 'Active', 'GJ-01-GH-2345'),
('Rajendra Singh', 'RJ-1420200078901', '2027-06-12', '9876543216', '7890-1234-5678', 'Jaipur, Rajasthan', 'Active', 'RJ-14-IJ-6789'),
('Santosh Yadav', 'UP-3220180089012', '2026-04-08', '9876543217', '8901-2345-6789', 'Lucknow, Uttar Pradesh', 'Active', 'UP-32-MN-5678'),
('Biswajit Das', 'WB-0620190090123', '2025-09-22', '9876543218', '9012-3456-7890', 'Kolkata, West Bengal', 'Active', 'WB-06-OP-9012'),
('Muthu Selvam', 'TN-0720200101234', '2027-02-14', '9876543219', '0123-4567-8901', 'Madurai, Tamil Nadu', 'Active', 'TN-07-QR-3456'),
('Joseph Thomas', 'KL-0720180112345', '2026-07-05', '9876543220', '1234-5678-9013', 'Kochi, Kerala', 'Active', 'KL-07-ST-7890'),
('Ashok Sharma', 'MP-0920190123456', '2025-10-28', '9876543221', '2345-6789-0124', 'Bhopal, Madhya Pradesh', 'Active', 'MP-09-UV-2345'),
('Vikram Rana', 'HR-2620200134567', '2027-01-20', '9876543222', '3456-7890-1235', 'Gurgaon, Haryana', 'On Leave', 'HR-26-WX-6789'),
('Gurpreet Singh', 'PB-1020180145678', '2026-08-15', '9876543223', '4567-8901-2346', 'Ludhiana, Punjab', 'Active', 'PB-10-YZ-1234'),
('Prakash Mohanty', 'OR-0220190156789', '2025-12-08', '9876543224', '5678-9012-3457', 'Bhubaneswar, Odisha', 'Active', 'OR-02-AB-5678');

-- =====================================================
-- SEED LIVE TRIPS (5 entries)
-- =====================================================

INSERT INTO live_trips (vehicle_no, driver_id, eway_bill_no, origin, destination, departure_time, eta, status, distance_km, progress_percent) 
SELECT 
  'TN-01-AB-1234',
  (SELECT id FROM drivers WHERE assigned_vehicle_no = 'TN-01-AB-1234'),
  '331000000001',
  'Chennai',
  'Bangalore',
  NOW() - INTERVAL '4 hours',
  NOW() + INTERVAL '4 hours',
  'On Route',
  350,
  65;

INSERT INTO live_trips (vehicle_no, driver_id, eway_bill_no, origin, destination, departure_time, eta, status, distance_km, progress_percent)
SELECT 
  'KA-05-MJ-5678',
  (SELECT id FROM drivers WHERE assigned_vehicle_no = 'KA-05-MJ-5678'),
  '291000000002',
  'Bangalore',
  'Hyderabad',
  NOW() - INTERVAL '6 hours',
  NOW() + INTERVAL '5 hours',
  'Delayed',
  570,
  40;

INSERT INTO live_trips (vehicle_no, driver_id, eway_bill_no, origin, destination, departure_time, eta, status, distance_km, progress_percent)
SELECT 
  'TN-09-BE-3456',
  (SELECT id FROM drivers WHERE assigned_vehicle_no = 'TN-09-BE-3456'),
  '331000000003',
  'Coimbatore',
  'Kochi',
  NOW() - INTERVAL '3 hours',
  NOW() + INTERVAL '2 hours',
  'On Route',
  190,
  78;

INSERT INTO live_trips (vehicle_no, driver_id, eway_bill_no, origin, destination, departure_time, eta, status, distance_km, progress_percent)
SELECT 
  'AP-16-EF-7890',
  (SELECT id FROM drivers WHERE assigned_vehicle_no = 'AP-16-EF-7890'),
  '371000000004',
  'Vijayawada',
  'Chennai',
  NOW() - INTERVAL '5 hours',
  NOW() + INTERVAL '3 hours',
  'On Route',
  450,
  55;

INSERT INTO live_trips (vehicle_no, driver_id, eway_bill_no, origin, destination, departure_time, eta, status, distance_km, progress_percent)
SELECT 
  'GJ-01-GH-2345',
  (SELECT id FROM drivers WHERE assigned_vehicle_no = 'GJ-01-GH-2345'),
  '241000000005',
  'Ahmedabad',
  'Mumbai',
  NOW() - INTERVAL '8 hours',
  NOW() - INTERVAL '1 hour',
  'At Destination',
  530,
  100;

-- =====================================================
-- SEED SAMPLE GATE LOGS (5 entries)
-- =====================================================

INSERT INTO gate_logs (timestamp, vehicle_no, eway_bill_no, verdict, scan_duration_ms, compliance_score, operator_ip, qr_code_hash, metadata) VALUES
(NOW() - INTERVAL '2 hours', 'TN-01-AB-1234', '331000000001', 'APPROVED', 2345, 92, '192.168.1.105', 'WG-TN01AB1234-ABC123', 
'{"checks": [{"name": "Vahan API Verification", "status": "passed", "details": "RC Status: Active", "timestamp": "2026-02-07T10:00:00Z"}], "errors": [], "api_responses": {"vahan": {"status": "active"}, "gst": {"status": "Active"}, "insurance": {"status": "valid"}}}'),

(NOW() - INTERVAL '4 hours', 'MH-12-CD-9012', '271000000002', 'BLOCKED', 1234, 25, '192.168.1.112', NULL,
'{"checks": [{"name": "Insurance Verification", "status": "failed", "details": "Policy Expired", "timestamp": "2026-02-07T08:00:00Z"}], "errors": ["Insurance Expired"], "api_responses": {"vahan": {}, "gst": {}, "insurance": {}}}'),

(NOW() - INTERVAL '6 hours', 'KA-05-MJ-5678', '291000000016', 'APPROVED', 1876, 88, '192.168.1.118', 'WG-KA05MJ5678-DEF456',
'{"checks": [{"name": "Vahan API Verification", "status": "passed", "details": "RC Status: Active", "timestamp": "2026-02-07T06:00:00Z"}], "errors": [], "api_responses": {"vahan": {"status": "active"}, "gst": {"status": "Active"}, "insurance": {"status": "valid"}}}'),

(NOW() - INTERVAL '8 hours', 'DL-08-KL-1234', '071000000017', 'BLOCKED', 987, 10, '192.168.1.125', NULL,
'{"checks": [{"name": "Blacklist Check", "status": "failed", "details": "Vehicle is Blacklisted", "timestamp": "2026-02-07T04:00:00Z"}], "errors": ["Vehicle is on blacklist"], "api_responses": {"vahan": {}, "gst": {}, "insurance": {}}}'),

(NOW() - INTERVAL '10 hours', 'TN-09-BE-3456', '331000000003', 'APPROVED', 2100, 95, '192.168.1.105', 'WG-TN09BE3456-GHI789',
'{"checks": [{"name": "Vahan API Verification", "status": "passed", "details": "RC Status: Active", "timestamp": "2026-02-07T02:00:00Z"}], "errors": [], "api_responses": {"vahan": {"status": "active"}, "gst": {"status": "Active"}, "insurance": {"status": "valid"}}}');
