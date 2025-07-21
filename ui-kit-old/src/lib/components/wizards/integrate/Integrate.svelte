<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { wizardStore, dataSourcesStore, type WizardTree, type WizardStep, type DataSource } from '@econic/ui-kit/stores';
    import Select from './Select.svelte';
    import Configure from './Configure.svelte';
    import WizardShell from '../WizardShell.svelte';
	import { getStateIcon } from '@econic/ui-kit/stores';

    // Extend WizardStep interface to include dataSourceId
    interface ExtendedWizardStep extends WizardStep {
        dataSourceId?: string;
    }

    let totalSteps: number = 2; // Only 2 steps: Select and Configure
    let currentStep = $state(1);
    let previousStep = $state(1); // Track previous step to prevent circular updates

    let { exitCallback } = $props<{ exitCallback: () => void }>();

    // Create a direct subscription to the wizard store
    let wizardTree = $state<WizardTree>(wizardStore.getAll());
    
    // Get steps directly from the wizard store
    let steps = $state<WizardStep[]>([]);

    // Subscribe to the data sources store
    let dataSources = $state<DataSource[]>([]);
    
    // Subscribe to store changes
    $effect(() => {
        const unsubscribe = wizardStore.subscribe(updatedWizards => {
            wizardTree = updatedWizards;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });

    // Subscribe to data sources store
    $effect(() => {
        const unsubscribe = dataSourcesStore.subscribe(updatedSources => {
            dataSources = updatedSources;
        });
        
        return unsubscribe; // Cleanup on component destruction
    });

    // Update steps whenever wizardTree changes
    $effect(() => {
        const wizard = wizardTree['integrate'];
        steps = wizard ? wizard.steps : [];
    });

    // Sync data sources with substeps in the configure step
    function syncDataSourcesWithSubsteps() {
        // Get the current wizard tree
        const currentWizard = wizardTree['integrate'];
        if (!currentWizard) return;

        // Find the configure step (step 2)
        const configureStep = currentWizard.steps.find((step: WizardStep) => step.number === 2);
        if (!configureStep) return;

        // Get active data sources (those with status queued, syncing, integrated, error, or failed)
        const activeDataSources = dataSources.filter(ds => 
            ['queued', 'syncing', 'integrated', 'error', 'failed'].includes(ds.status)
        );

        // Create a map of existing substeps by their data source ID to maintain their numbers
        const existingSubstepMap = new Map<string, number>();
        if (configureStep.substeps) {
            configureStep.substeps.forEach((substep: ExtendedWizardStep) => {
                if (substep.dataSourceId) {
                    existingSubstepMap.set(substep.dataSourceId, substep.number);
                }
            });
        }

        // Create a set of used substep numbers to avoid duplicates
        const usedSubstepNumbers = new Set<number>();
        if (configureStep.substeps) {
            configureStep.substeps.forEach((substep: WizardStep) => {
                usedSubstepNumbers.add(substep.number);
            });
        }

        // Generate new substeps based on active data sources
        const newSubsteps = activeDataSources.map((dataSource: DataSource) => {
            // If this data source already has a substep, maintain its number
            let substepNumber;
            if (existingSubstepMap.has(dataSource.id)) {
                substepNumber = existingSubstepMap.get(dataSource.id);
            } else {
                // Generate a new decimal number for this substep
                // Format: 2.XX where XX starts from 01 and increments
                let counter = 1;
                do {
                    // Format with leading zero for single digits
                    const suffix = counter < 10 ? `0${counter}` : `${counter}`;
                    substepNumber = parseFloat(`2.${suffix}`);
                    counter++;
                } while (usedSubstepNumbers.has(substepNumber));
            }

            // Create the substep
            return {
                number: substepNumber,
                text: dataSource.name,
                icon: dataSource.icon || 'fa-solid fa-database',
                url: `/integrate/configure/${dataSource.id}`,
                state: dataSource.status,
                stateIcon: getStateIcon(dataSource.status),
                dataSourceId: dataSource.id,
                id: `substep-${dataSource.id}`,
                component: ''
            } as ExtendedWizardStep;
        });

        // Only update the wizard if the substeps have changed
        if (!configureStep.substeps || 
            JSON.stringify(configureStep.substeps) !== JSON.stringify(newSubsteps)) {
            
            // Update the configure step with the new substeps
            const updatedSteps = currentWizard.steps.map((step: WizardStep) => {
                if (step.number === 2) {
                    return {
                        ...step,
                        substeps: newSubsteps
                    };
                }
                return step;
            });

            // Update the wizard tree
            wizardStore.update(wizards => {
                return {
                    ...wizards,
                    ['integrate']: {
                        ...currentWizard,
                        steps: updatedSteps
                    }
                };
            });
        }
    }

    
    // Update substeps when data sources change
    $effect(() => {
        syncDataSourcesWithSubsteps();
    });

    // Handle URL changes in a separate effect
    $effect(() => {
        // Handle URL changes
        const stepParam = $page.params.step;
        if (stepParam) {
            let stepNumber;
            
            if (stepParam === 'select') {
                stepNumber = 1;
            } else if (stepParam === 'configure') {
                stepNumber = 2;
            }
            
            if (stepNumber && stepNumber >= 1 && stepNumber <= totalSteps && stepNumber !== previousStep) {
                currentStep = stepNumber;
                previousStep = currentStep; // Update previous step
                
                // Only update the store if the current step is different from what's in the store
                const wizard = wizardTree['integrate'];
                if (wizard && wizard.currentStep !== currentStep) {
                    wizardStore.setCurrentStep('integrate', currentStep);
                }
            }
        } else {
            // If no step in URL, redirect to select
            goto('/flow/integrate/select', { replaceState: true });
        }
    });

    function goToNextStep() {
        if (currentStep < totalSteps) {
            const nextStep = currentStep + 1;
            let nextUrl;
            
            if (nextStep === 1) {
                nextUrl = '/flow/integrate/select';
            } else if (nextStep === 2) {
                nextUrl = '/flow/integrate/configure';
            }
            
            if (nextUrl) {
                goto(nextUrl);
            }
        }
    }

    function goToPreviousStep() {
        console.debug('goToPreviousStep', currentStep);
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            let prevUrl;
            
            if (prevStep === 1) {
                prevUrl = '/flow/integrate/select';
            } else if (prevStep === 2) {
                prevUrl = '/flow/integrate/configure';
            }
            
            if (prevUrl) {
                goto(prevUrl);
            }
        }
    }
</script>

<WizardShell 
    canExit={true} 
    {exitCallback}
    {steps}
    {currentStep}
    wizardClass="integrate"
>
    {#if currentStep === 1}
        <Select next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />
    {:else if currentStep === 2}
        <Configure next={goToNextStep} back={goToPreviousStep} exit={exitCallback} />
    {/if}
</WizardShell>