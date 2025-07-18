<script lang="ts">
	import { Button } from '@econic/ui-kit/components';
	import { TextField } from '@econic/ui-kit/components';
	import { wizardStore } from '@econic/ui-kit/stores';
	import OptionsGroup from '../../OptionsGroup.svelte';

	const { next, back, exit } = $props<{
		next?: () => void;
		back?: () => void;
		exit?: () => void;
	}>();

	const featureSelections = $state({
		'AI For Productivity': false,
		'AI For Insights': false,
		'AI For Collaboration': false,
		'AI For Personalisation': false,
		'One Place To Store My Data': false,
		'AI For Enterprises': false,
		'It\'s Just Cool.': false,
	});

	const sourceSelections = $state({
		'Online': false,
		'Friend': false,
		'Ad': false,
		'Other': false,
	});

	let additionalInfo = $state('');

	function getFeatureIcon(feature: string): string {
		const iconMap: { [key: string]: string } = {
			'AI For Productivity': 'fa-cubes',
			'AI For Insights': 'fa-lightbulb',
			'AI For Collaboration': 'fa-users',
			'AI For Personalisation': 'fa-star',
			'Single Place To Store My Data': 'fa-database',
			'AI For Enterprises': 'fa-building',
			'It\'s Just Cool.': 'fa-rocket'
		};
		return iconMap[feature] || 'fa-cube';
	}

	function getSourceIcon(source: string): string {
		const iconMap: { [key: string]: string } = {
			'Online': 'fa-globe',
			'Friend': 'fa-user-friends',
			'Ad': 'fa-ad',
			'Other': 'fa-ellipsis-h'
		};
		return iconMap[source] || 'fa-question';
	}
	
	// Update the wizard store whenever data changes
	function updateWizardStore() {
		wizardStore.setStepData('register', 2, {
			featureSelections,
			sourceSelections,
			additionalInfo
		});
	}
	
	// Handle feature selection changes
	function handleFeatureSelection(key: string) {
		featureSelections[key] = !featureSelections[key];
		updateWizardStore();
	}
	
	// Handle source selection changes
	function handleSourceSelection(key: string) {
		sourceSelections[key] = !sourceSelections[key];
		updateWizardStore();
	}
	
	// Handle additional info changes
	$effect(() => {
		updateWizardStore();
	});

	$effect(() => {
		wizardStore.setStepState('register', 2, 'completed');
	});

	function handleNext() {
		next?.();
	}

	function handleBack() {
		back?.();
	}

	function handleExit() {
		exit?.();
	}
</script>

<div class="wizard-step">
	<div class="wizard-step-header">
		<div class="step-header-bounded">
			<h1 class="__text_3xl __text-gradient wizard-step-title ">Tell us more</h1>
			<p class="__text_md wizard-step-description">Help us understand your needs better.</p>
		</div>
	</div>

	<!-- <div class="wizard-step-content"> -->
		<div class="step-scrollable-content">
			<div class="step-bounded">
				<OptionsGroup
					title="What Features Interested You The Most?"
					options={Object.entries(featureSelections).map(([key, value]) => ({ key, value }))}
					getIcon={getFeatureIcon}
					onSelect={handleFeatureSelection}
				/>

				<OptionsGroup
					title="Where Did You Hear About Us?"
					options={Object.entries(sourceSelections).map(([key, value]) => ({ key, value }))}
					getIcon={getSourceIcon}
					onSelect={handleSourceSelection}
				/>

				<div class="textarea-field">
					<div class="label-container">
						<h3 class="__text_sm options-header">Additional Message for Us:</h3>
					</div>
					<div class="input-container">
						<textarea bind:value={additionalInfo} rows="4"></textarea>
					</div>
				</div>
			</div>
		</div>

		<div class="button-container">
			<div class="button-group-left">
				<Button onClick={handleExit}>Exit</Button>
			</div>
			<div class="button-group-right">
				<Button onClick={handleBack}>Back</Button>
				<Button onClick={handleNext}>Submit</Button>
			</div>
		</div>
	<!-- </div> -->
</div>

<style lang="sass">

.options-header
    font-weight: 300
    color: var(--sk-fg-1)
    margin-bottom: var(--sk-space-10)
	
.textarea-field
    margin-bottom: 3rem

    .input-container
        textarea
            width: 100%
            border: 1px solid var(--sk-border)
            background: transparent
            padding: 1rem
            color: var(--sk-fg-1)
            font-size: 1.6rem
            transition: all 0.2s ease
            outline: none
            resize: vertical
            min-height: 250px
            border-radius: 8px

            &:focus
                border-color: #3b82f6

// .button-container
//     display: flex
//     justify-content: space-between
//     gap: 1rem
//     margin-top: 2rem

// .button-group-right
//     display: flex
//     gap: 1rem
</style>
