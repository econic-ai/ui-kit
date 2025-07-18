<script lang="ts">
    // Props for the component
    const { selectedPlan } = $props<{
        selectedPlan?: string;
    }>();
</script>

<div class="payment-container">
    <div class="payment-placeholder">
        <h2>Payment Details</h2>
        <p>Stripe payment element will be integrated here</p>
        {#if selectedPlan}
            <p class="selected-plan">Selected plan: {selectedPlan}</p>
        {/if}
    </div>
</div>

<style lang="sass">
    .payment-container
        width: 100%
        padding: 0 2rem

    .payment-placeholder
        min-height: 400px
        background-color: var(--sk-bg-2)
        border: 1px solid var(--sk-border)
        border-radius: 8px
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        text-align: center
        padding: 2rem

        h2
            color: var(--sk-fg-1)
            font-size: 1.6rem
            margin-bottom: 1rem

        p
            color: var(--sk-fg-2)
            font-size: 1.2rem

    .selected-plan
        margin-top: 1rem
        font-style: italic
</style> 