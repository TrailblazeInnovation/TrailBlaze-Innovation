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
        @import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&display=swap');
        .form-container {
          font-family: "Host Grotesk", serif;
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
          background: #fff;
          border-radius: 5px;
        }
        .step-indicator.active span,
        .visited span {
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
        }
        input:hover, textarea:hover {
          border: 1px solid black;
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
        .chat-box {
          width: 100%;
          padding: 20px;
          background: #fff;
          border-radius: 5px;
          margin-top: 20px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
      </style>
      <!-- Your original HTML content here: step indicators, step content, inputs, etc. -->
    `;

    // Original logic continues below
    const steps = formContainer.querySelectorAll(".step");
    const stepIndicators = formContainer.querySelectorAll(".step-indicator");
    const reviewInfo = formContainer.querySelector("#review-info");

    function showStep(step) {
      steps.forEach((el, index) => {
        el.style.display = index === step - 1 ? "block" : "none";
        if (index < step - 1) {
          stepIndicators[index].classList.add("visited");
        }
      });
      stepIndicators.forEach((el, index) => el.classList.toggle("active", index === step - 1));
      if (step === 3) updateReviewInfo();
    }

    function validateStep() {
      if (!steps[currentStep - 1]) return true;
      const currentInputs = steps[currentStep - 1].querySelectorAll("input, textarea");
      for (let input of currentInputs) {
        if (!input.checkValidity()) {
          alert(`Invalid input: ${input.name}`);
          return false;
        }
      }
      return true;
    }

    function updateReviewInfo() {
      if (!reviewInfo) return;
      reviewInfo.innerHTML = `
        <div style="background: #F5F5F7; padding: 10px; border-radius: 5px; margin-top: 20px;">
          <h2>Contact Information</h2>
          <p>First and Last Name: <span>${formContainer.querySelector(".name").value} ${formContainer.querySelector(".Lastname").value}</span></p>
          <p>Email: <span>${formContainer.querySelector(".email").value}</span></p>
          <p>Phone: <span>${formContainer.querySelector(".phone").value}</span></p>
        </div>
        <div style="background: #F5F5F7; padding: 10px; border-radius: 5px; margin-top: 20px;">
          <h2>Concerns</h2>
          <p>Message: <span>${formContainer.querySelector(".Message").value}</span></p>
        </div>
      `;
    }

    function createChatBox() {
      const chatBox = document.createElement('div');
      chatBox.classList.add('chat-box');
      chatBox.innerHTML = `
        <div style="text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="height: 40px; width: 38px; fill: black;">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
          </svg>
          <h3>Thank you for your submission!</h3>
          <p>Your form has been successfully submitted.<br/>Our team will get back to you shortly.</p>
        </div>
      `;
      formContainer.replaceWith(chatBox);
    }

    formContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("next")) {
        if (!validateStep()) return;
        currentStep++;
        showStep(currentStep);
      } else if (event.target.classList.contains("prev")) {
        currentStep--;
        showStep(currentStep);
      }
    });

    formContainer.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateStep()) return;

      const formData = {
        name: formContainer.querySelector('.name').value,
        lastname: formContainer.querySelector('.Lastname').value,
        email: formContainer.querySelector('.email').value,
        phone: formContainer.querySelector('.phone').value,
        message: formContainer.querySelector('.Message').value,
      };

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: formData,
      });

      createChatBox();
    });

    showStep(currentStep);
    element.appendChild(formContainer);
  }
};
