<script lang="ts">
    import { Button } from '@econic/ui-kit/components';
    import { wizardStore, type WizardStepState } from '@econic/ui-kit/stores';
    import PaymentDetails from '../PaymentDetails.svelte';
    import UserDetailsForm from '../UserDetailsForm.svelte';

   const { next, exit, back } = $props<{
        next?: () => void,
        exit?: () => void,
        back?: () => void
    }>();

    // Get the wizard and relevant steps
    const wizard = wizardStore.getWizard('onboarding');
    const planStep = wizard?.steps.find(s => s.number === 3);
    const detailsStep = wizard?.steps.find(s => s.number === 4);

    // Initialize selected plan from step data
    let selectedPlan = $state<string | undefined>(planStep?.data?.plan);    

    // Initialize form data from step data
    let formData = $state(detailsStep?.data || {
        email: '',
        firstName: '',
        lastName: '',
        displayName: '',
        phoneNumber: ''
    });

    // Form validity state
    let isFormValid = $state(false);
    let showSubmitError = $state(false);

    // Handle form data changes
    function handleFormDataChange(data: any) {
        formData = data;
        wizardStore.setStepData('onboarding', 4, data);
    }

    // Handle form validity changes
    function handleFormValidityChange(isValid: boolean) {
        isFormValid = isValid;
        const state: WizardStepState = isValid ? 'completed' : 'not_started';
        wizardStore.setStepState('onboarding', 4, state);
    }

    async function handleNext() {
        if (!isFormValid) {
            showSubmitError = true;
            wizardStore.setStepState('onboarding', 4, 'error');
            return;
        }
        showSubmitError = false;
        wizardStore.setStepState('onboarding', 4, 'completed');
        next?.();
    }

    function handleBack() {
        showSubmitError = false;
        back?.();
    }

    function handleExit() {
        showSubmitError = false;
        exit?.();
    }

    // Set initial state based on form data
    $effect(() => {
        if (formData.firstName && formData.lastName) {
            const isValid = formData.firstName.length >= 2 && formData.lastName.length >= 2;
            if (isValid) {
                wizardStore.setStepState('onboarding', 4, 'completed');
            }
        }
    });
</script>

<div class="wizard-step">
    <h1>Your Details</h1>
    <p class="wizard-step-content-description">Tell us a bit about yourself.</p>
    <div class="wizard-step-content">
        <div class="step-content-flex">
            <!-- <div class="form-section"> -->
                <UserDetailsForm 
                    onValidityChange={handleFormValidityChange}
                    onDataChange={handleFormDataChange}
                    initialData={formData}
                    {showSubmitError}
                />
            <!-- </div> -->
            <div class="payment-section">
                <PaymentDetails selectedPlan={selectedPlan} />
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>        
        <Button onClick={handleNext} disabled={!isFormValid}>Continue</Button>
    </div>
</div>

<style lang="sass">

.payment-section
    flex: 1
    display: flex
    align-items: center
    justify-content: center
    
</style>

