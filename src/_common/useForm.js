import { useState } from 'react';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSelectChange = (name, value) => {
    setValues({ ...values, [name]: value });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // <-- Updated resetForm to accept optional new values
  const resetForm = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
  };

  const setFieldValue = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const setFieldError = (name, error) => {
    setErrors({ ...errors, [name]: error });
  };

  const validate = (validationRules) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const value = values[key];
      const validationRule = validationRules[key];
      const error = validationRule(value);

      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    handleChange,
    handleSelectChange,
    resetForm,
    setFieldValue,
    setFieldError,
    validate
  };
};

export default useForm;
