import { useState, useEffect } from 'react';

export default function useFormValidation(initialState, clientValidate, handler) {

    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isSubmitting) {
            if (Object.keys(errors).length === 0) {
                if (handler !== undefined) {
                    handler();
                }
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
            }
        }
    }, [errors])

    function handleChange(event) {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    function handleBlur() {
        const validationErrors = clientValidate(values);
        setErrors(validationErrors);
    }

    function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const validationErrors = clientValidate(values);
        setErrors(validationErrors);
    }

    return {values, errors, isSubmitting, handleChange, handleBlur, handleSubmit}
}