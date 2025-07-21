<script lang="ts">
	import { Button } from '@econic/ui-kit/components';
	import { TextField } from '@econic/ui-kit/components';
	import type { Message } from '@econic/ui-kit/components';
	import { wizardStore } from '@econic/ui-kit/stores';
	import OptionsGroup from '../../OptionsGroup.svelte';

	const { next, exit } = $props<{
		next?: () => void;
		exit?: () => void;
	}>();

	const formState = $state({
		firstName: '',
		lastName: '',
		email: '',
		country: ''
	});

	const interestSelections = $state({
		'Becoming a Beta Tester': false,
		'Investing': false,
		'Open Source Projects': false,
		'Joining the Team': false,
		'Staying Informed': false,
	});

	const userTypeSelections = $state({
		'An Individual': false,
		'A Business': false,
		'A Community': false,
	});

	const validationState = $state({
		firstName: { isValid: false, message: undefined as Message | undefined },
		lastName: { isValid: false, message: undefined as Message | undefined },
		email: { isValid: false, message: undefined as Message | undefined },
		country: { isValid: false, message: undefined as Message | undefined },
		userType: { isValid: false, message: undefined as Message | undefined },
		interests: { isValid: false, message: undefined as Message | undefined }
	});

	// State to track overall form validity
	let isFormValid = $state(false);

	function getInterestIcon(interest: string): string {
		const iconMap: { [key: string]: string } = {
			'Becoming a Beta Tester': 'fa-flask',
			'Investing': 'fa-chart-line',
			'Open Source Projects': 'fa-code',
			'Joining the Team': 'fa-users',
			'Staying Informed': 'fa-bell'
		};
		return iconMap[interest] || 'fa-question';
	}

	function getUserTypeIcon(type: string): string {
		const iconMap: { [key: string]: string } = {
			'An Individual': 'fa-user',
			'A Business': 'fa-building',
			'A Community': 'fa-users-rectangle'
		};
		return iconMap[type] || 'fa-question';
	}

	function handleInput(field: keyof typeof formState, value: string) {
		formState[field] = value;

		// Validate the changed field
		switch (field) {
			case 'firstName':
				validationState.firstName.isValid = validateName(value, 'firstName', true);
				break;
			case 'lastName':
				validationState.lastName.isValid = validateName(value, 'lastName', true);
				break;
			case 'email':
				validationState.email.isValid = validateEmail(value, true);
				break;
			case 'country':
				validationState.country.isValid = validateCountry(value, true);
				break;
		}

		// Update wizard store step data
		wizardStore.setStepData('register', 1, {
			...formState,
			interestSelections,
			userTypeSelections
		});
		
		// Check overall form validity
		validateForm();
	}

	function validateName(
		value: string,
		field: 'firstName' | 'lastName' | 'country',
		showMessage: boolean
	): boolean {
		if (value.length === 0) {
			if (showMessage) {
				validationState[field].message = {
					type: 'info',
					text: `Enter your ${field === 'firstName' ? 'first' : field === 'lastName' ? 'last' : 'country'}`
				};
			}
			return false;
		}
		if (value.length < 2) {
			if (showMessage) {
				validationState[field].message = {
					type: 'error',
					text: 'Must be at least 2 characters'
				};
			}
			return false;
		}
		if (showMessage) {
			validationState[field].message = {
				type: 'success',
				text: "Hi there."
			};
		}
		return true;
	}

	function validateEmail(value: string, showMessage: boolean): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (value.length === 0) {
			if (showMessage) {
				validationState.email.message = {
					type: 'info',
					text: 'Enter your email address'
				};
			}
			return false;
		}

		if (!emailRegex.test(value)) {
			if (showMessage) {
				validationState.email.message = {
					type: 'error',
					text: 'Please enter a valid email address'
				};
			}
			return false;
		}

		if (showMessage) {
			validationState.email.message = {
				type: 'success',
				text: 'Great.'
			};
		}
		return true;
	}

	function validateCountry(value: string, showMessage: boolean): boolean {
		return validateName(value, 'country', showMessage);
	}

	// Validate user type selections
	function validateUserType(): boolean {
		const hasSelection = Object.values(userTypeSelections).some(value => value);
		validationState.userType.isValid = hasSelection;
		return hasSelection;
	}

	// Validate interest selections
	function validateInterests(): boolean {
		const hasSelection = Object.values(interestSelections).some(value => value);
		validationState.interests.isValid = hasSelection;
		return hasSelection;
	}

	// Check overall form validity
	function validateForm() {
		const textFieldsValid = 
			validationState.firstName.isValid &&
			validationState.lastName.isValid &&
			validationState.email.isValid
		
		const selectionsValid = validateUserType() && validateInterests();
		
		isFormValid = textFieldsValid && selectionsValid;
		
		if (isFormValid) {
			wizardStore.setStepState('register', 1, 'completed');
		} else {
			wizardStore.setStepState('register', 1, 'active');
		}
		

		// console.log('Validation State:', {
		// 	firstName: validationState.firstName.isValid,
		// 	lastName: validationState.lastName.isValid,
		// 	email: validationState.email.isValid,
		// 	country: validationState.country.isValid,
		// 	userType: validationState.userType.isValid,
		// 	interests: validationState.interests.isValid
		// });

		return isFormValid;
	}

	function handleInterestSelection(key: string) {
		interestSelections[key] = !interestSelections[key];
		validateInterests();
		validateForm();
		
		// Update wizard store
		wizardStore.setStepData('register', 1, {
			...formState,
			interestSelections,
			userTypeSelections
		});
	}

	function handleUserTypeSelection(key: string) {
		// Set the selected option to true and others to false (radio button behavior)
		Object.keys(userTypeSelections).forEach(k => {
			userTypeSelections[k] = (k === key);
		});
		
		validateUserType();
		validateForm();
		
		// Update wizard store
		wizardStore.setStepData('register', 1, {
			...formState,
			interestSelections,
			userTypeSelections
		});
	}

	function handleNext() {
		if (isFormValid) {
			next?.();
		}
	}

	function handleExit() {
		exit?.();
	}
</script>

<div class="wizard-step">
	<div class="wizard-step-header">
		<div class="step-header-bounded">
			<h1 class="__text_3xl __text-gradient wizard-step-title">Welcome to Econic</h1>
			<p class="__text_md wizard-step-description">Tell us who you are.</p>
		</div>
	</div>

	<div class="wizard-step-content">
		<div class="step-scrollable-content">
			<div class="step-bounded">
				<div class="space-filler"></div>
				<div class="form-container">
					<TextField
						label="Email"
						value={formState.email}
						hint="Required"
						validate={(value) => {
							handleInput('email', value);
							return validationState.email.isValid;
						}}
						message={validationState.email.message}
					/>
				</div>

				<OptionsGroup
					title="I'm interested in"
					description="(at least one required)"
					options={Object.entries(interestSelections).map(([key, value]) => ({ key, value }))}
					getIcon={getInterestIcon}
					onSelect={handleInterestSelection}
				/>

				<OptionsGroup
					title="I am"
					description="(select one)"
					options={Object.entries(userTypeSelections).map(([key, value]) => ({ key, value }))}
					getIcon={getUserTypeIcon}
					onSelect={handleUserTypeSelection}
				/>

				<div class="form-container">
					<TextField
						label="First Name"
						value={formState.firstName}
						hint="Required"
						validate={(value) => {
							handleInput('firstName', value);
							return validationState.firstName.isValid;
						}}
						message={validationState.firstName.message}
					/>
					<TextField
						label="Last Name"
						value={formState.lastName}
						hint="Required"
						validate={(value) => {
							handleInput('lastName', value);
							return validationState.lastName.isValid;
						}}
						message={validationState.lastName.message}
					/>

					<TextField
						label="Country"
						value={formState.country}
						hint="Required"
						validate={(value) => {
							handleInput('country', value);
							return validationState.country.isValid;
						}}
						message={validationState.country.message}
						options={['United States', 'Canada', 'United Kingdom', 'Australia', 'New Zealand', 'Other']}
					/>
				</div>
			</div>
			<div class="space-filler"></div>
		</div>

		<div class="button-container">
			<div class="button-group-left">
				<Button onClick={handleExit}>Exit</Button>
			</div>

			<div class="button-group-right">
				<Button onClick={handleExit}>Exit</Button>
				<Button onClick={handleNext} disabled={!isFormValid}>Next</Button>
			</div>
		</div>
	</div>
</div>

<style lang="sass">
    
</style>
