<script lang="ts">
    import { Button } from '@econic/ui-kit/components';
    import { page } from '$app/stores';
    import { wizardStore, dataSourcesStore, type DataSource, type WizardTree } from '@econic/ui-kit/stores';
    import { goto } from '$app/navigation';

    const { next, back, exit } = $props<{
        next?: () => void,
        back?: () => void,
        exit?: () => void
    }>();

    // Subscribe to the data sources store
    const dataSources = dataSourcesStore.getAll();
    
    // Create a direct subscription to the wizard store
    let wizardTree = $state<WizardTree>(wizardStore.getAll());
    
    // Subscribe to store changes
    $effect(() => {
        const unsubscribe = wizardStore.subscribe(updatedWizards => {
            wizardTree = updatedWizards;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });
    
    // Get active data sources (queued, syncing, integrated, error, failed)
    let activeDataSources = $derived(
        $dataSources.filter(source => 
            ["queued", "syncing", "integrated", "error", "failed"].includes(source.status)
        )
    );
    
    // Get the current substep from the URL
    let currentSourceId = $derived(
        $page.url.pathname.split('/').pop()
    );
    
    // Get the current data source
    let currentSource = $derived(
        currentSourceId && currentSourceId !== 'configure' 
            ? $dataSources.find(source => source.id === currentSourceId)
            : null
    );
    
    // Check if all sources are integrated
    let allIntegrated = $derived(
        activeDataSources.every((source: DataSource) => 
            source.status === "integrated"
        )
    );
    
    // Update the wizard step state based on integration status
    $effect(() => {
        // Update the main configure step state
        if (activeDataSources.length === 0) {
            // No active sources, step is not started
            wizardStore.setStepState('integrate', 2, 'not_started');
        } else if (allIntegrated) {
            // All sources integrated, step is completed
            wizardStore.setStepState('integrate', 2, 'completed');
        } else if (activeDataSources.some(source => source.status === 'error' || source.status === 'failed')) {
            // Some sources have errors, step has error
            wizardStore.setStepState('integrate', 2, 'error');
        } else {
            // Some sources are being processed, step is in progress
            wizardStore.setStepState('integrate', 2, 'in_progress');
        }
        
        // If we're viewing a specific source, update its substep state
        if (currentSource) {
            // Find the substep number for this source
            const configureStep = wizardTree['integrate']?.steps.find(step => step.number === 2);
            if (configureStep && configureStep.substeps) {
                const substep = configureStep.substeps.find(substep => 
                    (substep as any).dataSourceId === currentSource.id
                );
                
                if (substep) {
                    // Update the current step in the wizard
                    wizardStore.setCurrentStep('integrate', substep.number);
                }
            }
        } else {
            // If we're on the main configure page, set current step to 2
            wizardStore.setCurrentStep('integrate', 2);
        }
    });
    
    // Navigate to a specific data source configuration
    function navigateToSource(sourceId: string) {
        goto(`/flow/integrate/configure/${sourceId}`);
    }
    
    // Start or retry integration for a data source
    function startIntegration(sourceId: string) {
        // In a real app, this would trigger the actual integration process
        // For now, we'll just update the status to simulate the process
        dataSourcesStore.updateStatus(sourceId, "syncing");
        
        // Simulate integration completion after a delay
        setTimeout(() => {
            // Randomly succeed or fail
            const success = Math.random() > 0.3; // 70% success rate
            dataSourcesStore.updateStatus(sourceId, success ? "integrated" : "error");
        }, 3000);
    }

    function handleAccept() {
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
    <div class="wizard-step-content">
        <h1>Configure your integrations</h1>
        <div class="step-content-container">
            <div class="step-scrollable-content">
                <div class="step-content-centered">
                    {#if currentSource}
                        <!-- Specific data source configuration -->
                        <div class="source-config">
                            <div class="source-header">
                                <div class="source-icon-name">
                                    <i class="{currentSource.icon || 'fa-solid fa-database'}"></i>
                                    <h2>{currentSource.name}</h2>
                                </div>
                                <div class="source-status status-{currentSource.status}">
                                    <i class="fa-solid fa-circle"></i>
                                </div>
                            </div>
                            
                            <div class="source-content">
                                {#if currentSource.status === "queued"}
                                    <div class="source-action">
                                        <p>This data source is queued for integration. Click the button below to start the integration process.</p>
                                        <Button onClick={() => startIntegration(currentSource.id)}>Start Integration</Button>
                                    </div>
                                {:else if currentSource.status === "syncing"}
                                    <div class="source-action">
                                        <p>Integration in progress. Please wait while we sync your data.</p>
                                        <div class="progress-indicator">
                                            <i class="fa-solid fa-spinner fa-spin"></i>
                                            <span>Syncing...</span>
                                        </div>
                                    </div>
                                {:else if currentSource.status === "integrated"}
                                    <div class="source-action">
                                        <p>Integration complete! Your data is now available for use.</p>
                                        <div class="success-indicator">
                                            <i class="fa-solid fa-check-circle"></i>
                                            <span>Successfully integrated</span>
                                        </div>
                                    </div>
                                {:else if currentSource.status === "error" || currentSource.status === "failed"}
                                    <div class="source-action">
                                        <p>There was a problem with the integration. Please try again.</p>
                                        <Button onClick={() => startIntegration(currentSource.id)}>Retry Integration</Button>
                                    </div>
                                {/if}
                            </div>
                            
                            <div class="source-back">
                                <Button onClick={() => goto('/flow/integrate/configure')}>Back to All Sources</Button>
                            </div>
                        </div>
                    {:else}
                        <!-- Overview of all data sources -->
                        <div class="sources-overview">
                            <h2>Your Data Sources</h2>
                            <p>Configure and monitor the status of your data integrations.</p>
                            
                            <div class="sources-list">
                                {#each activeDataSources as source}
                                    <div 
                                        class="source-item"
                                        class:queued={source.status === "queued"}
                                        class:syncing={source.status === "syncing"}
                                        class:integrated={source.status === "integrated"}
                                        class:error={source.status === "error" || source.status === "failed"}
                                        onclick={() => navigateToSource(source.id)}
                                        role="button"
                                        tabindex="0"
                                        onkeydown={(e) => e.key === 'Enter' && navigateToSource(source.id)}
                                    >
                                        <div class="source-icon-name">
                                            <i class="{source.icon || 'fa-solid fa-database'}"></i>
                                            <span>{source.name}</span>
                                        </div>
                                        <div class="source-status status-{source.status}">
                                            <i class="fa-solid fa-circle"></i>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>
        <Button onClick={handleAccept} disabled={!allIntegrated}>Complete</Button>
    </div>
</div>

<style lang="sass">
.sources-overview
    width: 100%
    max-width: 800px
    margin: 0 auto
    
    h2
        font-size: 2rem
        margin-bottom: 1rem
        
    p
        color: var(--sk-fg-2)
        margin-bottom: 2rem

.sources-list
    display: flex
    flex-direction: column
    gap: 1rem
    margin-top: 2rem

.source-item
    display: flex
    justify-content: space-between
    align-items: center
    padding: 1.5rem
    border-radius: 8px
    background-color: var(--sk-bg-1)
    border: 1px solid var(--sk-border)
    cursor: pointer
    transition: all 0.2s ease
    
    &:hover
        transform: translateY(-2px)
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
    
    &.queued
        border-left: 4px solid orange
    
    &.syncing
        border-left: 4px solid #ccc
        animation: pulse 2s infinite
    
    &.integrated
        border-left: 4px solid #10b981
    
    &.error
        border-left: 4px solid red

.source-icon-name
    display: flex
    align-items: center
    gap: 1rem
    
    i
        font-size: 1.5rem
        width: 2rem
        text-align: center
    
    span
        font-size: 1.2rem

.source-status
    display: flex
    align-items: center
    gap: 0.5rem
    font-size: 0.9rem
    
    i
        font-size: 0.8rem

.source-config
    width: 100%
    max-width: 800px
    margin: 0 auto

.source-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 2rem
    padding-bottom: 1rem
    border-bottom: 1px solid var(--sk-border)
    
    .source-icon-name
        display: flex
        align-items: center
        gap: 1rem
        
        i
            font-size: 2rem
            width: 3rem
            text-align: center
        
        h2
            font-size: 2rem
            margin: 0

.source-content
    background-color: var(--sk-bg-1)
    border-radius: 8px
    padding: 2rem
    margin-bottom: 2rem

.source-action
    display: flex
    flex-direction: column
    align-items: center
    gap: 1.5rem
    text-align: center
    
    p
        font-size: 1.2rem
        color: var(--sk-fg-2)
        margin: 0

.progress-indicator, .success-indicator
    display: flex
    align-items: center
    gap: 0.8rem
    font-size: 1.2rem
    
    i
        font-size: 1.5rem

.progress-indicator
    color: #3b82f6

.success-indicator
    color: #10b981

.source-back
    display: flex
    justify-content: center

@keyframes pulse
    0%
        opacity: 1
    50%
        opacity: 0.7
    100%
        opacity: 1

</style>

