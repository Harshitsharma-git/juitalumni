const { createClient } = await import("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const users = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@juit.ac.in', year: 2010, dept: 'Computer Science & Engineering', title: 'Senior Software Engineer', company: 'Google', loc: 'Bangalore', bio: 'CSE graduate passionate about distributed systems.' },
  { name: 'Priya Mehta', email: 'priya.mehta@juit.ac.in', year: 2012, dept: 'Electronics & Communication', title: 'Product Manager', company: 'Microsoft', loc: 'Hyderabad', bio: 'ECE alumna building products at scale.' },
  { name: 'Rahul Verma', email: 'rahul.verma@juit.ac.in', year: 2015, dept: 'Computer Science & Engineering', title: 'Data Scientist', company: 'Amazon', loc: 'Gurgaon', bio: 'ML enthusiast and JUIT cricket team captain.' },
  { name: 'Sneha Gupta', email: 'sneha.gupta@juit.ac.in', year: 2011, dept: 'Biotechnology', title: 'Research Scientist', company: 'Biocon', loc: 'Bangalore', bio: 'Working on gene therapy research.' },
  { name: 'Vikram Singh', email: 'vikram.singh@juit.ac.in', year: 2009, dept: 'Computer Science & Engineering', title: 'VP Engineering', company: 'Flipkart', loc: 'Bangalore', bio: 'Leading platform engineering.' },
  { name: 'Anjali Kapoor', email: 'anjali.kapoor@juit.ac.in', year: 2013, dept: 'Bioinformatics', title: 'Bioinformatics Analyst', company: 'AIIMS', loc: 'New Delhi', bio: 'Genomics and computational biology.' },
  { name: 'Rohan Joshi', email: 'rohan.joshi@juit.ac.in', year: 2016, dept: 'Computer Science & Engineering', title: 'Full Stack Developer', company: 'Zomato', loc: 'Gurgaon', bio: 'Building food-tech solutions.' },
  { name: 'Kavya Reddy', email: 'kavya.reddy@juit.ac.in', year: 2014, dept: 'Electronics & Communication', title: 'VLSI Design Engineer', company: 'Intel', loc: 'Bangalore', bio: 'Chip design and verification.' },
  { name: 'Arjun Patel', email: 'arjun.patel@juit.ac.in', year: 2017, dept: 'Computer Science & Engineering', title: 'DevOps Engineer', company: 'Swiggy', loc: 'Bangalore', bio: 'Infrastructure and cloud computing.' },
  { name: 'Diya Nair', email: 'diya.nair@juit.ac.in', year: 2018, dept: 'Biotechnology', title: 'Quality Analyst', company: 'Dr. Reddys', loc: 'Hyderabad', bio: 'Pharma quality and compliance.' },
  { name: 'Karan Malhotra', email: 'karan.malhotra@juit.ac.in', year: 2008, dept: 'Computer Science & Engineering', title: 'CTO', company: 'TechStartup Inc', loc: 'Mumbai', bio: 'Founded an ed-tech startup after JUIT.' },
  { name: 'Meera Iyer', email: 'meera.iyer@juit.ac.in', year: 2019, dept: 'Civil Engineering', title: 'Structural Engineer', company: 'L&T', loc: 'Chennai', bio: 'Mega infrastructure projects.' },
  { name: 'Aditya Rao', email: 'aditya.rao@juit.ac.in', year: 2020, dept: 'Computer Science & Engineering', title: 'Software Engineer', company: 'Adobe', loc: 'Noida', bio: 'Creative cloud backend.' },
  { name: 'Nisha Thakur', email: 'nisha.thakur@juit.ac.in', year: 2011, dept: 'Electronics & Communication', title: 'Embedded Systems Lead', company: 'Samsung', loc: 'Gurgaon', bio: 'IoT and embedded firmware.' },
  { name: 'Siddharth Kumar', email: 'siddharth.kumar@juit.ac.in', year: 2013, dept: 'Computer Science & Engineering', title: 'Blockchain Developer', company: 'Polygon', loc: 'Bangalore', bio: 'Web3 and decentralized systems.' },
  { name: 'Tanvi Bhatia', email: 'tanvi.bhatia@juit.ac.in', year: 2016, dept: 'Bioinformatics', title: 'Data Analyst', company: 'Novartis', loc: 'Mumbai', bio: 'Clinical data analytics.' },
  { name: 'Harsh Pandey', email: 'harsh.pandey@juit.ac.in', year: 2015, dept: 'Computer Science & Engineering', title: 'Android Developer', company: 'PhonePe', loc: 'Bangalore', bio: 'Mobile payments platform.' },
  { name: 'Ishita Saxena', email: 'ishita.saxena@juit.ac.in', year: 2017, dept: 'Electronics & Communication', title: 'RF Engineer', company: 'Qualcomm', loc: 'Hyderabad', bio: '5G and wireless communications.' },
  { name: 'Manish Tiwari', email: 'manish.tiwari@juit.ac.in', year: 2010, dept: 'Computer Science & Engineering', title: 'Engineering Manager', company: 'Uber', loc: 'Bangalore', bio: 'Ride-sharing platform engineering.' },
  { name: 'Pooja Chauhan', email: 'pooja.chauhan@juit.ac.in', year: 2014, dept: 'Biotechnology', title: 'Bioprocess Engineer', company: 'Panacea Biotec', loc: 'New Delhi', bio: 'Vaccine manufacturing.' },
  { name: 'Nikhil Agarwal', email: 'nikhil.agarwal@juit.ac.in', year: 2012, dept: 'Computer Science & Engineering', title: 'Solutions Architect', company: 'AWS', loc: 'Mumbai', bio: 'Cloud architecture and consulting.' },
  { name: 'Ritu Sharma', email: 'ritu.sharma2@juit.ac.in', year: 2018, dept: 'Civil Engineering', title: 'Project Manager', company: 'Shapoorji Pallonji', loc: 'Pune', bio: 'Commercial construction.' },
  { name: 'Deepak Choudhary', email: 'deepak.choudhary@juit.ac.in', year: 2009, dept: 'Electronics & Communication', title: 'Principal Engineer', company: 'Texas Instruments', loc: 'Bangalore', bio: 'Analog IC design.' },
  { name: 'Shreya Mishra', email: 'shreya.mishra@juit.ac.in', year: 2021, dept: 'Computer Science & Engineering', title: 'Frontend Developer', company: 'Razorpay', loc: 'Bangalore', bio: 'Fintech UI/UX.' },
  { name: 'Amit Deshmukh', email: 'amit.deshmukh@juit.ac.in', year: 2011, dept: 'Computer Science & Engineering', title: 'Security Engineer', company: 'Palo Alto Networks', loc: 'Pune', bio: 'Cybersecurity.' },
  { name: 'Sakshi Jain', email: 'sakshi.jain@juit.ac.in', year: 2015, dept: 'Bioinformatics', title: 'Computational Biologist', company: 'NCBS', loc: 'Bangalore', bio: 'Protein structure prediction.' },
  { name: 'Varun Khanna', email: 'varun.khanna@juit.ac.in', year: 2013, dept: 'Computer Science & Engineering', title: 'ML Engineer', company: 'NVIDIA', loc: 'Bangalore', bio: 'GPU-accelerated deep learning.' },
  { name: 'Aisha Khan', email: 'aisha.khan@juit.ac.in', year: 2019, dept: 'Electronics & Communication', title: 'Test Engineer', company: 'Bosch', loc: 'Bangalore', bio: 'Automotive electronics testing.' },
  { name: 'Pranav Sinha', email: 'pranav.sinha@juit.ac.in', year: 2016, dept: 'Computer Science & Engineering', title: 'Backend Engineer', company: 'Atlassian', loc: 'Bangalore', bio: 'Enterprise collaboration tools.' },
  { name: 'Neha Rawat', email: 'neha.rawat@juit.ac.in', year: 2014, dept: 'Biotechnology', title: 'Clinical Research Associate', company: 'IQVIA', loc: 'Gurgaon', bio: 'Clinical trial management.' },
  { name: 'Rajat Goyal', email: 'rajat.goyal@juit.ac.in', year: 2010, dept: 'Computer Science & Engineering', title: 'Staff Engineer', company: 'LinkedIn', loc: 'Bangalore', bio: 'Search and recommendation systems.' },
  { name: 'Divya Menon', email: 'divya.menon@juit.ac.in', year: 2017, dept: 'Civil Engineering', title: 'Urban Planner', company: 'CEPT', loc: 'Ahmedabad', bio: 'Smart city planning.' },
  { name: 'Suresh Yadav', email: 'suresh.yadav@juit.ac.in', year: 2008, dept: 'Electronics & Communication', title: 'Director Engineering', company: 'Ericsson', loc: 'Noida', bio: 'Telecom infrastructure.' },
  { name: 'Pallavi Dubey', email: 'pallavi.dubey@juit.ac.in', year: 2020, dept: 'Computer Science & Engineering', title: 'QA Engineer', company: 'ThoughtWorks', loc: 'Pune', bio: 'Test automation.' },
  { name: 'Gaurav Bhatt', email: 'gaurav.bhatt@juit.ac.in', year: 2012, dept: 'Computer Science & Engineering', title: 'iOS Developer', company: 'Apple', loc: 'Cupertino', bio: 'SwiftUI and iOS platform.' },
  { name: 'Simran Kaur', email: 'simran.kaur@juit.ac.in', year: 2015, dept: 'Biotechnology', title: 'Regulatory Affairs', company: 'Sun Pharma', loc: 'Mumbai', bio: 'Drug approval processes.' },
  { name: 'Vivek Mishra', email: 'vivek.mishra@juit.ac.in', year: 2011, dept: 'Computer Science & Engineering', title: 'Platform Engineer', company: 'Spotify', loc: 'Stockholm', bio: 'Music streaming infrastructure.' },
  { name: 'Ananya Das', email: 'ananya.das@juit.ac.in', year: 2018, dept: 'Electronics & Communication', title: 'Hardware Engineer', company: 'Apple', loc: 'Cupertino', bio: 'Consumer electronics design.' },
  { name: 'Mohit Bansal', email: 'mohit.bansal@juit.ac.in', year: 2014, dept: 'Computer Science & Engineering', title: 'SRE', company: 'Netflix', loc: 'Los Angeles', bio: 'Streaming reliability.' },
  { name: 'Tanya Verma', email: 'tanya.verma@juit.ac.in', year: 2019, dept: 'Bioinformatics', title: 'Genomics Researcher', company: 'Illumina', loc: 'Singapore', bio: 'Next-gen sequencing.' },
  { name: 'Ashish Patil', email: 'ashish.patil@juit.ac.in', year: 2016, dept: 'Computer Science & Engineering', title: 'Cloud Engineer', company: 'Oracle', loc: 'Bangalore', bio: 'OCI and cloud services.' },
  { name: 'Kritika Arora', email: 'kritika.arora@juit.ac.in', year: 2013, dept: 'Electronics & Communication', title: 'Firmware Engineer', company: 'MediaTek', loc: 'Noida', bio: 'SoC firmware development.' },
  { name: 'Piyush Rastogi', email: 'piyush.rastogi@juit.ac.in', year: 2010, dept: 'Computer Science & Engineering', title: 'Tech Lead', company: 'PayPal', loc: 'Chennai', bio: 'Payment gateway systems.' },
  { name: 'Shruti Negi', email: 'shruti.negi@juit.ac.in', year: 2021, dept: 'Civil Engineering', title: 'Site Engineer', company: 'Godrej Properties', loc: 'Mumbai', bio: 'Residential construction.' },
  { name: 'Kunal Dhawan', email: 'kunal.dhawan@juit.ac.in', year: 2012, dept: 'Computer Science & Engineering', title: 'AI Researcher', company: 'DeepMind', loc: 'London', bio: 'Reinforcement learning.' },
  { name: 'Megha Kulkarni', email: 'megha.kulkarni@juit.ac.in', year: 2017, dept: 'Biotechnology', title: 'Formulation Scientist', company: 'Cipla', loc: 'Mumbai', bio: 'Drug delivery systems.' },
  { name: 'Saurabh Tripathi', email: 'saurabh.tripathi@juit.ac.in', year: 2015, dept: 'Electronics & Communication', title: 'Signal Processing Engineer', company: 'DRDO', loc: 'Bangalore', bio: 'Defense radar systems.' },
  { name: 'Rashi Goel', email: 'rashi.goel@juit.ac.in', year: 2020, dept: 'Computer Science & Engineering', title: 'React Developer', company: 'Freshworks', loc: 'Chennai', bio: 'SaaS product development.' },
  { name: 'Abhinav Chaturvedi', email: 'abhinav.chaturvedi@juit.ac.in', year: 2009, dept: 'Computer Science & Engineering', title: 'Distinguished Engineer', company: 'Salesforce', loc: 'San Francisco', bio: 'Enterprise CRM platform.' },
  { name: 'Komal Sethi', email: 'komal.sethi@juit.ac.in', year: 2014, dept: 'Bioinformatics', title: 'Biostatistician', company: 'WHO', loc: 'Geneva', bio: 'Global health data analysis.' },
  { name: 'Tarun Oberoi', email: 'tarun.oberoi@juit.ac.in', year: 2018, dept: 'Computer Science & Engineering', title: 'Game Developer', company: 'Ubisoft', loc: 'Pune', bio: 'AAA game engine development.' },
  { name: 'Aditi Bhardwaj', email: 'aditi.bhardwaj@juit.ac.in', year: 2016, dept: 'Electronics & Communication', title: 'Network Engineer', company: 'Cisco', loc: 'Bangalore', bio: 'Enterprise networking solutions.' },
  { name: 'Yash Tandon', email: 'yash.tandon@juit.ac.in', year: 2011, dept: 'Computer Science & Engineering', title: 'Founding Engineer', company: 'Stealth Startup', loc: 'Bangalore', bio: 'Building the next big thing.' },
  { name: 'Bhavna Sharma', email: 'bhavna.sharma@juit.ac.in', year: 2019, dept: 'Biotechnology', title: 'Lab Manager', company: 'IISc', loc: 'Bangalore', bio: 'Stem cell research lab.' },
  { name: 'Raghav Mittal', email: 'raghav.mittal@juit.ac.in', year: 2013, dept: 'Computer Science & Engineering', title: 'Principal Consultant', company: 'Deloitte', loc: 'Mumbai', bio: 'Digital transformation advisory.' },
];

async function seed() {
  let success = 0, failed = 0;
  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'Alumni@2024',
      email_confirm: true,
      user_metadata: { name: u.name }
    });
    if (error) {
      console.error(`Failed: ${u.email} - ${error.message}`);
      failed++;
      continue;
    }
    // Update the auto-created profile with details
    const { error: profileErr } = await supabase.from('profiles').update({
      graduation_year: u.year,
      department: u.dept,
      job_title: u.title,
      company: u.company,
      location: u.loc,
      bio: u.bio,
    }).eq('user_id', data.user.id);
    if (profileErr) console.error(`Profile update failed: ${u.email} - ${profileErr.message}`);
    success++;
  }
  console.log(`Done: ${success} created, ${failed} failed`);
}

seed();
