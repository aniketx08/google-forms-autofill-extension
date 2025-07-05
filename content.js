// Wait for the form to fully load
function waitForForm() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const form = document.querySelector('form[action*="forms"]');
      if (form) {
        clearInterval(checkInterval);
        resolve(form);
      }
    }, 200);
  });
}

// Fill a single field
function fillField(labelText, answer) {
  const questions = document.querySelectorAll('[role="listitem"]');

  for (const question of questions) {
    const questionLabel = question.querySelector('[role="heading"]');
    if (!questionLabel || !questionLabel.textContent.toLowerCase().includes(labelText.toLowerCase())) continue;

    // Text Input / Textarea (for simple text questions)
    const textInput = question.querySelector('input[type="text"]:not([aria-label="Other response"]), textarea');
    if (textInput) {
      textInput.value = answer;
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }

    // Radio Buttons
    const radioGroup = question.querySelector('[role="radiogroup"]');
    if (radioGroup) {
      const radios = radioGroup.querySelectorAll('[role="radio"]');
      let matched = false;
      let otherRadio = null;

      for (const radio of radios) {
        const value = radio.getAttribute('data-value');
        const radioLabel = radio.getAttribute('aria-label') || '';

        if (value === '__other_option__') {
          otherRadio = radio;
        } else if (radioLabel.replace(/\s+/g, ' ').trim().toLowerCase() === answer.replace(/\s+/g, ' ').trim().toLowerCase()) {
          radio.click();
          matched = true;
          break;
        }
      }

      if (!matched && otherRadio) {
        otherRadio.click();
        const otherInput = question.querySelector('input[aria-label="Other response"]');
        if (otherInput) {
          otherInput.value = answer;
          otherInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      return true;
    }
  }
  return false;
}

// Main autofill logic
async function autofillForm() {
  const { autofillProfile } = await chrome.storage.sync.get("autofillProfile");
  if (!autofillProfile) return;

  await waitForForm(); // Wait until form is ready

  for (const [labelText, answer] of Object.entries(autofillProfile)) {
    fillField(labelText, answer);
  }
}

// Run when the page loads
autofillForm();

// Also re-run when navigating between form pages
document.addEventListener('click', (e) => {
  if (e.target.closest('[role="button"][aria-label="Next"], [role="button"][aria-label="Submit"]')) {
    setTimeout(autofillForm, 500); // Re-fill after navigation
  }
});