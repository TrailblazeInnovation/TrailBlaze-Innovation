export const FormExtension = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace?.type === 'Custom_Form' || (trace.payload && trace.payload.name === 'Custom_Form'),
  render: ({ trace, element }) => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const formContainer = document.createElement('form');
    formContainer.classList.add('form-container');
    let currentStep = 1;

    formContainer.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600;700&display=swap');
        .form-container {
          font-family: 'Host Grotesk', sans-serif;
          width: 100%;
          background: #fff;
          padding: 20px;
          border-radius: 5px;
        }
        .steps {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          background: #fff;
        }
        .step-indicator {
          flex: 1;
          text-align: center;
          padding: 10px;
          font-weight: bold;
          color: #8b8686;
        }
        .step-indicator.active span {
          background: black !important;
          color: white;
        }
        .step-indicator.visited span {
          background: black !important;
          color: white;
        }
        input, textarea {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          font-family: 'Host Grotesk', sans-serif;
        }
        input:hover, textarea:hover {
          border-color: black;
        }
        .next, .prev {
          background: transparent;
          border: 1px solid gray; 
          width: 100px; 
          color: black; 
          padding: 10px 25px; 
          border-radius: 20px;
          cursor: pointer;
        }
        .next:hover, .prev:hover {
          background: black;
          color: white;
        }
      </style>
      <div class="steps">
        <div class="step-indicator step-1"><span>1</span></div>
        <div class="step-indicator step-2"><span>2</span></div>
        <div class="step-indicator step-3"><span>3</span></div>
      </div>
      <div class="step-content">
        <div class="step step-1">
          <h2>Contact Information</h2>
          <p>Please provide your details to help us serve you better</p>
          <div style="display: flex; gap: 10px;">
            <div style="flex:1;">
              <label>First Name*</label>
              <input type="text" class="name" required />
            </div>
            <div style="flex:1;">
              <label>Last Name*</label>
              <input type="text" class="Lastname" required />
            </div>
          </div>
          <label>Email*</label>
          <input type="email" class="email" required />
          <label>Phone</label>
          <input type="tel" class="phone" />
          <div style="text-align: right;">
            <button type="button" class="next">Next</button>
          </div>
        </div>
        <div class="step step-2" style="display:none;">
          <h2>Concerns</h2>
          <p>Describe your issue or inquiry</p>
          <label>Message</label>
          <textarea class="Message" required></textarea>
          <div style="display: flex; justify-content: space-between;">
            <button type="button" class="prev">Back</button>
            <button type="button" class="next">Next</button>
          </div>
        </div>
        <div class="step step-3" style="display:none;">
          <h2>Review and Submit</h2>
          <p>Please review your information before submitting</p>
          <div id="review-info" style="margin-bottom: 20px;"></div>
          <div style="display: flex; justify-content: space-between;">
            <button type="button" class="prev">Edit</button>
            <button type="submit" class="next">Submit</button>
          </div>
        </div>
      </div>
    `;

    const steps = formContainer.querySelectorAll('.step');
    const stepIndicators = formContainer.querySelectorAll('.step-indicator');
    const reviewInfo = formContainer.querySelector('#review-info');

    const showStep = (step) => {
      steps.forEach((s, i) => {
        s.style.display = i === step - 1 ? 'block' : 'none';
        stepIndicators[i].classList.toggle('active', i === step - 1);
        if (i < step - 1) stepIndicators[i].classList.add('visited');
      });
      if (step === 3) updateReviewInfo();
    };

    const validateStep = () => {
      const inputs = steps[currentStep - 1].querySelectorAll('input, textarea');
      for (let input of inputs) {
        if (!input.checkValidity()) {
          alert(`Please fill out: ${input.name || 'required field'}`);
          return false;
        }
      }
      return true;
    };

    const updateReviewInfo = () => {
      const name = formContainer.querySelector('.name').value;
      const lastname = formContainer.querySelector('.Lastname').value;
      const email = formContainer.querySelector('.email').value;
      const phone = formContainer.querySelector('.phone').value;
      const message = formContainer.querySelector('.Message').value;

      reviewInfo.innerHTML = `
        <p><strong>Name:</strong> ${name} ${lastname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
    };

    const createChatBox = () => {
      const chatBox = document.createElement('div');
      chatBox.className = 'chat-box';
      chatBox.innerHTML = `
        <div style="text-align: center;">
          <h3>Thank you for your submission!</h3>
          <p>We'll be in touch shortly.</p>
        </div>
      `;
      formContainer.replaceWith(chatBox);
    };

    formContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('next')) {
        if (!validateStep()) return;
        currentStep++;
        showStep(currentStep);
      } else if (e.target.classList.contains('prev')) {
        currentStep--;
        showStep(currentStep);
      }
    });

    formContainer.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateStep()) return;

      const payload = {
        name: formContainer.querySelector('.name').value,
        lastname: formContainer.querySelector('.Lastname').value,
        email: formContainer.querySelector('.email').value,
        phone: formContainer.querySelector('.phone').value,
        message: formContainer.querySelector('.Message').value,
      };

      window.voiceflow.chat.interact({
        type: 'complete',
        payload,
      });

      createChatBox();
    });

    showStep(currentStep);
    element.appendChild(formContainer);
  },
};
