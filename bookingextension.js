export const FormExtension = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace?.type === 'Custom_Form' || (trace.payload && trace.payload?.name === 'Custom_Form'),
  render: ({ element }) => {
    // Load the font
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
        /* All your CSS from original code goes here, exactly as it was */
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
        .step-indicator.active span {
            background: black !important;
            color: white;
        }
        ._1ddzqsn7 {
            width: 100% !important;
        }
        .active {
            color: black !important;
        }
        .active span {
            background: black;
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
        .chat-box {
            width: 100%;
            padding: 20px;
            background: #fff;
            border-radius: 5px;
            margin-top: 20px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .steps {
            position: relative;
            width: 100%;
        }
        .step-1 .bord2 {
            position: absolute;
            border: 2px solid #e1dada;
            width: 100%;
            left: 0;
            top: 80px;
        }
        .step-1.active .bord {
            border: 2px solid black;
            width: 30%;
        }
        .step-2.active .bord {
            border: 2px solid black;
            width: 70%;
        }
        .step-3.active .bord {
            border: 2px solid black;
            width: 100%;
        }
        .visited span {
            background: black !important;
            color: white;
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
            background: #000;
            color: white;
        }
        .vfrc-message--extension-Forms {
            background: white !important;
        }
        .step-content {
            margin-top: 28px;
        }
      </style>

      <div class="steps" style="display: flex; gap: 30px; justify-content: space-around; width: 100%;">
        <div class="step-indicator step-1"><span class="bord2"></span><span class="bord"></span><span style="background-color: rgb(218 213 213 / 0%); border: 1px solid; width: 34px; text-align: center; display: inline-flex; align-items: center; height: 34px; justify-content: center; border-radius: 50%;">1</span></div>
        <div class="step-indicator step-2"><span class="bord"></span><span style="background-color: rgb(218 213 213 / 0%); border: 1px solid; width: 34px; text-align: center; display: inline-flex; align-items: center; height: 34px; justify-content: center; border-radius: 50%;">2</span></div>
        <div class="step-indicator step-3"><span class="bord"></span><span style="background-color: rgb(218 213 213 / 0%); border: 1px solid; width: 34px; text-align: center; display: inline-flex; align-items: center; height: 34px; justify-content: center; border-radius: 50%;">3</span></div>
      </div>

      <div class="step-content">
        <div class="step step-1">
          <h2>Contact Information</h2>
          <p>Please provide your details to help us serve you better</p>
          <div style="display: flex; width: 100%; justify-content: space-between;">
            <div style="width: 45%;">
              <label for="name">First Name*</label>
              <input type="text" class="name" name="name" required>
            </div>
            <div style="width: 45%;">
              <label for="Lastname">Last Name*</label>
              <input type="text" class="Lastname" name="Lastname" required>
            </div>
          </div>
          <label for="email">Email*</label>
          <input type="email" class="email" name="email" required>
          <label for="phone">Phone Number</label>
          <input type="tel" class="phone" name="phone">
          <div style="display: flex; justify-content: right; gap: 30px; margin-top: 17px;">
            <button type="button" class="next">Next</button>
          </div>
        </div>

        <div class="step step-2" style="display: none;">
          <h2>Concerns</h2>
          <p>Describe your issue or inquiry so we can assist you effectively</p>
          <label for="Message">Message</label>
          <textarea class="Message" name="Message" style="height: 100px;" required></textarea>
          <div style="display: flex; justify-content: space-between; gap: 30px; margin-top: 17px;">
            <button type="button" class="prev">Back</button>
            <button type="button" class="next">Next</button>
          </div>
        </div>

        <div class="step step-3" style="display: none;">
          <h2>Review and Submit</h2>
          <p>Please review your information before submitting</p>
          <div id="review-info"></div>
          <div style="display: flex; justify-content: space-between; gap: 30px; margin-top: 17px;">
            <button type="button" class="prev">Edit</button>
            <button type="submit" class="next">Submit</button>
          </div>
        </div>
      </div>
    `;

    const steps = formContainer.querySelectorAll(".step");
    const stepIndicators = formContainer.querySelectorAll(".step-indicator");
    const reviewInfo = formContainer.querySelector("#review-info");

    function showStep(step) {
      steps.forEach((el, index) => {
        el.style.display = index === step - 1 ? "block" : "none";
        if (index < step - 1) stepIndicators[index].classList.add("visited");
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
          <p>First and Last Name: <span style="color: gray;">${formContainer.querySelector(".name").value} ${formContainer.querySelector(".Lastname").value}</span></p>
          <p>Email: <span style="color: gray;">${formContainer.querySelector(".email").value}</span></p>
          <p>Phone Number: <span style="color: gray;">${formContainer.querySelector(".phone").value}</span></p>
        </div>
        <div style="background: #F5F5F7; padding: 10px; border-radius: 5px; margin-top: 20px;">
          <h2>Concerns</h2>
          <p>Message: <span style="color: gray;">${formContainer.querySelector(".Message").value}</span></p>
        </div>`;
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
        </div>`;
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

    formContainer.addEventListener('submit', function (event) {
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
