<script lang="ts">
    import { TextField } from '@econic/ui-kit/components';
    import type { Message } from '@econic/ui-kit/components';
    import { wizardStore } from '@econic/ui-kit/stores';
    import { onMount } from 'svelte';

    // Type definition
    type UserFormDetails = {
        email?: string;
        firstName?: string;
        lastName?: string;
        displayName?: string;
        phoneNumber?: string;
    };

    // Props for the component
    const { onValidityChange, onDataChange, initialData, showSubmitError = false } = $props<{
        onValidityChange?: (isValid: boolean) => void;
        onDataChange?: (data: UserFormDetails) => void;
        initialData?: UserFormDetails;
        showSubmitError?: boolean;
    }>();

    // Initialize form state from props or defaults
    let formState = $state({
        email: initialData?.email || 'user@example.com',
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        displayName: initialData?.displayName || '',
        phoneNumber: initialData?.phoneNumber || ''
    });

    // Form-level message
    let formMessage = $state<Message | undefined>(undefined);

    // Validation state
    let validationState = $state({
        firstName: { isValid: true, message: undefined as Message | undefined },
        lastName: { isValid: true, message: undefined as Message | undefined },
        displayName: { isValid: true, message: undefined as Message | undefined },
        phoneNumber: { isValid: true, message: undefined as Message | undefined }
    }); 

    // Reference to the first name field container
    let firstNameField: HTMLElement;

    // Validate initial values and notify parent
    onMount(() => {
        if (formState.firstName || formState.lastName || formState.displayName || formState.phoneNumber) {
            const isValid = validateAll(false);
            onValidityChange?.(isValid);
        }
        
        // Focus the first name input when the component is mounted
        // Use a small timeout to ensure the DOM is fully rendered
        setTimeout(() => {
            if (firstNameField) {
                // Find the input element within the field container
                const inputElement = firstNameField.querySelector('input');
                if (inputElement) {
                    inputElement.focus();
                }
            }
        }, 100);
    });

    // Handle input changes and update state
    function handleInput(field: keyof typeof formState, value: string) {
        formState[field] = value;
        
        // Only validate the changed field
        switch(field) {
            case 'firstName':
                validationState.firstName.isValid = validateName(value, 'firstName', true);
                break;
            case 'lastName':
                validationState.lastName.isValid = validateName(value, 'lastName', true);
                break;
            case 'displayName':
                validationState.displayName.isValid = validateDisplayName(value, true);
                break;
            case 'phoneNumber':
                validationState.phoneNumber.isValid = validatePhone(value, true);
                break;
        }

        // Check overall validity without showing messages
        const isValid = validateAll(false);
        onValidityChange?.(isValid);
        
        onDataChange?.({
            email: formState.email,
            firstName: formState.firstName,
            lastName: formState.lastName,
            displayName: formState.displayName,
            phoneNumber: formState.phoneNumber
        });
    }

    // Validation functions with optional message generation
    function validateName(value: string, field: 'firstName' | 'lastName', showMessage: boolean): boolean {
        if (value.length === 0) {
            if (showMessage) {
                validationState[field].message = {
                    type: 'info',
                    text: `Enter your ${field === 'firstName' ? 'first' : 'last'} name`
                };
            }
            return false;
        }
        if (value.length < 2) {
            if (showMessage) {
                validationState[field].message = {
                    type: 'error',
                    text: 'Name must be at least 2 characters'
                };
            }
            return false;
        }
        if (showMessage) {
            validationState[field].message = {
                type: 'success',
                text: "Look'n good!"
            };
        }
        return true;
    }

    function validateDisplayName(value: string, showMessage: boolean): boolean {
        if (value.length === 0) {
            if (showMessage) {
                validationState.displayName.message = {
                    type: 'info',
                    text: 'Choose how you want to be known'
                };
            }
            return true; // Optional field
        }
        if (value.length < 2) {
            if (showMessage) {
                validationState.displayName.message = {
                    type: 'error',
                    text: 'Display name must be at least 2 characters'
                };
            }
            return false;
        }
        if (showMessage) {
            validationState.displayName.message = {
                type: 'success',
                text: 'Great choice!'
            };
        }
        return true;
    }

    function validatePhone(value: string, showMessage: boolean): boolean {
        if (value.length === 0) {
            if (showMessage) {
                validationState.phoneNumber.message = undefined;
            }
            return true; // Optional field
        }
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) {
            if (showMessage) {
                validationState.phoneNumber.message = {
                    type: 'error',
                    text: 'Please enter a valid phone number with country code'
                };
            }
            return false;
        }
        if (showMessage) {
            validationState.phoneNumber.message = {
                type: 'success',
                text: 'Valid phone number'
            };
        }
        return true;
    }

    // Validate all fields
    function validateAll(showMessages: boolean): boolean {
        const isFirstNameValid = validateName(formState.firstName, 'firstName', showMessages);
        const isLastNameValid = validateName(formState.lastName, 'lastName', showMessages);
        const isDisplayNameValid = validateDisplayName(formState.displayName, showMessages);
        const isPhoneValid = validatePhone(formState.phoneNumber, showMessages);

        const isValid = isFirstNameValid && isLastNameValid && isDisplayNameValid && isPhoneValid;

        // Only show form message on submit error
        if (!isValid && showSubmitError) {
            formMessage = {
                type: 'error',
                text: 'Please fix the validation errors before continuing'
            };
        } else {
            formMessage = undefined;
        }

        return isValid;
    }

    // Watch for showSubmitError changes
    $effect(() => {
        if (showSubmitError) {
            validateAll(true);
        }
    });
</script>

<div class="form-container">
    <TextField
        label="Email Address"
        value={formState.email}
        disabled={true}
        hint="This email is associated with your account"
    />

    <div bind:this={firstNameField}>
        <TextField
            label="First Name"
            hint="Required"
            value={formState.firstName}
            validate={(value) => {
                handleInput('firstName', value);
                return validationState.firstName.isValid;
            }}
            message={validationState.firstName.message}
        />
    </div>
    
    <TextField
        label="Last Name"
        hint="Required"
        value={formState.lastName}
        validate={(value) => {
            handleInput('lastName', value);
            return validationState.lastName.isValid;
        }}
        message={validationState.lastName.message}
    />

    <TextField
        label="Display Name"
        hint="Required. You can change this later."
        value={formState.displayName}
        validate={(value) => {
            handleInput('displayName', value);
            return validationState.displayName.isValid;
        }}
        message={validationState.displayName.message}
    />

    <TextField
        label="Phone Number"
        placeholder="+61"
        hint="Optional"
        value={formState.phoneNumber}
        validate={(value) => {
            handleInput('phoneNumber', value);
            return validationState.phoneNumber.isValid;
        }}
        message={validationState.phoneNumber.message}
    />

    <div class="form-message-container">
        {#if formMessage && showSubmitError}
            <div class="form-message"
                    class:error={formMessage.type === 'error'}
                    class:warn={formMessage.type === 'warn'}
                    class:info={formMessage.type === 'info'}
                    class:success={formMessage.type === 'success'}>
                {formMessage.text}
            </div>
        {/if}
    </div>
</div>

<style lang="sass">


</style> 