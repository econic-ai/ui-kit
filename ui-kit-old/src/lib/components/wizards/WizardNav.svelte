<script lang="ts">
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { WizardStep } from '@econic/ui-kit/stores';


    const { steps, currentStep } = $props<{
        steps: WizardStep[];
        currentStep: number;
    }>();

    // Helper function to determine if a step should be clickable
    function isStepClickable(step: WizardStep): boolean {
        // For main steps
        if (Math.floor(step.number) === step.number) {
            return step.state === 'completed' || // Completed steps are always clickable
                   Math.floor(currentStep) === step.number || // Current main step is clickable
                   step.number < Math.floor(currentStep);     // Previous steps are clickable
        } 
        // For substeps
        else {
            const mainStepNumber = Math.floor(step.number);
            return step.state === 'completed' || // Completed substeps are always clickable
                   currentStep === step.number || // Current substep is clickable
                   (mainStepNumber === Math.floor(currentStep) && step.number < currentStep); // Previous substeps of current main step
        }
    }

    // Helper function to determine if substeps should be shown
    function shouldShowSubsteps(step: WizardStep): boolean {
        return !!step.substeps && step.substeps.length > 0;
    }

    // Helper function to determine if a substep is the current step
    function isCurrentSubstep(mainStep: number, substep: WizardStep): boolean {
        // A substep is active if its URL is contained in the current path
        const currentPath = $page.url.pathname;
        
        // Check if the substep's URL is part of the current path
        if (!!substep.url && currentPath.includes(substep.url)) {
            return true;
        }
        
        // Also check if the substep's number matches the current step number
        // This is important for decimal-numbered substeps
        return Math.floor(currentStep) === mainStep && 
               substep.number === currentStep;
    }

    // Sort substeps by their number to ensure proper ordering
    function sortSubsteps(substeps: WizardStep[]): WizardStep[] {
        return [...substeps].sort((a, b) => a.number - b.number);
    }

    function handleStepClick(step: WizardStep) {
        if (isStepClickable(step)) {
            goto(step.url);
        }
    }
</script>

<div class="wizard-nav">
    <div class="wizard-nav-content">
        {#each steps as step}
            <!-- Main step -->
            {#if isStepClickable(step)}
                <button 
                    class="step-indicator" 
                    class:active={Math.floor(currentStep) === step.number}
                    class:successful={step.state === 'completed'}
                    class:error={step.state === 'error'}
                    class:in_progress={step.state === 'in_progress'}
                    class:clickable={true}
                    onclick={() => handleStepClick(step)}
                >
                    <i class={step.icon}></i>
                    <span>{step.text}</span>
                    {#if step.stateIcon}
                        <i class="icons-state {step.stateIcon} status-{step.state || ''}"></i>
                    {/if}
                </button>
            {:else}
                <div 
                    class="step-indicator" 
                    class:active={Math.floor(currentStep) === step.number}
                    class:successful={step.state === 'completed'}
                    class:error={step.state === 'error'}
                    class:in_progress={step.state === 'in_progress'}
                >
                    <i class={step.icon}></i>
                    <span>{step.text}</span>
                    {#if step.stateIcon}
                        <i class="icons-state {step.stateIcon} status-{step.state || ''}"></i>
                    {/if}
                </div>
            {/if}

            <!-- Substeps (if any) -->
            {#if shouldShowSubsteps(step) && step.substeps}
                <div class="substeps-container">
                    {#each sortSubsteps(step.substeps) as substep}
                        {#if isStepClickable(substep)}
                            <button 
                                class="step-indicator substep" 
                                class:active={isCurrentSubstep(step.number, substep)}
                                class:successful={substep.state === 'completed'}
                                class:error={substep.state === 'error'}
                                class:in_progress={substep.state === 'in_progress'}
                                class:clickable={true}
                                onclick={() => handleStepClick(substep)}
                            >
                                <i class={substep.icon}></i>
                                <span>{substep.text}</span>
                                {#if substep.stateIcon}
                                    <i class="icons-state {substep.stateIcon} status-{substep.state || ''}"></i>
                                {/if}
                            </button>
                        {:else}
                            <div 
                                class="step-indicator substep" 
                                class:active={isCurrentSubstep(step.number, substep)}
                                class:successful={substep.state === 'completed'}
                                class:error={substep.state === 'error'}
                                class:in_progress={substep.state === 'in_progress'}
                            >
                                <i class={substep.icon}></i>
                                <span>{substep.text}</span>
                                {#if substep.stateIcon}
                                    <i class="icons-state {substep.stateIcon} status-{substep.state || ''}"></i>
                                {/if}
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>

.substeps-container {
    margin-left: 2rem;
    border-left: 1px dashed var(--sk-border);
    padding-left: 1rem;
    margin-top: 1rem;
}

.substep {
    font-size: 1.5rem;
    line-height: 5.5rem;
    padding: 0 3rem;
    margin: 0;

    .icons-state {
        font-size: 1.3rem;
        right: 1rem;
    }
}

.substep i:first-child {
    font-size: 1.2rem;
    width: 30px; /* Give a consistent width to the icon */
    text-align: center;
}

/* Make buttons look like divs */
button.step-indicator {
    width: 100%;
}
</style> 