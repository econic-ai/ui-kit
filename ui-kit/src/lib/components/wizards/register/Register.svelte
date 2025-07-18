<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { WizardShell } from '@econic/ui-kit/components';
	import { wizardStore, type WizardStep, type WizardTree } from '@econic/ui-kit/stores';
	import Step1 from './Step1.svelte';
	import Step2 from './Step2.svelte';
	import Step3 from './Step3.svelte';

	const totalSteps: number = 3;
	let currentStep = $state(1);
	let previousStep = $state(1); // Track previous step to prevent circular updates

	const { exitCallback } = $props<{ exitCallback: () => void }>();

	// Create a direct subscription to the wizard store
	let wizardTree = $state<WizardTree>(wizardStore.getAll());

	// Get steps directly from the wizard store
	let steps = $state<WizardStep[]>([]);

	// Update steps whenever wizardTree changes
	$effect(() => {
		const wizard = wizardTree['register'];
		steps = wizard ? wizard.steps : [];
	});

	// Subscribe to store changes
	$effect(() => {
		const unsubscribe = wizardStore.subscribe((updatedWizards) => {
			wizardTree = updatedWizards;
		});

		return unsubscribe; // Cleanup on component destruction
	});

	// Handle URL changes in a separate effect
	$effect(() => {
		// Handle URL changes
		const stepParam = page.params.step;
		if (stepParam) {
			const stepNumber = parseInt(stepParam.replace('step', ''));
			if (stepNumber >= 1 && stepNumber <= totalSteps && stepNumber !== previousStep) {
				currentStep = stepNumber;
				previousStep = currentStep; // Update previous step

				// Only update the store if the current step is different from what's in the store
				const wizard = wizardTree['register'];
				if (wizard && wizard.currentStep !== currentStep) {
					wizardStore.setCurrentStep('register', currentStep);
				}
			}
		} else {
			// If no step in URL, redirect to step1
			goto('/flow/register/step1', { replaceState: true });
		}
	});

	function goToNextStep() {
		if (currentStep < totalSteps) {
			const nextStep = currentStep + 1;
			goto(`/flow/register/step${nextStep}`);
		} else {
			console.log('Completed');
		}
	}

	function goToPreviousStep() {
		if (currentStep > 1) {
			const prevStep = currentStep - 1;
			goto(`/flow/register/step${prevStep}`);
		}
	}
</script>

<WizardShell 
	canExit={true} 
	{exitCallback}
	{steps}
	{currentStep}
	wizardClass="register"
	maxWidth="2000"
>
	{#if currentStep === 1}
		<Step1 next={goToNextStep} exit={exitCallback} />
	{:else if currentStep === 2}
		<Step2 next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />
	{:else if currentStep === 3}
		<Step3 back={goToPreviousStep} exit={exitCallback} />
	{/if}
</WizardShell>


<style lang="sass">

</style>