<script lang="ts">
    import type { Message, MessageType } from '../types/types';

    const { 
        label,
        hint = '',
        placeholder = '',
        disabled = false,
        validate,
        message,
        options = [],
        value = '',
        showDropdown = false
    } = $props<{
        label: string;
        hint?: string;
        placeholder?: string;
        disabled?: boolean;
        validate?: (value: string) => boolean;
        message?: Message;
        options?: string[];
        value?: string;
        showDropdown?: boolean;
    }>();

    let isDropdownVisible = $state(showDropdown);
    let inputElement: HTMLInputElement;
    let filteredOptions = $state(options);
    let currentValue = $state(value);
    let isValid = $state(true);

    // Handle input changes
    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        currentValue = target.value;
        
        // Filter options based on input
        if (options.length > 0) {
            filteredOptions = options.filter((opt: string) => 
                opt.toLowerCase().includes(currentValue.toLowerCase())
            );
            isDropdownVisible = filteredOptions.length > 0 && currentValue.length > 0;
        }

        // Validate if validation function provided
        if (validate) {
            isValid = validate(currentValue);
        }
    }

    // Handle option selection
    function selectOption(option: string) {
        currentValue = option;
        isDropdownVisible = false;
        inputElement.focus();
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        if (inputElement && !inputElement.contains(event.target as Node)) {
            isDropdownVisible = false;
        }
    }
    
    // Toggle dropdown on focus
    function handleFocus() {
        if (options.length > 0) {
            isDropdownVisible = true;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="text-field">
    <div class="label-container">
        <label class="__text_sm label">{label}</label>
        {#if hint}
            <span class="hint __text_xs">({hint})</span>
        {/if}
    </div>

    <div class="input-container">
        <input
            bind:this={inputElement}
            type="text"
            {placeholder}
            {disabled}
            value={currentValue}
            oninput={handleInput}
            onfocus={handleFocus}
            class:invalid={!isValid}
        />
        
        {#if isDropdownVisible && filteredOptions.length > 0}
            <div class="dropdown">
                {#each filteredOptions as option}
                    <div 
                        class="option"
                        onclick={() => selectOption(option)}
                    >
                        {option}
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <div class="message-container">
        {#if message}
            <div class="message" class:error={message.type === 'error'}
                               class:warn={message.type === 'warn'}
                               class:info={message.type === 'info'}
                               class:success={message.type === 'success'}>
                {message.text}
            </div>
        {/if}
    </div>
</div>

<style lang="sass">
.text-field
    display: flex
    flex-direction: column
    gap: 0.5rem
    width: 100%
    height: 100px  // Fixed height to prevent layout shifts
    margin-bottom: var(--sk-space-2)

.label-container
    display: flex
    align-items: baseline
    gap: 0.5rem
    height: 30px  // Fixed height for label section

.label
    font-weight: 300
    color: var(--sk-fg-1)
    margin-bottom: 20px

    @media (max-width: 768px)
        font-size: var(--sk-text-3xl)

.hint
    // font-size: 1.2rem
    padding-left: 5px
    opacity: 0.5
    font-weight: 200
    // color: var(--sk-fg-2)
    color: #69798c

    @media (max-width: 768px)
        font-size: var(--sk-text-lg)


.input-container
    position: relative
    font-size: 2rem
    height: 80px  // Fixed height for input section

input
    width: 100%
    // max-width: 500px
    border: none
    border-bottom: 1px solid var(--sk-fg-3)
    background: transparent
    padding: 0.5rem 0
    color: var(--sk-fg-1)
    // font-size: 1rem
    transition: all 0.2s ease
    outline: none
    font-size: inherit

    &::placeholder
        color: var(--sk-fg-4)
        opacity: 0.5

    &:focus
        border-bottom: 2px solid var(--sk-fg-accent)

    &:disabled
        opacity: 0.5
        cursor: not-allowed
        border-bottom: none  // Remove bottom border when disabled

    &.invalid
        border-bottom-color: #ff4444

.dropdown
    position: absolute
    top: 100%
    left: 0
    width: 100%
    background: var(--sk-bg-2)
    border: 1px solid var(--sk-border)
    border-radius: 4px
    box-shadow: var(--sk-shadow)
    max-height: 200px
    overflow-y: auto
    z-index: 10

.option
    padding: 0.5rem 1rem
    cursor: pointer
    color: var(--sk-fg-2)
    transition: all 0.2s ease

    &:hover
        background: var(--sk-bg-4)
        color: var(--sk-fg-1)

.message-container
    height: 60px  // Fixed height for message section
    padding: 0.5rem 0

.message
    font-size: 1.2rem
    opacity: 0
    animation: fadeIn 0.2s ease forwards

    &.error
        color: #ff4444

    &.warn
        color: #ffaa00

    &.info
        color: #44aaff

    &.success
        color: #44ff88

@keyframes fadeIn
    from
        opacity: 0
        transform: translateY(-5px)
    to
        opacity: 1
        transform: translateY(0)
</style> 