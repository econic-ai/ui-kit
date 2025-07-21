<script lang="ts">
    import { Button } from '@econic/ui-kit/components';
    import { wizardStore, lastAppRoute, type Wizard } from '@econic/ui-kit/stores';
    import ConfigurationBox from '../ConfigurationBox.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    const { back, exit } = $props<{
        back?: () => void,
        exit?: () => void
    }>();

    // Get the wizard and current step
    const wizard = wizardStore.getWizard('onboarding');
    const step = wizard?.steps.find(s => s.number === 5);
    
    // Get all wizards from the store
    const wizardTree = $state(wizardStore.getAll());
    
    // Type guard function
    function isWizardWithCategory(w: any): w is Wizard {
        return w && typeof w === 'object' && 'id' in w && 'category' in w;
    }

    // Filter wizards by category and enabled status
    const suggestedConfigs = Object.values(wizardTree)
        .filter(isWizardWithCategory)
        .filter(w => 
            w.category === 'suggested' && 
            w.enabled !== undefined && w.enabled !== null
        );
    
    const otherConfigs = Object.values(wizardTree)
        .filter(isWizardWithCategory)
        .filter(w => 
            w.category === 'other' && 
            w.enabled !== undefined && w.enabled !== null
        );

    // Get preselected wizard IDs
    const preselectedWizardIds = Object.values(wizardTree)
        .filter(isWizardWithCategory)
        .filter(w => w.preselected)
        .map(w => w.id);

    // Initialize selected options from step data or preselected options
    let selectedOptions = $state<string[]>(
        (step?.data?.selectedOptions && step?.data?.selectedOptions.length > 0) 
            ? step.data.selectedOptions 
            : preselectedWizardIds
    );

    onMount(() => {
        // If no options are selected, use preselected wizards
        if (selectedOptions.length === 0) {
            selectedOptions = preselectedWizardIds;
        }
        
        // Save initial options to step data
        wizardStore.setStepData('onboarding', 5, { selectedOptions });
    });

    function handleOptionSelect(optionId: string) {
        const index = selectedOptions.indexOf(optionId);
        if (index === -1) {
            selectedOptions = [...selectedOptions, optionId];
        } else {
            selectedOptions = selectedOptions.filter(id => id !== optionId);
        }

        // Update step data and state
        wizardStore.setStepData('onboarding', 5, { selectedOptions });
    }

    function findNextWizard() {
        // Find the next wizard based on selected options
        const selectedWizards = Object.values(wizardTree)
            .filter(isWizardWithCategory)
            .filter(w => selectedOptions.includes(w.id));
        
        // Find the first wizard with a wizardRoute
        const nextWizard = selectedWizards.find(w => w.wizardRoute);
        return nextWizard;
    }

    async function handleNext() {
        wizardStore.setStepState('onboarding', 5, 'completed');
        const nextWizard = findNextWizard();
        if (nextWizard && nextWizard.wizardRoute) {
            // Remove this wizard from selected options
            selectedOptions = selectedOptions.filter(id => id !== nextWizard.id);
            wizardStore.setStepData('onboarding', 5, { selectedOptions });
            // Navigate to the next wizard
            goto(nextWizard.wizardRoute);
        } else {
            // No more wizards to process, exit the onboarding successfully
            if ($lastAppRoute) {
                goto($lastAppRoute, { replaceState: true });
            } else {
                goto('/', { replaceState: true });
            }
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
    <div class="wizard-step-content">
        <h1>Configuration</h1>
        <p class="wizard-step-content-description">Choose your preferred configuration options.</p>
        
        <div class="step-content-container">
            <div class="step-scrollable-content">
                {#if suggestedConfigs.length > 0}
                <div class="config-section">
                    <h2>Configurations</h2>
                    <div class="config-grid">
                        {#each suggestedConfigs as config}
                            <ConfigurationBox 
                                option={config}
                                selected={selectedOptions.includes(config.id)}
                                onSelect={handleOptionSelect}
                            />
                        {/each}
                    </div>
                </div>
                {/if}

                {#if otherConfigs.length > 0}
                <div class="config-section">
                    <h2>Enterprise Configurations</h2>
                    <div class="config-grid">
                        {#each otherConfigs as config}
                            <ConfigurationBox 
                                option={config}
                                selected={selectedOptions.includes(config.id)}
                                onSelect={handleOptionSelect}
                            />
                        {/each}
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleNext}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>
        <Button onClick={handleNext}>Continue</Button>
    </div>
</div>

<style lang="sass">
.config-section
    margin-bottom: 3rem

    h2
        color: var(--sk-fg-1)
        font-size: 1.4rem
        margin-bottom: 1.5rem

.config-grid
    display: grid
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
    gap: 1.5rem
    width: 100%
</style>

