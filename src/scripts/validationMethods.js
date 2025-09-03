// Object to hold general validation methods
export let generalFormat = {
    
    // Validation function for names
    nameFormat: (name) => {
        // Check if the name is not empty
        if (!name) throw new Error(`Error: the name can't be void`);
        // Normalize the name to lowercase
        return name.toLowerCase();
    },

    // Validation for document types
    documenttypeFormat: (type) => {
        // List of valid document types
        const validTypes = [
            "CC",  // Cedula of citizen
            "CE",  // Cedula of foreigner
            "PP",  // Passport
            "PEP", // Allow of permanent residence
            "NIT"  // Number of tax identification
        ];

        // Check if the provided type is in the list of valid types
        if (!validTypes.includes(type)) throw new Error("You must choose a document type");
        // Return it if type docment it's valid
        return type;
    },

    // Validation if the identification is valid
    identicationFormat: (identification) => {
        // Check if the identification is not empty
        if (!identification) throw new Error(`Error: the identification can't be void`);
        // Convert the identification to an integer
        identification = parseInt(identification);
        // Check if the identification is a number
        if (isNaN(identification)) throw new Error(`Error: the identification only can be a number`);
        // Return the identification if it's valid
        return identification;
    },

    // valid email format example: hotmail.com,
    hotmailFormat: (hotmail) => {
        // Check if the email is not empty
        if (!hotmail) throw new Error(`Error: the email can't be empty`);

        // Convert the email to lowercase and trim whitespace from the start and end
        const email = hotmail.toLowerCase().trim();

        // Regex of validation
        const emailRegex = /^[^\s()<>[\]{};:,"']+@[^\s()<>[\]{};:,"']+\.[^\s()<>[\]{};:,"']+$/;

        // Check if the email matches the regex pattern
        if (!emailRegex.test(email)) {
            throw new Error(`Error: invalid email format. Make sure it includes a domain, e.g., 'example@hotmail.com'`);
        }

        // Return the email if it's valid
        return email;
    },

    // Validation for password format
    passwordFormat: (password1, password2) => {
        // Check is the password is not empty
        if (!password1 || !password2) throw new Error(`Error: password can't be empty`);

        // Verify that the passwords match
        if (password1 !== password2) throw new Error(`Error: passwords must match`);

        // Regex of validation
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        // Verify that the password meets the length and complexity requirements
        if (!regex.test(password1)) {
            throw new Error(`Password must have at least 8 characters, including:
                - one uppercase letter
                - one lowercase letter
                - one number
                - one special character`);
        }

        return password1;
    },

    // Validation of deparment
    departamentFormat: (departament) => {
        if(!departament) throw new Error("Departament field can't be empty");
        return departament;
    },

    // Validation of town
    townFormat: (town) => {
        if(!town) throw new Error("Town field can't be empty");
        return town;
    },

    // Validation of Number phone
    phoneNumber: (phone) => {
        if(!phone) throw new Error("Phone field can't be empty");
        if(isNaN(phone)) throw new Error("Phone field must has only numbers")
        return phone
    },

    // Validation of Birthdate
    birthdate: (birthdate) => {
        if (!birthdate) throw new Error("Birthdate field can't be empty");
      
        // Convert String to Date
        const date = new Date(birthdate);
        // Check the date is valid
        if (isNaN(date.getTime())) throw new Error("Invalid date format");
      
        // calculate the age difference
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
      
        // Adjust age if you haven't had a birthday yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        if (age < 18) throw new Error("You must be at least 18 years old");
        
        // Return date in format YYYY-MM-DD
        return date.toISOString().split('T')[0]; 
      }

};
