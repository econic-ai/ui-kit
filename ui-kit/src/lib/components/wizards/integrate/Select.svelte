<script lang="ts">
    import { Button, DataSources } from '@econic/ui-kit/components';
    import { dataSourcesStore, wizardStore, type WizardTree, type DataSource } from '@econic/ui-kit/stores';
    import { goto } from '$app/navigation';

    const { next, back, exit } = $props<{
        next?: () => void,
        back?: () => void,
        exit?: () => void
    }>();

    // Track the number of queued and active data sources
    let queuedSourcesCount = $state(0);
    let activeSourcesCount = $state(0);
    
    // Store the current wizard tree
    let wizardTree = $state<WizardTree>(wizardStore.getAll());
    
    // Store the data sources
    let dataSources = $state<DataSource[]>([]);
    
    // Subscribe to the wizard store to get real-time updates
    $effect(() => {
        const unsubscribe = wizardStore.subscribe((updatedWizards) => {
            wizardTree = updatedWizards;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });
    
    // Subscribe to the data sources store
    $effect(() => {
        const unsubscribe = dataSourcesStore.subscribe((sources) => {
            dataSources = sources;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });
    
    // Update counts when data sources change
    $effect(() => {
        queuedSourcesCount = dataSources.filter(source => source.status === 'queued').length;
        
        // Update wizard step state based on the counts
        if (queuedSourcesCount > 0) {
            wizardStore.setStepState('integrate', 1, 'completed');
        } else {
            wizardStore.setStepState('integrate', 1, 'not_started');
        }
    });

    function handleNext() {
        if (queuedSourcesCount > 0) {
            next?.();
        } else {
            // Show a message or alert that no sources are selected
            alert('Please select at least one data source to continue.');
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
        <h1>Select your data sources</h1>
        <div class="step-content-container">
            <div class="step-scrollable-content">
                <div class="step-content-centered">
                    <DataSources />
                </div>
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>
        <Button onClick={handleNext} disabled={queuedSourcesCount === 0}>Next</Button>
    </div>
</div>


