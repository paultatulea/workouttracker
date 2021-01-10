import React, { useState, useRef, useEffect } from 'react';
import useClickOutside from '../useClickOutside';

export default function EditableTextInput({text}) {
    const [value, setValue] = useState(text);
    const [isEditing, setIsEditing] = useState(false);

    const textInputRef = useRef();
    const componentRef = useClickOutside(() => {
        setIsEditing(false);
    })

    useEffect(() => {
        if (isEditing) {
            textInputRef.current.focus();
        }
    }, [isEditing])

    function handleToggleEditing() {
        setIsEditing(!isEditing);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            // Update value when enter pressed
            updateComponentValue();
        } else if (e.key === 'Escape') {
            // Discard changes when escape pressed
            setIsEditing(false);
        }
    }

    function updateComponentValue() {
        // Update value in internal state of component
        setValue(textInputRef.current.value);
        setIsEditing(false);
    }

    function renderEditView() {
        return (
            <div ref={componentRef}>
                <input type="text" defaultValue={value} ref={textInputRef} onKeyDown={handleKeyDown}/>
            </div>
        )
    }

    function renderDefaultView() {
        return (
            <div onDoubleClick={handleToggleEditing} ref={componentRef}>
                {value}
            </div>
        )
    }

    return (
        isEditing ?
        renderEditView() :
        renderDefaultView()
    )
}