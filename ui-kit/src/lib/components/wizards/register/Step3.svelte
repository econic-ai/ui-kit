<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '@econic/ui-kit/components';
	import { wizardStore, registration } from '@econic/ui-kit/stores';

	const { back, exit } = $props<{
		back?: () => void;
		exit?: () => void;
	}>();
	
	// Track submission state
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);
	let submitSuccess = $state(false);

	// Automatic form submission when component loads
	let hasSubmitted = $state(false);
	
	$effect(() => {
		// Mark this step as completed in the wizard
		wizardStore.setStepState('register', 3, 'completed');
		
		// Submit form data automatically if not already submitted
		if (!hasSubmitted) {
			submitFormData();
		}
	});

	async function submitFormData() {
		// Only submit once
		if (hasSubmitted || isSubmitting) return;
		
		isSubmitting = true;
		hasSubmitted = true;
		submitError = null;
		
		try {
			// Get data from all wizard steps
			const step1 = wizardStore.getStep('register', 1);
			const step2 = wizardStore.getStep('register', 2);
			
			// Combine all data into one submission
			const registrationData = {
				personalInfo: step1?.data || {},
				preferences: step2?.data || {},
				submittedFrom: window.location.href,
				timestamp: new Date().toISOString()
			};
			
			// Submit to our API endpoint using the registration API
			const result = await registration.submitRegistration(registrationData);
			
			if (result.success) {
				submitSuccess = true;
			} else {
				submitError = result.error || 'Failed to submit registration';
				console.error('Registration submission failed:', submitError);
			}
		} catch (error) {
			submitError = error instanceof Error ? error.message : 'An unknown error occurred';
			console.error('Error in form submission:', submitError);
		} finally {
			isSubmitting = false;
		}
	}

	function handleComplete() {
		goto('/');
	}

	function handleBack() {
		back?.();
	}

	function handleExit() {
		exit?.();
	}
</script>

<div class="wizard-step">
	<div class="wizard-step-header register--welcome-header">
		<div class="step-header-bounded">
			<h1 class="__text_3xl __text-gradient wizard-step-title">Welcome to Econic.</h1>
			<p class="__text_md __text-gradient welcome-message">It's great to have you aboard. <br> We'll reach out with any exciting news.</p>
			
			{#if submitError}
				<div class="submission-error">
					<p>There was a problem saving your information. Don't worry, we've still got you covered!</p>
				</div>
			{/if}
		</div>
	</div>
	
	<div class="button-container">
		<div class="button-group-left">
			<Button onClick={handleExit}>Exit</Button>
		</div>
		<div class="button-group-right">
			<Button onClick={handleBack}>Back</Button>
			<Button onClick={handleComplete} disabled={isSubmitting}>
				{isSubmitting ? 'Processing...' : 'Return to site'}
			</Button>
		</div>
	</div>
</div>

<style lang="sass">
.register--welcome-header
    flex: 1

.welcome-message
    text-align: center

    // @media (min-width: $breakpoint-lg)
    //   display: flex
    //   align-items: center
    //   justify-content: center

.submission-error
    margin-top: 1rem
    padding: 1rem
    border-radius: 0.5rem
    background-color: rgba(220, 53, 69, 0.1)
    color: #dc3545
    font-size: 0.9rem
</style>
