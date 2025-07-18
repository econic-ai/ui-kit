<script lang="ts">
    const { variant, onClick, disabled, children } = $props<{
        variant?: 'primary' | 'secondary',
        onClick?: () => void,
        disabled?: boolean,
        children?: Snippet
    }>();
</script>

<button 
    class="button" 
    class:primary={variant === 'primary' || !variant} 
    class:secondary={variant === 'secondary'}
    onclick={onClick}
    disabled={disabled}
>
    {@render children()}
</button>

<style lang="sass">
.button
    padding: 8px 16px
    border-radius: 20px
    font-size: 14px
    cursor: pointer
    transition: all 0.2s ease-in-out
    border: 1px solid var(--sk-fg-2)

    &:disabled
        opacity: 0.5
        cursor: not-allowed
        border-color: var(--sk-fg-4)
        color: var(--sk-fg-4)

    &.primary
        background-color: var(--sk-bg-1)
        color: var(--sk-fg-2)

        &:hover:not(:disabled)
            background-color: var(--sk-bg-4)
            color: var(--sk-fg-1)

    &.secondary
        background-color: transparent
        color: var(--sk-fg-2)
        border-color: var(--sk-border)

        &:hover:not(:disabled)
            background-color: var(--sk-bg-4)
</style> 