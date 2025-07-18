<script lang="ts">
    import type { Wizard } from '@econic/ui-kit/stores';

    const { option, selected = false, onSelect } = $props<{
        option: Wizard;
        selected?: boolean;
        onSelect: (id: string) => void;
    }>();

    // Determine if the option is enabled (true by default if not specified)
    const isEnabled = option.enabled !== false;

    function handleClick() {
        if (isEnabled) {
            onSelect(option.id);
        }
    }
</script>

<div 
    class="config-box" 
    class:selected={selected}
    class:disabled={!isEnabled}
    onclick={handleClick}
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
    role="button"
    tabindex={isEnabled ? 0 : -1}
>
    <div class="content">
        <div class="header">
            <div class="title-section">
                <div class="icon">
                    <i class={option.icon}></i>
                </div>
                <h3>{option.title}</h3>
            </div>
            <div class="checkbox">
                {#if selected}
                    <i class="fa-solid fa-check"></i>
                {:else if !isEnabled}
                    <i class="fa-regular fa-clock"></i>
                {/if}
            </div>
        </div>
        <p>{option.description}</p>
        {#if !isEnabled}
            <div class="coming-soon">Coming Soon</div>
        {/if}
    </div>
</div>

<style lang="sass">
.config-box
    background-color: var(--sk-bg-3)
    border: 1px solid var(--sk-border)
    border-radius: 8px
    padding: 2rem
    cursor: pointer
    transition: all 0.2s ease-in-out
    height: 100%
    
    &:hover:not(.disabled)
        transform: translateY(-2px)
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
    
    &.selected
        border-color: var(--sk-theme-1)
        background-color: var(--sk-theme-1-alpha-10)
    
    &.disabled
        opacity: 0.7
        cursor: not-allowed
        border-style: dashed

.content
    display: flex
    flex-direction: column
    gap: 1.5rem

.header
    display: flex
    justify-content: space-between
    align-items: flex-start
    gap: 1.5rem

.title-section
    display: flex
    align-items: center
    gap: 1.5rem
    flex: 1

.icon
    font-size: 2rem
    color: var(--sk-theme-1)
    width: 48px
    height: 48px
    display: flex
    align-items: center
    justify-content: center
    background-color: var(--sk-theme-1-alpha-10)
    border-radius: 12px

    .selected &
        background-color: var(--sk-theme-1)
        color: white
    
    .disabled &
        color: var(--sk-fg-3)
        background-color: var(--sk-bg-4)

h3
    color: var(--sk-fg-1)
    font-size: 1.6rem
    font-weight: 500
    margin: 0
    line-height: 1.2

    .disabled &
        color: var(--sk-fg-3)

.checkbox
    width: 28px
    height: 28px
    border: 2px solid var(--sk-border)
    border-radius: 6px
    display: flex
    align-items: center
    justify-content: center
    color: var(--sk-theme-1)
    
    .selected &
        background-color: var(--sk-theme-1)
        border-color: var(--sk-theme-1)
        color: white
    
    .disabled &
        color: var(--sk-fg-3)
        border-color: var(--sk-fg-3)

p
    color: var(--sk-fg-2)
    font-size: 1.2rem
    line-height: 1.5
    margin: 0
    padding-left: calc(48px + 1.5rem) // Icon width + gap

    .disabled &
        color: var(--sk-fg-3)

.coming-soon
    color: var(--sk-fg-3)
    font-size: 1rem
    font-style: italic
    padding-left: calc(48px + 1.5rem)
    margin-top: -0.5rem
</style> 