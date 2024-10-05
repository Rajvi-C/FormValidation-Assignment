document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("feedbackForm");
  const submitBtn = document.getElementById("submitBtn");
  const feedbackTable = document.getElementById("feedbackTable");
  const feedbackTableBody = document.getElementById("feedbackTableBody");

  feedbackTable.style.display = "none";

  const emailRegex = /^[^\s@]+@northeastern\.edu$/;
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const zipRegex = /^\d{6}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const textAreaRegex = /^[A-Za-z0-9\s]*$/;
  const commentsRegex = /^[A-Za-z0-9\s]*$/;
  const addressRegex = /^[A-Za-z0-9\s]*$/;

  const title = document.getElementsByName("title");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const emailId = document.getElementById("emailId");
  const phoneNumber = document.getElementById("phoneNumber");
  const address = document.getElementById("address");
  const zipcode = document.getElementById("zipcode");
  const comments = document.getElementById("comments");
  const customizationTextarea = document.getElementById(
    "customizationTextarea"
  );
  const source = document.getElementsByName("source");

  const optionSelect = document.getElementById("optionSelect");
  const dynamicContent = document.getElementById("dynamicContent");
  const dynamicLabel = document.getElementById("dynamicLabel");
  const dynamicCheckbox = document.getElementById("dynamicCheckbox");
  const customizationContent = document.getElementById("customizationContent");

  const titleError = document.getElementById("titleError");
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const addressError = document.getElementById("addressError");
  const zipError = document.getElementById("zipError");
  const commentsError = document.getElementById("commentsError");
  const customizationError = document.getElementById("customizationError");
  const sourceError = document.getElementById("sourceError");

  const interactedFields = {
    firstName: false,
    lastName: false,
    emailId: false,
    phoneNumber: false,
    zipcode: false,
    comments: false,
    customization: false,
    address: false,
  };

  function validateNotEmpty(
    field,
    errorElement,
    minLength = 2,
    maxLength = 50
  ) {
    if (
      field.value.trim() === "" ||
      field.value.length < minLength ||
      field.value.length > maxLength
    ) {
      errorElement.style.display = "inline";
      errorElement.textContent = `Required: ${minLength}-${maxLength} characters.`;
      return false;
    } else {
      errorElement.style.display = "none";
      return true;
    }
  }

  function validateRegex(field, regex, errorElement, message) {
    if (!regex.test(field.value)) {
      errorElement.style.display = "inline";
      errorElement.textContent = message;
      return false;
    } else {
      errorElement.style.display = "none";
      return true;
    }
  }

  function validateCheckboxes(checkboxes, errorElement) {
    const checked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
    if (!checked) {
      errorElement.style.display = "inline";
      errorElement.textContent = "Please select at least one option.";
      return false;
    } else {
      errorElement.style.display = "none";
      return true;
    }
  }

  function validateTitle() {
    const selected = Array.from(title).some((option) => option.checked);
    if (!selected) {
      titleError.style.display = "inline";
      titleError.textContent = "Title is required.";
      return false;
    } else {
      titleError.style.display = "none";
      return true;
    }
  }

  function validateName(field, errorElement) {
    return validateRegex(
      field,
      nameRegex,
      errorElement,
      "Invalid name format. Only letters and spaces are allowed."
    );
  }

  function validateComments() {
    const commentValue = comments.value.trim();

    if (
      commentValue === "" ||
      commentValue.length < 10 ||
      commentValue.length > 200
    ) {
      commentsError.style.display = "inline";
      commentsError.textContent =
        "Comments are required and must be between 10 and 200 characters.";
      return false;
    }

    if (!commentsRegex.test(commentValue)) {
      commentsError.style.display = "inline";
      commentsError.textContent =
        "Comments can only contain letters, numbers, and spaces.";
      return false;
    }

    commentsError.style.display = "none";
    return true;
  }

  function validateAddress() {
    const addressValue = address.value.trim();
    if (!addressRegex.test(addressValue)) {
      addressError.style.display = "inline";
      addressError.textContent =
        "Address Line 2 can only contain letters, numbers, and spaces.";
      return false;
    } else {
      return true;
    }
  }

  function validateCustomization() {
    if (dynamicCheckbox.checked) {
      const textareaValue = customizationTextarea.value.trim();

      if (textareaValue === "") {
        customizationError.style.display = "inline";
        customizationError.textContent =
          "Please add customization or enter 'NA' if not needed.";
        return false;
      }

      if (!textAreaRegex.test(textareaValue)) {
        customizationError.style.display = "inline";
        customizationError.textContent =
          "Custom text can only contain letters, numbers, and spaces.";
        return false;
      }

      customizationError.style.display = "none";
      return true;
    }

    return true;
  }

  function validateForm() {
    const isTitleValid = validateTitle();
    const isFirstNameValid =
      validateNotEmpty(firstName, firstNameError) &&
      validateName(firstName, firstNameError);
    const isLastNameValid =
      validateNotEmpty(lastName, lastNameError) &&
      validateName(lastName, lastNameError);
    const isEmailValid = validateRegex(
      emailId,
      emailRegex,
      emailError,
      "Invalid email format."
    );
    const isPhoneValid = validateRegex(
      phoneNumber,
      phoneRegex,
      phoneError,
      "Invalid phone format (xxx-xxx-xxxx)."
    );
    const isZipValid = validateRegex(
      zipcode,
      zipRegex,
      zipError,
      "Zip code must be 6 digits."
    );
    const isCommentsValid = validateComments();
    const isCustomTextAreaValid = validateCustomization();
    const isAddressValid = validateAddress();
    const isSourceValid = validateCheckboxes(source, sourceError);

    const allValid =
      isTitleValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isZipValid &&
      isCommentsValid &&
      isCustomTextAreaValid &&
      isAddressValid &&
      isSourceValid;

    submitBtn.disabled = !allValid;
  }

  function setupFieldValidation(field, errorElement, validationFn) {
    field.addEventListener("focus", () => {
      interactedFields[field.id] = true;
    });

    field.addEventListener("blur", () => {
      if (interactedFields[field.id]) {
        validationFn();
      }
    });

    field.addEventListener("input", validationFn);
  }

  optionSelect.addEventListener("change", function () {
    const selectedValue = optionSelect.value;

    if (selectedValue) {
      dynamicLabel.textContent = `${selectedValue}: Large Drink $1`;
      dynamicContent.style.display = "block";
      customizationContent.style.display = "none";
    } else {
      dynamicLabel.textContent = "";
      dynamicContent.style.display = "none";
    }
  });

  dynamicCheckbox.addEventListener("change", function () {
    if (dynamicCheckbox.checked) {
      customizationContent.style.display = "block";
    } else {
      customizationContent.style.display = "none";
    }
  });

  setupFieldValidation(
    firstName,
    firstNameError,
    () =>
      validateNotEmpty(firstName, firstNameError) &&
      validateName(firstName, firstNameError)
  );
  setupFieldValidation(
    lastName,
    lastNameError,
    () =>
      validateNotEmpty(lastName, lastNameError) &&
      validateName(lastName, lastNameError)
  );
  setupFieldValidation(emailId, emailError, () =>
    validateRegex(emailId, emailRegex, emailError, "Invalid email format.")
  );
  setupFieldValidation(phoneNumber, phoneError, () =>
    validateRegex(
      phoneNumber,
      phoneRegex,
      phoneError,
      "Invalid phone format (xxx-xxx-xxxx)."
    )
  );
  setupFieldValidation(address, addressError, () =>
    validateRegex(
      address,
      addressRegex,
      addressError,
      "Invalid Address format."
    )
  );
  setupFieldValidation(zipcode, zipError, () =>
    validateRegex(zipcode, zipRegex, zipError, "Zip code must be 6 digits.")
  );
  setupFieldValidation(comments, commentsError, validateComments);
  setupFieldValidation(
    customizationTextarea,
    customizationError,
    validateCustomization
  );

  const submitFeedback = (event) => {
    event.preventDefault();
    const feedbackRow = document.createElement("tr");
    feedbackRow.innerHTML = `
        <td>${firstName.value}</td>
        <td>${lastName.value}</td>
        <td>${emailId.value}</td>
        <td>${phoneNumber.value}</td>
        <td>${address.value}</td>
        <td>${zipcode.value}</td>
        <td>${comments.value}</td>
        <td>${customizationTextarea.value}</td>
      `;

    feedbackTableBody.appendChild(feedbackRow);
    feedbackTable.style.display = "table";

    form.reset();
    submitBtn.disabled = true;
  };

  form.addEventListener("submit", submitFeedback);

  [
    firstName,
    lastName,
    emailId,
    phoneNumber,
    address,
    zipcode,
    comments,
    customizationTextarea,
  ].forEach((field) => {
    field.addEventListener("input", validateForm);
  });

  Array.from(source).forEach((checkbox) => {
    checkbox.addEventListener("change", validateForm);
  });
});
