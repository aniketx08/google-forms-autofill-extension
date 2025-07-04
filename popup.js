// Utility: create a new label-answer field row
function createFieldRow(label = '', answer = '') {
  const div = document.createElement('div');
  div.className = 'field-row';

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Question label (exact)';
  labelInput.className = 'label-input';
  labelInput.value = label;
  labelInput.required = true;

  const answerInput = document.createElement('input');
  answerInput.type = 'text';
  answerInput.placeholder = 'Your answer';
  answerInput.className = 'answer-input';
  answerInput.value = answer;
  answerInput.required = true;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '❌';
  removeBtn.title = 'Remove';
  removeBtn.onclick = () => div.remove();

  div.appendChild(labelInput);
  div.appendChild(answerInput);
  div.appendChild(removeBtn);

  return div;
}

// Load profile on popup open
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get("autofillProfile", ({ autofillProfile }) => {
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = '';
    if (autofillProfile && Object.keys(autofillProfile).length > 0) {
      for (const [label, answer] of Object.entries(autofillProfile)) {
        fieldsContainer.appendChild(createFieldRow(label, answer));
      }
    } else {
      // Add one blank row by default
      fieldsContainer.appendChild(createFieldRow());
    }
  });
});

// Add new field row
document.getElementById('add-field').addEventListener('click', () => {
  document.getElementById('fields-container').appendChild(createFieldRow());
});

// Save profile on submit
document.getElementById('profile-form').addEventListener('submit', e => {
  e.preventDefault();
  const fields = document.querySelectorAll('.field-row');
  const profile = {};
  let valid = true;

  fields.forEach(div => {
    const label = div.querySelector('.label-input').value.trim();
    const answer = div.querySelector('.answer-input').value;
    if (label) {
      profile[label] = answer;
    } else {
      valid = false;
    }
  });

  if (!valid || Object.keys(profile).length === 0) {
    document.getElementById('status').textContent = "Please fill all labels and answers.";
    setTimeout(() => document.getElementById('status').textContent = "", 2000);
    return;
  }

  chrome.storage.sync.set({ autofillProfile: profile }, () => {
    document.getElementById('status').textContent = "Saved!";
    setTimeout(() => document.getElementById('status').textContent = "", 1500);
  });
});