<script lang="ts">
    import { Button } from '@econic/ui-kit/components';
    import { wizardStore } from '@econic/ui-kit/stores';
    import { onMount } from 'svelte';

    const { next, exit } = $props<{
        next?: () => void,
        exit?: () => void
    }>();

    // Get the wizard and current step
    const wizard = wizardStore.getWizard('onboarding');

    onMount(() => {
        // Welcome step is considered complete once viewed
        wizardStore.setStepState('onboarding', 1, 'completed');
    });

    function handleNext() {
        next?.();
    }

    function handleExit() {
        exit?.();
    }
</script>

<div class="wizard-step">
    <div class="wizard-step-content">
        <h1>Welcome to Econic.</h1>
        <div class="step-content-container">
            <div class="step-scrollable-content">
                <div class="step-content-centered">
                    <div class="welcome-content">
                        <div class="video-container">
                            <div class="video-placeholder">
                                <i class="fa fa-play-circle"></i>
                            </div>
                        </div>
                        <div class="welcome-text">
                            <h2>Advanced AI for your digital economy</h2>
                            <p>Unlock powerful insights, seamless collaboration, and intelligent automation across your entire digital ecosystem.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <div class="spacer"></div>
        <Button onClick={handleNext}>Continue</Button>
    </div>
</div>

<style lang="sass">
.welcome-content
    display: flex
    flex-direction: column
    align-items: center
    gap: 2rem
    width: 100%
    padding: 2rem

.video-container
    width: 100%
    max-width: 1200px
    aspect-ratio: 16/9
    display: flex
    align-items: center
    justify-content: center

.video-placeholder
    width: 100%
    height: 100%
    background-color: #1a1a1a
    border-radius: 12px
    display: flex
    align-items: center
    justify-content: center
    transition: all 0.3s ease
    cursor: pointer

    &:hover
        background-color: #2a2a2a
        transform: scale(1.01)

    i
        font-size: 4rem
        color: var(--sk-fg-3)

.welcome-text
    text-align: center
    max-width: 600px

    h2
        font-size: 1.8rem
        font-weight: 400
        margin-bottom: 1rem
        color: var(--sk-fg-1)

    p
        font-size: 1.1rem
        line-height: 1.6
        color: var(--sk-fg-2)
</style>

