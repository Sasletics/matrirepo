-- Add test users
INSERT INTO users (username, password, email, is_verified, email_verified, phone_verified, subscription_plan, subscription_expiry, matches_remaining, created_at)
VALUES 
('priya_sharma', 'f9693821ed9ad64883d47b356e59572ae90cff8bfd7d8aa93c6c3ad9b10e94fe8f0a937bfad39b1c8847beb03149f8d9e0e3ac85a7aba0e2fecc4c8c1ad85da3.9b67aba6d3681b94', 'priya.sharma@example.com', true, true, true, 'basic', '2026-04-08', 10, '2025-04-08'),
('rahul_mishra', 'f9693821ed9ad64883d47b356e59572ae90cff8bfd7d8aa93c6c3ad9b10e94fe8f0a937bfad39b1c8847beb03149f8d9e0e3ac85a7aba0e2fecc4c8c1ad85da3.9b67aba6d3681b94', 'rahul.mishra@example.com', true, true, true, 'basic', '2026-04-08', 10, '2025-04-08'),
('anjali_patel', 'f9693821ed9ad64883d47b356e59572ae90cff8bfd7d8aa93c6c3ad9b10e94fe8f0a937bfad39b1c8847beb03149f8d9e0e3ac85a7aba0e2fecc4c8c1ad85da3.9b67aba6d3681b94', 'anjali.patel@example.com', true, true, true, 'basic', '2026-04-08', 10, '2025-04-08'),
('vikram_patnaik', 'f9693821ed9ad64883d47b356e59572ae90cff8bfd7d8aa93c6c3ad9b10e94fe8f0a937bfad39b1c8847beb03149f8d9e0e3ac85a7aba0e2fecc4c8c1ad85da3.9b67aba6d3681b94', 'vikram.patnaik@example.com', true, true, true, 'premium', '2026-04-08', 50, '2025-04-08'),
('neha_mohanty', 'f9693821ed9ad64883d47b356e59572ae90cff8bfd7d8aa93c6c3ad9b10e94fe8f0a937bfad39b1c8847beb03149f8d9e0e3ac85a7aba0e2fecc4c8c1ad85da3.9b67aba6d3681b94', 'neha.mohanty@example.com', true, true, true, 'basic', '2026-04-08', 10, '2025-04-08');

-- Add profiles
INSERT INTO profiles (user_id, full_name, gender, date_of_birth, marital_status, location, state, city, country, height, religion, mother_tongue, caste, about, profile_picture)
VALUES
(2, 'Priya Sharma', 'female', '1995-05-15', 'Single', 'Bhubaneswar', 'Odisha', 'Bhubaneswar', 'India', 62, 'Hindu', 'Odia', 'Brahmin', 'I am a software engineer who loves to travel and explore new places. Looking for someone who shares similar interests.', 'https://randomuser.me/api/portraits/women/33.jpg'),
(3, 'Rahul Mishra', 'male', '1993-09-24', 'Single', 'Cuttack', 'Odisha', 'Cuttack', 'India', 70, 'Hindu', 'Odia', 'Brahmin', 'Working as a medical professional, passionate about healthcare and helping others. Love music and playing guitar in my free time.', 'https://randomuser.me/api/portraits/men/44.jpg'),
(4, 'Anjali Patel', 'female', '1996-11-03', 'Single', 'Bhubaneswar', 'Odisha', 'Bhubaneswar', 'India', 65, 'Hindu', 'Odia', 'Khandayat', 'I''m a CA by profession and love to cook and dance in my free time. Looking for someone with similar values and interests.', 'https://randomuser.me/api/portraits/women/55.jpg'),
(5, 'Vikram Patnaik', 'male', '1990-07-17', 'Divorced', 'Bhubaneswar', 'Odisha', 'Bhubaneswar', 'India', 68, 'Hindu', 'Odia', 'Karan', 'I own a tech company and am passionate about innovation. Love outdoor activities like trekking and photography.', 'https://randomuser.me/api/portraits/men/67.jpg'),
(6, 'Neha Mohanty', 'female', '1992-03-29', 'Single', 'Berhampur', 'Odisha', 'Berhampur', 'India', 63, 'Hindu', 'Odia', 'Khandayat', 'I am a teacher by profession. Love reading, painting and classical dance. Looking for someone who respects independence and has similar values.', 'https://randomuser.me/api/portraits/women/62.jpg');

-- Add education details
INSERT INTO education (user_id, highest_education, college, degree, year_of_passing)
VALUES
(2, 'Masters in Computer Applications', 'KIIT University', 'MCA', 2020),
(3, 'MBBS', 'SCB Medical College', 'MBBS', 2018),
(4, 'CA', 'ICAI', 'Chartered Accountant', 2021),
(5, 'MBA', 'IIM Bangalore', 'MBA', 2015),
(6, 'B.Ed', 'Berhampur University', 'B.Ed', 2016);

-- Add career details
INSERT INTO career (user_id, occupation, employed_in, company, annual_income)
VALUES
(2, 'Software Engineer', 'IT Industry', 'Infosys', '10-15 LPA'),
(3, 'Doctor', 'Healthcare', 'SCB Medical College & Hospital', '15-25 LPA'),
(4, 'Chartered Accountant', 'Finance', 'KPMG', '12-18 LPA'),
(5, 'Entrepreneur', 'Business', 'OdiTech Solutions Pvt Ltd', '30+ LPA'),
(6, 'Teacher', 'Education', 'DAV Public School', '6-10 LPA');

-- Add family details
INSERT INTO family (user_id, father_status, mother_status, family_type, family_values, family_affluence, siblings)
VALUES
(2, 'Working', 'Working', 'Nuclear Family', 'Moderate', 'Upper Middle Class', 1),
(3, 'Retired', 'Homemaker', 'Joint Family', 'Traditional', 'Upper Middle Class', 1),
(4, 'Business Owner', 'Homemaker', 'Nuclear Family', 'Moderate', 'Upper Middle Class', 2),
(5, 'Business Owner', 'Homemaker', 'Nuclear Family', 'Moderate', 'Affluent', 1),
(6, 'Retired', 'Homemaker', 'Joint Family', 'Traditional', 'Middle Class', 2);

-- Add horoscope details
INSERT INTO horoscope (user_id, date_of_birth, time_of_birth, place_of_birth, moon_sign, sun_sign, venus_sign, nakshatra, manglik, created_at)
VALUES
(2, '1995-05-15', '08:45 AM', 'Cuttack', 'Gemini', 'Taurus', 'Gemini', 'Ardra', false, NOW()),
(3, '1993-09-24', '10:30 AM', 'Cuttack', 'Virgo', 'Virgo', 'Libra', 'Hasta', false, NOW()),
(4, '1996-11-03', '07:15 PM', 'Bhubaneswar', 'Scorpio', 'Scorpio', 'Sagittarius', 'Anuradha', false, NOW()),
(5, '1990-07-17', '02:30 PM', 'Puri', 'Cancer', 'Cancer', 'Virgo', 'Pushya', false, NOW()),
(6, '1992-03-29', '05:45 AM', 'Berhampur', 'Aries', 'Aries', 'Taurus', 'Ashwini', false, NOW());

-- Add preferences
INSERT INTO preferences (user_id, min_age, max_age, min_height, max_height, marital_status, religion, mother_tongue, caste, location, education, occupation, income)
VALUES
(2, 25, 32, 64, 74, ARRAY['Single', 'Divorced'], ARRAY['Hindu'], ARRAY['Odia', 'Hindi'], ARRAY['Brahmin', 'Karan', 'Khandayat'], ARRAY['Odisha', 'West Bengal'], ARRAY['Bachelors', 'Masters', 'Doctorate'], ARRAY['Any Professional'], ARRAY['5-10 LPA', '10-15 LPA', '15-25 LPA']),
(3, 25, 30, 60, 68, ARRAY['Single'], ARRAY['Hindu'], ARRAY['Odia'], ARRAY['Brahmin', 'Karan'], ARRAY['Odisha'], ARRAY['Bachelors', 'Masters'], ARRAY['Any Professional'], ARRAY['5-10 LPA', '10-15 LPA']),
(4, 27, 35, 65, 75, ARRAY['Single', 'Divorced'], ARRAY['Hindu'], ARRAY['Odia', 'Hindi'], ARRAY['Khandayat', 'Brahmin', 'Karan'], ARRAY['Odisha', 'Mumbai', 'Delhi'], ARRAY['Bachelors', 'Masters', 'CA', 'MBA'], ARRAY['Business Owner', 'Manager', 'Chartered Accountant', 'Government Officer'], ARRAY['10-15 LPA', '15-25 LPA', '25+ LPA']),
(5, 25, 35, 60, 70, ARRAY['Single', 'Divorced', 'Widowed'], ARRAY['Hindu'], ARRAY['Odia', 'Bengali', 'Hindi'], ARRAY['Any'], ARRAY['Odisha', 'West Bengal', 'Karnataka', 'Maharashtra'], ARRAY['Bachelors', 'Masters', 'MBA', 'PhD'], ARRAY['Any Professional'], ARRAY['Any']),
(6, 28, 36, 66, 74, ARRAY['Single'], ARRAY['Hindu'], ARRAY['Odia'], ARRAY['Khandayat', 'Brahmin', 'Karan'], ARRAY['Odisha'], ARRAY['Bachelors', 'Masters', 'B.Ed', 'M.Ed'], ARRAY['Teacher', 'Professor', 'Government Officer', 'Engineer'], ARRAY['5-10 LPA', '10-15 LPA', '15-25 LPA']);