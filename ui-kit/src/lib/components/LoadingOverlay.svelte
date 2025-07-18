<script lang="ts">
    export let show = false;
</script>

{#if show}
<div class="loading-overlay">
    <div class="spinner">
        <i class="fa fa-spinner fa-spin"></i>
    </div>
</div>
{/if}

<style lang="sass">
.loading-overlay
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: rgba(0, 0, 0, 0.7)
    display: flex
    justify-content: center
    align-items: center
    z-index: 9999

.spinner
    color: white
    font-size: 48px
</style> 