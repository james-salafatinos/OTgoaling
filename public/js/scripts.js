// OT Goaling App - Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Form validation for all forms
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.from(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Format dates in a more readable format
  const dates = document.querySelectorAll('.format-date');
  dates.forEach(date => {
    if (date.textContent) {
      const formattedDate = new Date(date.textContent).toLocaleDateString();
      date.textContent = formattedDate;
    }
  });

  // Likert scale functionality
  const rangeInputs = document.querySelectorAll('input[type="range"]');
  rangeInputs.forEach(input => {
    const valueDisplay = document.getElementById(input.id + 'Display');
    if (valueDisplay) {
      // Update value display when range changes
      input.addEventListener('input', function() {
        valueDisplay.textContent = this.value + '%';
        
        // Change badge color based on value
        const value = parseInt(this.value);
        if (value < 25) {
          valueDisplay.className = 'badge bg-danger';
        } else if (value < 50) {
          valueDisplay.className = 'badge bg-info';
        } else if (value < 75) {
          valueDisplay.className = 'badge bg-success';
        } else {
          valueDisplay.className = 'badge bg-warning';
        }
      });
      
      // Trigger initial update
      input.dispatchEvent(new Event('input'));
    }
  });

  // Auto-expand textareas as content grows
  const textareas = document.querySelectorAll('textarea.auto-expand');
  textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  });
});
