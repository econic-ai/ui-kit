<script lang="ts">
    import { goto } from '$app/navigation';
    import type { WizardStep } from '@econic/ui-kit/stores';
    import WizardNav from './WizardNav.svelte';
    import './styles.sass';
	import { max } from 'd3';

    let { 
        children,
        margin = 7,
        canExit = true,
        originRoute = '/',
        exitCallback,
        steps,
        currentStep,
        wizardClass = '',
        maxWidth = ''
    } = $props<{
        children: any,
        margin?: number,
        canExit?: boolean,
        originRoute?: string,
        exitCallback?: () => void,
        steps?: WizardStep[],
        currentStep?: number,
        wizardClass?: string,
        maxWidth?: string
    }>();

    function handleExit() {
        if (exitCallback) {
            console.log('Exiting wizard with callback');
            exitCallback();
            return;
        }        
        if (canExit) {
            console.log('Exiting wizard with route', originRoute);
            goto(originRoute, { replaceState: true });
        }
    }
</script>

<svelte:window 
    onkeydown={(e) => {
        if (e.key === 'Escape' && canExit) {
            handleExit();
        }
    }}
/>

<div class="wizard-overlay">
    {#if canExit}
        <div 
            class="overlay-background overlay-background-exit" 
            role="button" 
            tabindex="0" 
            onclick={handleExit}
            onkeydown={(e) => e.key === 'Escape' && handleExit()}
        ></div>
    {:else}
        <div 
            class="overlay-background overlay-background-no-exit" 
            role="button" 
            tabindex="0"
        ></div>
    {/if} 
    <div class="wizard-container" 
    style="--margin: {margin}%; max-width: {maxWidth}px;" >
        {#if canExit}
            <button class="close-button" tabindex="0" onclick={handleExit} aria-label="Close wizard">
                <i class="fa fa-times"></i>
            </button>
        {/if}

        <div class="wizard-layout {wizardClass}">
            {#if steps && currentStep !== undefined}
                <WizardNav {steps} {currentStep} />
            {/if}
            <div class="wizard-content {wizardClass}-content">
                {@render children()}
            </div>
        </div>
    </div>
</div>


<style>

/* .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: var(--sk-fg-3);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease-in-out;
        z-index: 2;
    }

.close-button:hover {
    color: var(--sk-fg-1);
}  */

</style>