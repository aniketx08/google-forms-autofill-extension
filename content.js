// Aggressive normalization function
function normalize(s) {
  return s.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

// Alias mapping for common field names
const fieldAliases = {
  "Student Name": [
    "Full Name", "Name", "Student's Name", "Candidate Name", "Student Full Name", "Applicant Name", "Your Name", "Name of Student", "First Name and Last Name", "Student's Full Name"
  ],
  "University PRN Number / College ID": [
    "PRN Number", "University PRN", "College ID", "Student ID", "Enrollment Number", "Registration Number", "Roll Number", "University Roll Number", "PRN/College ID", "ID Number", "PRN"
  ],
  "Contact No.": [
    "Contact Number", "Mobile Number", "Phone Number", "Cell Number", "Mobile No.", "Phone No.", "Student Contact", "Student Mobile", "Mobile", "Phone", "Contact", "Student Phone"
  ],
  "Personal Email ID": [
    "Personal Email", "Email (Personal)", "Alternate Email", "Private Email", "Email Address", "Personal Email Address", "Student Email", "Your Email"
  ],
  "College Email ID": [
    "College Email", "Institutional Email", "University Email", "Official Email", "Student College Email", "Student Official Email", "College Email Address", "University Email Address"
  ],
  "Stream/Specialization": [
    "Stream", "Specialization", "Branch", "Major", "Field of Study", "Department", "Discipline", "Course", "Academic Stream"
  ],
  "10th % (Do not write % symbol)": [
    "10th Percentage", "10th Marks", "10th Score", "Class 10 Percentage", "Class X Percentage", "SSC Percentage", "Secondary Percentage", "10th Result", "10th Grade Percentage"
  ],
  "12th% (Do not write % symbol)": [
    "12th Percentage", "12th Marks", "12th Score", "Class 12 Percentage", "Class XII Percentage", "HSC Percentage", "Senior Secondary Percentage", "12th Result", "12th Grade Percentage"
  ],
  "UG Aggregate %": [
    "UG Percentage", "Undergraduate Percentage", "Graduation Percentage", "Bachelor's Percentage", "UG Aggregate", "Degree Percentage", "UG Marks", "UG Score", "UG Result", "UG Grade Percentage", "B.Tech Percentage", "B.E. Percentage"
  ],
  "CoCubes Final Pre-Assess Score (Out of 800)": [
    "CoCubes Score", "CoCubes Pre-Assess Score", "CoCubes Final Score", "CoCubes Assessment Score", "CoCubes (max 800)", "CoCubes Marks", "CoCubes Result"
  ],
  "Gender": [
    "Sex", "Gender Identity", "Student Gender", "Applicant Gender"
  ],
  "Date of Birth": [
    "DOB", "Birth Date", "Date of Birth (DD/MM/YYYY)", "D.O.B.", "Birthdate"
  ],
  "Name of the college": [
    "College Name", "Institute Name", "University Name", "Name of Institute", "Name of University", "Educational Institution", "School/College Name"
  ],
  "CodeChef Rating": [
    "CodeChef Score", "CodeChef Rank", "CodeChef Points", "CodeChef Profile Rating", "CodeChef"
  ],
  "Link of CodeChef Rating (If no rating then mention \"NA\")": [
    "CodeChef Profile Link", "CodeChef URL", "CodeChef Rating Link", "CodeChef Profile", "CodeChef Link"
  ],
  "Hacker Rank Rating": [
    "HackerRank Score", "HackerRank Rank", "HackerRank Points", "HackerRank Profile Rating", "HackerRank"
  ],
  "Link of Hacker Rank Rating (If no rating then mention \"NA\")": [
    "HackerRank Profile Link", "HackerRank URL", "HackerRank Rating Link", "HackerRank Profile", "HackerRank Link"
  ],
  "Hacker Earth Rating": [
    "HackerEarth Score", "HackerEarth Rank", "HackerEarth Points", "HackerEarth Profile Rating", "HackerEarth"
  ],
  "Link of Hacker Earth Rating (If no rating then mention \"NA\")": [
    "HackerEarth Profile Link", "HackerEarth URL", "HackerEarth Rating Link", "HackerEarth Profile", "HackerEarth Link"
  ],
  "LeetCode Score": [
    "LeetCode Rating", "LeetCode Points", "LeetCode Rank", "LeetCode Profile Score", "LeetCode"
  ],
  "Link of LeetCode Score (If no score then mention \"NA\")": [
    "LeetCode Profile Link", "LeetCode URL", "LeetCode Score Link", "LeetCode Profile", "LeetCode Link"
  ],
  "Code Forces Rating  (If no rating then mention \"NA\")": [
    "Codeforces Rating", "Codeforces Score", "Codeforces Rank", "Code Forces Score", "Code Forces Rank", "CodeForces", "Codeforces Profile Rating"
  ],
  "Link of Code Forces Rating (If no rating then mention \"NA\")": [
    "Codeforces Profile Link", "Codeforces URL", "Codeforces Rating Link", "Codeforces Profile", "Codeforces Link"
  ]
};

// Canonical and alias-aware value fetcher using aggressive normalization
function getProfileValue(label, autofillProfile) {
  if (!label) return null;
  const normLabel = normalize(label);

  // Exact match (canonical or alias)
  for (const [canonical, aliases] of Object.entries(fieldAliases)) {
    const normCanonical = normalize(canonical);
    if (normCanonical === normLabel && autofillProfile[canonical]) {
      return autofillProfile[canonical];
    }
    for (const alias of aliases) {
      const normAlias = normalize(alias);
      if (normAlias === normLabel) {
        return autofillProfile[canonical];  // Always use canonical value
      }
    }
  }

  // Fuzzy match (substring match)
  for (const [canonical, aliases] of Object.entries(fieldAliases)) {
    const normCanonical = normalize(canonical);
    if (normCanonical.includes(normLabel) || normLabel.includes(normCanonical)) {
      return autofillProfile[canonical];
    }
    for (const alias of aliases) {
      const normAlias = normalize(alias);
      if (normAlias.includes(normLabel) || normLabel.includes(normAlias)) {
        return autofillProfile[canonical];
      }
    }
  }

  // Fallback: user-defined keys
  for (const k of Object.keys(autofillProfile)) {
    const normK = normalize(k);
    if (normK === normLabel || normK.includes(normLabel) || normLabel.includes(normK)) {
      return autofillProfile[k];
    }
  }

  return null;
}

// Helper: Get visible label text
function getLabelText(label) {
  return label.querySelector('.aDTYNe, .Zki2Ve')?.textContent.trim() || label.textContent.trim();
}

// Normalize answer for matching
function normalizeAnswer(s) {
  return s.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

// Radio button selector with fallback to "Other"
function trySelectRadio(radioGroup, answer) {
  const normAnswer = normalizeAnswer(answer);
  let matched = Array.from(radioGroup.querySelectorAll('label')).some(label => {
    const text = getLabelText(label);
    const radio = label.querySelector('input[type="radio"], [role="radio"]');
    const ariaLabel = radio?.getAttribute('aria-label') || '';
    const dataValue = radio?.getAttribute('data-value') || '';
    const options = [text, ariaLabel, dataValue].map(normalizeAnswer);
    if (options.includes(normAnswer)) {
      label.click();
      if (radio && radio.type === 'radio') {
        radio.checked = true;
        radio.dispatchEvent(new Event('input', { bubbles: true }));
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    }
    return false;
  });

  // Try "Other" option
  if (!matched) {
    const otherLabel = Array.from(radioGroup.querySelectorAll('label')).find(label =>
      /other[:]?/i.test(getLabelText(label))
    );
    if (otherLabel) {
      otherLabel.click();
      const otherInput = radioGroup.closest('div').querySelector('input[aria-label="Other response"]');
      if (otherInput) {
        otherInput.value = answer;
        otherInput.dispatchEvent(new Event('input', { bubbles: true }));
        otherInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
}

// Main Autofill Logic
chrome.storage.sync.get("autofillProfile", ({ autofillProfile }) => {
  if (!autofillProfile) {
    console.log("No autofill profile found.");
    return;
  }

  document.querySelectorAll('[role="heading"][aria-level="3"]').forEach(heading => {
    const labelText =
      heading.querySelector('.M7eMe span')?.textContent?.trim() ||
      heading.querySelector('.M7eMe')?.textContent?.trim();

    if (!labelText) {
      console.warn("Label extraction failed for heading:", heading);
      return;
    }

    const answer = getProfileValue(labelText, autofillProfile);
    console.log("Label:", labelText, "| Autofill:", answer);

    if (!answer) return;

    let container = heading.parentElement;
    for (let i = 0; i < 5 && container; i++) {
      const input = container.querySelector('input[type="text"]:not([aria-label="Other response"]), textarea');
      if (input && !container.querySelector('[role="radiogroup"]')) {
        input.value = answer;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }

      const radioGroup = container.querySelector('[role="radiogroup"]');
      if (radioGroup) {
        trySelectRadio(radioGroup, answer);
        break;
      }

      container = container.parentElement;
    }
  });
});
