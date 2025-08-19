export let generalFormat = {
    
    // Función para validar el nombre
    nameFormat: (name) => {
        // Verificar que el nombre no esté vacío
        if (!name) throw new Error(`Error: the name can't be void`);
        // Devolver el nombre en minúsculas
        return name.toLowerCase();
    },

    // Función para validar el tipo de documento
    documenttypeFormat: (type) => {
        // Lista de tipos de documentos válidos
        const validTypes = [
            "CC",  // Cédula de ciudadanía
            "CE",  // Cédula de extranjería
            "PP",  // Pasaporte
            "PEP", // Permiso especial de permanencia
            "NIT"  // Número de identificación tributaria
        ];

        // Verificar si el tipo de documento es válido
        if (!validTypes.includes(type)) throw new Error("You must choose a document type");
        // Devolver el tipo de documento si es válido
        return type;
    },

    // Función para validar la identificación
    identicationFormat: (identification) => {
        // Verificar que la identificación no esté vacía
        if (!identification) throw new Error(`Error: the identification can't be void`);
        // Convertir la identificación a número entero
        identification = parseInt(identification);
        // Verificar si la identificación es un número válido
        if (isNaN(identification)) throw new Error(`Error: the identification only can be a number`);
        // Devolver la identificación como número entero
        return identification;
    },

    // Función para validar el formato de email (hotmail en este caso)
    hotmailFormat: (hotmail) => {
        // Verificar que el email no esté vacío
        if (!hotmail) throw new Error(`Error: the email can't be empty`);

        // Convertir el email a minúsculas y quitar espacios en blanco al principio y al final
        const email = hotmail.toLowerCase().trim();

        // Expresión regular para validar el formato del email
        const emailRegex = /^[^\s()<>[\]{};:,"']+@[^\s()<>[\]{};:,"']+\.[^\s()<>[\]{};:,"']+$/;

        // Verificar si el email cumple con el formato válido
        if (!emailRegex.test(email)) {
            throw new Error(`Error: invalid email format. Make sure it includes a domain, e.g., 'example@hotmail.com'`);
        }

        // Devolver el email si es válido
        return email;
    },

    // Función para validar las contraseñas
    passwordFormat: (password1, password2) => {
        // Verificar que las contraseñas no estén vacías
        if (!password1 || !password2) throw new Error(`Error: password can't be empty`);
        // Verificar que las contraseñas coincidan
        if (password1 !== password2) throw new Error(`Error: passwords must match`);

        // Expresión regular para validar el formato de la contraseña
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        // Verificar que la contraseña cumpla con los requisitos de longitud y complejidad
        if (!regex.test(password1)) {
            throw new Error(`Password must have at least 8 characters, including:
                - one uppercase letter
                - one lowercase letter
                - one number
                - one special character`);
        }

        // Devolver la contraseña si es válida
        return password1;
    },
    departamentFormat: (departament) => {
        if(!departament) throw new Error("Departament field can't be empty");
        return departament;
    },
    townFormat: (town) => {
        if(!town) throw new Error("Town field can't be empty");
        return town;
    },
    phoneNumber: (phone) => {
        if(!phone) throw new Error("Phone field can't be empty");
        if(isNaN(phone)) throw new Error("Phone field must has only numbers")
    },
    birthday: (birthday) => {
        if (!birthday) throw new Error("Birthday field can't be empty");
      
        // Intentar convertir la cadena a un objeto Date
        const date = new Date(birthday);
        // Verificar que sea una fecha válida
        if (isNaN(date.getTime())) throw new Error("Invalid date format");
      
        // Calcular la diferencia de edad
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
      
        // Ajustar edad si no ha cumplido años aún este año
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        if (age < 18) throw new Error("You must be at least 18 years old");
      
        return date.toISOString().split('T')[0]; // Opcional: devolver fecha en formato YYYY-MM-DD
      }

};
