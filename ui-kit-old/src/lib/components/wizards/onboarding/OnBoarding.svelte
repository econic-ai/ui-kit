<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { wizardStore, type WizardStep, type WizardTree } from '@econic/ui-kit/stores';
	import Step1 from './Step1.svelte';
	import Step2 from './Step2.svelte';
    import Step3 from './Step3.svelte';
    import Step4 from './Step4.svelte';
    import Step5 from './Step5.svelte';
    import WizardShell from '../WizardShell.svelte';


    let totalSteps: number = 5;
    let currentStep = $state(1);
    let previousStep = $state(1); // Track previous step to prevent circular updates

    let { exitCallback } = $props<{ exitCallback: () => void }>();

    // Create a direct subscription to the wizard store
    let wizardTree = $state<WizardTree>(wizardStore.getAll());
    
    // Get steps directly from the wizard store
    let steps = $state<WizardStep[]>([]);

    // Update steps whenever wizardTree changes
    $effect(() => {
        const wizard = wizardTree['onboarding'];
        steps = wizard ? wizard.steps : [];
    });

    // Subscribe to store changes
    $effect(() => {
        const unsubscribe = wizardStore.subscribe(updatedWizards => {
            wizardTree = updatedWizards;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });

    // Handle URL changes in a separate effect
    $effect(() => {
        // Handle URL changes
        const stepParam = $page.params.step;
        if (stepParam) {
            const stepNumber = parseInt(stepParam.replace('step', ''));
            if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber !== previousStep) {
                currentStep = stepNumber;
                previousStep = currentStep; // Update previous step
                
                // Only update the store if the current step is different from what's in the store
                const wizard = wizardTree['onboarding'];
                if (wizard && wizard.currentStep !== currentStep) {
                    wizardStore.setCurrentStep('onboarding', currentStep);
                }
            }
        } else {
            // If no step in URL, redirect to step1
            goto('/flow/onboarding/step1', { replaceState: true });
        }
    });

    function goToNextStep() {
        if (currentStep < totalSteps) {
            const nextStep = currentStep + 1;
            goto(`/flow/onboarding/step${nextStep}`);
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            goto(`/flow/onboarding/step${prevStep}`);
        }
    }
</script>

<WizardShell 
    canExit={false} 
    {exitCallback}
    {steps}
    {currentStep}
    wizardClass="onboarding"
>
    {#if currentStep === 1}
        <Step1 next={goToNextStep} exit={exitCallback} />
    {:else if currentStep === 2}
        <Step2 next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />
    {:else if currentStep === 3}
        <Step3 next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />                
    {:else if currentStep === 4}
        <Step4 next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />                
    {:else if currentStep === 5}
        <Step5 back={goToPreviousStep} exit={exitCallback} />                
    {/if}
</WizardShell>