document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("feedbackForm");
  const submitBtn = document.getElementById("submitBtn");

  const emailRegex = /^[^\s@]+@northeastern\.edu$/;
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const zipRegex = /^\d{6}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const textAreaRegex = /^[A-Za-z0-9\s]*$/; // Regex for custom text area (no special characters)
  const commentsRegex = /^[A-Za-z0-9\s]*$/; // Regex for comments (no special characters)

  const title = document.getElementsByName("title");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const emailId = document.getElementById("emailId");
  const phoneNumber = document.getElementById("phoneNumber");
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
    customization: false, // Added for tracking custom textarea
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

    // Check for empty value and length
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

    // Check for regex compliance (no special characters)
    if (!commentsRegex.test(commentValue)) {
      commentsError.style.display = "inline";
      commentsError.textContent =
        "Comments can only contain letters, numbers, and spaces.";
      return false;
    }

    // If both checks pass
    commentsError.style.display = "none";
    return true;
  }

  function validateCustomization() {
    if (dynamicCheckbox.checked) {
      const textareaValue = customizationTextarea.value.trim();

      // Check for empty value
      if (textareaValue === "") {
        customizationError.style.display = "inline";
        customizationError.textContent =
          "Please add customization or enter 'NA' if not needed.";
        return false;
      }

      // Check for regex compliance (no special characters)
      if (!textAreaRegex.test(textareaValue)) {
        customizationError.style.display = "inline";
        customizationError.textContent =
          "This can only contain letters, numbers, and spaces.";
        return false;
      }

      // If both checks pass
      customizationError.style.display = "none";
      return true;
    }

    return true; // If checkbox is not checked, no need to validate textarea
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
    const isCommentsValid = validateComments(); // Updated comments validation
    const isCustomTextAreaValid = validateCustomization(); // Validate custom text area
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
  setupFieldValidation(zipcode, zipError, () =>
    validateRegex(zipcode, zipRegex, zipError, "Zip code must be 6 digits.")
  );
  setupFieldValidation(
    comments,
    commentsError,
    () => validateComments() // Validate comments
  );

  for (const checkbox of source) {
    checkbox.addEventListener("change", () =>
      validateCheckboxes(source, sourceError)
    );
  }

  form.addEventListener("input", validateForm);
  form.addEventListener("change", validateForm);
});
