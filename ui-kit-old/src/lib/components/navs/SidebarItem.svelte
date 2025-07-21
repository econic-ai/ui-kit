<script lang="ts">
  import { page } from '$app/stores';
  import { sideNavState } from '@econic/ui-kit/stores';

  const DEFAULT_NAV_ICON = 'fa fa-circle';

  const { icon, text, path, hint, action } = $props<{
    icon?: string;
    text?: string;
    path?: string;
    hint?: string;
    action?: () => void;
  }>();

  let selected = $derived($page.url.pathname.includes(path) ? "selected" : "");
  let expanded = $derived($sideNavState === 'expanded');

  function handleClick(event: MouseEvent) {
    if (action) {
      event.preventDefault();
      console.debug('sideNavItem selected', action);
      action();
      console.debug('sideNavItem selection complete', action);
    }
  }
</script>

<a href="/{path}" 
  onclick={handleClick}
  class='sidebar-item {selected}'
  class:expanded={expanded}
  title={hint}>
  <div class="icon-container">
    <i class={icon || DEFAULT_NAV_ICON}></i>
  </div>
  {#if text}
    <span class="title" class:visible={expanded}>
      {text}
    </span>
  {/if}
</a>

<style lang="sass">
.sidebar-item
  position: relative
  width: 45px
  height: 40px
  margin: 0px 10px 1px 10px
  display: flex
  align-items: center
  cursor: pointer
  border-radius: 5px
  // background-color: var(--sk-bg-0)
  transition: all 0.3s ease-in-out
  text-decoration: none
  
  &.expanded
    width: 180px
    justify-content: flex-start
    
  &.selected
    background-color: var(--sk-bg-4)

  &:hover
    background-color: var(--sk-bg-4)

.icon-container
  width: 45px
  height: 40px
  display: flex
  align-items: center
  justify-content: center
  flex-shrink: 0
  
  i
    font-size: 18px
    // color: #CCC
    color: var(--sk-fg-4)
    transition: all 0.3s ease-in-out

.title
  color: var(--sk-fg-4)
  font-size: 14px
  text-transform: capitalize
  white-space: nowrap
  opacity: 0
  transform: translateX(-10px)
  transition: all 0.3s ease-in-out
  
  &.visible
    opacity: 1
    transform: translateX(0)
</style>
