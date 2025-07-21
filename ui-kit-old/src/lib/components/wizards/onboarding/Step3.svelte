<script lang="ts">
    import { Button, SubscriptionPricing } from '@econic/ui-kit/components';
    import { wizardStore, type WizardTree, type WizardStep } from '@econic/ui-kit/stores';

    const { next, exit, back } = $props<{
        next?: () => void,
        exit?: () => void,
        back?: () => void
    }>();

    // Initialize selected plan
    let selectedPlan = $state<string | undefined>(undefined);
    
    // Store the current wizard tree
    let wizardTree = $state<WizardTree>(wizardStore.getAll());
    
    // Subscribe to the wizard store to get real-time updates
    $effect(() => {
        const unsubscribe = wizardStore.subscribe((updatedWizards) => {
            wizardTree = updatedWizards;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });
    
    // Get the current step data when the component initializes or wizardTree changes
    $effect(() => {
        const wizard = wizardTree['onboarding'];
        if (wizard) {
            const step = wizard.steps.find((s: WizardStep) => s.number === 3);
            if (step?.data?.plan) {
                selectedPlan = step.data.plan;
            }
        }
    });

    function handlePlanSelect(plan: string) {
        selectedPlan = plan;
        
        // Update step data and state immediately
        wizardStore.setStepData('onboarding', 3, { plan });
        wizardStore.setStepState('onboarding', 3, 'completed');
    }

    async function handleNext() {
        if (selectedPlan) {
            next?.();
        }
    }

    function handleBack() {
        back?.();
    }    

    function handleExit() {
        exit?.();
    }    
</script>

<div class="wizard-step">
    <h1>Choose your plan.</h1>
    <p class="wizard-step-content-description">Choose a plan that suits your needs.</p>
    <div class="wizard-step-content">
        <SubscriptionPricing onSelect={handlePlanSelect} selectedPlan={selectedPlan} />
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>
        <Button onClick={handleNext} disabled={!selectedPlan}>Continue</Button>
    </div>
</div>

<style lang="sass">
.wizard-step-content
    display: flex
    justify-content: center
    align-items: center
    padding: 2rem
</style>

