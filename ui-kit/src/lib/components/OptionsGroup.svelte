<script lang="ts">
    type Option = {
        key: string;
        value: boolean;
    };

    const { 
        title,
        description,
        options,
        getIcon,
        onSelect
    } = $props<{
        title: string;
        description?: string;
        options: Option[];
        getIcon: (key: string) => string;
        onSelect: (key: string) => void;
    }>();
</script>

<div class="options-container">
    <h3 class="__text_sm options-header">{title}</h3>
    {#if description}
        <p class="__text_xs options-description">{description}</p>
    {/if}
    <div class="options-flex">
        {#each options as {key, value}}
            <div class="options-item {value && 'selected'}" onclick={() => onSelect(key)}>
                <div class="options-item-top">
                    <i class="options-icon fa {getIcon(key)}"></i>
                </div>
                <div class="options-item-bottom">
                    <div class="__text_xs option-name">{key}</div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="sass">
.options-container
    padding: 2rem 0 5rem

    @media (max-width: 768px)
        padding: 1rem 0 2rem

.options-flex
    display: flex
    flex-wrap: wrap
    padding: var(--sk-space-4) 0
    gap: 2.5rem 1.5rem
    width: 100%
    justify-content: flex-start
    @media (min-width: $breakpoint-md)
        gap: 4rem 2.5rem


.options-item
    display: grid
    grid-template-rows: 1fr 1.2fr
    gap: 0.5rem
    width: 90px
    height: 90px
    padding: 1rem
    padding-top: 1.3rem
    text-align: center
    cursor: pointer 
    transition: all 0.2s ease
    border-radius: 12px
    border: 1px solid var(--sk-border)
    overflow: hidden
    -webkit-tap-highlight-color: transparent

    @media (max-width: 768px)
        &:hover
            transform: none
            border-color: var(--sk-border)
            
            i
                color: inherit
            
            .option-name
                color: inherit
        
        &:active
            background-color: rgba(59, 130, 246, 0.05)
            border-color: #3b82f6
            
            i
                color: #3b82f6
            
            .option-name
                color: #5a98ff

    @media (min-width: 768px)
        &:hover
            transform: translateY(-2px)
            border-color: #3b82f6
            
            i
                color: #3b82f6
            
            .option-name
                color: #5a98ff

    @media (min-width: $breakpoint-sm)
        width: 120px
        height: 120px

    @media (min-width: $breakpoint-md)
        width: 150px
        height: 150px
        padding: 1.5rem
        font-size: var(--sk-text-4xl)
        transition: all 0.2s ease

    @media (min-width: $breakpoint-lg)
        width: 180px
        height: 180px
        padding: 2rem
    
    &.selected
        border-color: #3b82f6
        background-color: rgba(59, 130, 246, 0.05)
        
        i
            color: #3b82f6
        
        .option-name
            color: #5a98ff

.options-item-top
    display: flex
    align-items: flex-end
    justify-content: center
    padding-bottom: 0.5rem

.options-item-bottom
    display: flex
    align-items: flex-start
    justify-content: center
    padding-top: 0.5rem

.options-header
    font-weight: 300
    color: var(--sk-fg-1)
    margin-bottom: var(--sk-space-10)

    //media max width 768px
    @media (max-width: 768px)
        font-size: var(--sk-text-3xl)
    


.options-description
    margin-top: -2rem
    font-weight: 200
    color: #4d596c

    @media (max-width: 768px)
        font-size: var(--sk-text-lg)

.options-icon
    transition: all 0.2s ease
    font-size: var(--sk-text-3xl)
    @media (min-width: 700px)
        font-size: var(--sk-text-4xl)
    @media (min-width: 1000px)
        font-size: var(--sk-text-5xl)

.option-name
    transition: all 0.2s ease
    margin: 0


</style> 