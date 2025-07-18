<script lang="ts">
    import { dataSourcesStore, type DataSource, type DataSourceStatus } from '@econic/ui-kit/stores';
    import { goto } from '$app/navigation';
	import { getStateIcon } from '../stores/wizards';

    // Props
    const { 
        title = 'Suggested',
        showViewAll = false,
        maxColumns = 4
    } = $props<{
        title?: string;
        showViewAll?: boolean;
        maxColumns?: number;
    }>();

    // Subscribe to the store
    const sources = dataSourcesStore.getAll();
    
    // Handle selection of a data source
    function toggleSelection(id: string) {
        const source = $sources.find(s => s.id === id);
        
        // Only allow toggling for available or queued sources
        if (!source || (source.status !== "available" && source.status !== "queued" && source.status !== "disabled")) {
            return;
        }

        // Toggle the status in the store
        if (source.status === "queued") {
            dataSourcesStore.updateStatus(id, "available");
        } else {
            dataSourcesStore.updateStatus(id, "queued");
        }
    }

    // Check if source is selectable
    function isSelectable(source: DataSource): boolean {
        return source.status === "available" || source.status === "queued";
    }

    // Handle view all button click
    function handleViewAll() {
        goto('/app/integrations');
    }
</script>

<div class="data-sources-container">
    <div class="data-sources-header">
        <h2>{title}</h2>
        {#if showViewAll}
            <button class="view-all-button" onclick={handleViewAll}>
                View All Integrations <i class="fa fa-arrow-right"></i>
            </button>
        {/if}
    </div>

    <div class="data-sources-grid" style="--max-columns: {maxColumns}">
        {#each $sources as source (source.id)}
            <div 
                class="data-source-item" 
                class:disabled={source.status === "disabled"}
                class:integrated={source.status === "integrated"}
                class:selectable={isSelectable(source)}
                class:selected={source.status === "queued"}
                onclick={() => isSelectable(source) && toggleSelection(source.id)}
                role={isSelectable(source) ? "button" : "listitem"}
                tabindex={isSelectable(source) ? 0 : -1}
                onkeydown={(e) => e.key === 'Enter' && isSelectable(source) && toggleSelection(source.id)}
            >
                <div class="data-source-icon-name">
                    {#if source.icon}
                        <i class="{source.icon}"></i>
                    {:else if source.iconFile}
                        <img src={source.iconFile} alt={source.name} />
                    {:else}
                        <i class="fa fa-database"></i>
                    {/if}
                    <span>{source.name}</span>
                </div>
                <div class="status-indicator">
                    {#if source.status}
                        <i 
                            class="{getStateIcon(source.status)} status-{source.status}"
                        ></i>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="sass">
.data-sources-container
    width: 100%
    background-color: var(--sk-bg-1)
    border-radius: 16px
    padding: 10rem
    color: var(--sk-fg-1)
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)

.data-sources-header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 2rem
    border-bottom: 1px solid var(--sk-border)
    padding-bottom: 1rem
    
    h2
        font-size: 2rem
        font-weight: 500
        margin: 0

.view-all-button
    background: none
    border: none
    color: #3b82f6
    font-size: 1.6rem
    cursor: pointer
    display: flex
    align-items: center
    gap: 0.8rem
    
    &:hover
        text-decoration: underline

.data-sources-grid
    display: grid
    grid-template-columns: repeat(var(--max-columns), 1fr)
    gap: 1.5rem
    
    @media (max-width: 1200px)
        grid-template-columns: repeat(3, 1fr)
    
    @media (max-width: 768px)
        grid-template-columns: repeat(2, 1fr)
    
    @media (max-width: 480px)
        grid-template-columns: 1fr

.data-source-item
    display: flex
    justify-content: space-between
    align-items: center
    padding: 1.5rem 2rem
    border-radius: 12px
    transition: all 0.2s ease
    border: 1px solid var(--sk-border)
    
    &.selectable
        cursor: pointer
        
        &:hover
            border-color: #3b82f6
            transform: translateY(-2px)
    
    &.selected
        border-color: #3b82f6
        background-color: rgba(59, 130, 246, 0.05)
    
    &.disabled
        opacity: 0.5
        cursor: not-allowed
        
        &:hover
            transform: none
            border-color: var(--sk-border)
    
    &.integrated
        background-color: rgba(59, 130, 246, 0.1)

.data-source-icon-name
    display: flex
    align-items: center
    gap: 1.5rem
    
    i
        font-size: 2rem
        width: 2.5rem
        text-align: center
        color: var(--sk-fg-2)
    
    img
        width: 2.5rem
        height: 2.5rem
        object-fit: contain
    
    span
        font-size: 1.8rem

.status-indicator
    width: 2.5rem
    height: 2.5rem
    display: flex
    align-items: center
    justify-content: center
    
    i
        font-size: 1.8rem
        

</style> 