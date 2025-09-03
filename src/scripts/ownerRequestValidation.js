
// functions to validate owner request form fields
export const ownerRequestValidators = {
  field_name: (value) => {
    if (!value || typeof value !== "string") {
      return "Field Name is required.";
    }
    if (!/^[a-zA-Z0-9\s]{3,100}$/.test(value.trim())) {
      return "Field Name must be 3–100 characters, only letters, numbers and spaces.";
    }
    return null;
  },

  field_location: (value) => {
    if (!value || typeof value !== "string") {
      return "Location is required.";
    }
    if (value.trim().length < 5) {
      return "Location must be at least 5 characters long.";
    }
    return null;
  },

  field_description: (value) => {
    if (!value) return null;
    if (value.length > 500) {
      return "Description cannot exceed 500 characters.";
    }
    return null;
  }
};

// Function to validate the entire form
export const validateOwnerRequestForm = (formData) => {
  let errors = {};

  for (const field in ownerRequestValidators) {
    const validator = ownerRequestValidators[field];
    const error = validator(formData[field]);
    if (error) errors[field] = error;
  }

  return errors;
};
