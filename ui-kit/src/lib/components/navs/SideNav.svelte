<script lang="ts">
  import SidebarItem from "./SidebarItem.svelte";
  import { authStore } from '@econic/ui-kit/stores';
  import { sideNavState } from "@econic/ui-kit/stores";
  import { navTree, findClosestNavUrl, type NavItem } from "@econic/ui-kit/stores";
  import { page } from '$app/stores';

  let direction = -1; 
  let timer: any = null; 
  const DOUBLE_TOGGLE_THRESHOLD = 3000;

  // Get the closest matching navigation subtree
  $: currentNavUrl = findClosestNavUrl($page.url.pathname);
  $: currentNav = $navTree[currentNavUrl || ''];
  $: shouldHideNav = currentNav?.hide || false;

  function clearDirectionTimer() {
    if (!!timer) {
      console.log('timer cleared');
      clearTimeout(timer);
    }
  }

  function setDirectionTimer() {
    clearDirectionTimer();
    timer = setTimeout(() => {
      direction = -direction;
      console.log('timer set direction', direction === -1 ? 'closing' : 'expanding');
    }, DOUBLE_TOGGLE_THRESHOLD);
  }

  function toggleNav() {
    if ($sideNavState === 'expanded') {
      $sideNavState = 'thin';
      setDirectionTimer();
    } else if ($sideNavState === 'thin') {
      clearDirectionTimer();
      if (direction === 1) {
        $sideNavState = 'expanded';
        direction = -1;
        console.log('Manually set direction to ', direction === -1 ? 'closing' : 'expanding');
      } else {
        $sideNavState = 'closed';
        direction = 1;
        console.log('Manually set direction', direction === -1 ? 'closing' : 'expanding');
      }      
    } else if ($sideNavState === 'closed') {
      $sideNavState = 'thin';
      setDirectionTimer();
    }
  }

  // Fixed navigation items that always appear at the bottom
  const fixedNavItems: NavItem[] = [
    
    { text: 'Dev Mode', path: 'app/dev', icon: 'fa fa-code' },  
    { text: 'Data Sources', path: 'app/integrations/dashboard', icon: 'fa fa-database' },    
    { text: 'Admin', path: 'app/admin', icon: 'fa fa-shield' },  
    { text: 'Settings', path: 'app/settings', icon: 'fa fa-gear' },
    { 
      text: 'Logout', 
      path: 'logout', 
      icon: 'fa fa-arrow-right-from-bracket',
      action: () => authStore.signOut()
    }
  ];
</script>

{#if !shouldHideNav}
  <div class='sidenav flex flex-col' 
       class:expanded={$sideNavState === 'expanded'}
       class:closed={$sideNavState === 'closed'}>

    <div class="menu-container flex-grow">
      {#if currentNav?.children}
        {#each currentNav.children as item}
          <SidebarItem {...item} />
        {/each}
      {/if}
    </div>

    <button 
      class="nav-toggle"
      onclick={toggleNav}
      aria-label="Toggle navigation"
    >
      <i class="fa fa-chevron-{direction === -1 ? 'left' : 'right'}"></i>
    </button>

    <div class="flex-none">
      {#each fixedNavItems as item}
        <SidebarItem {...item} />
      {/each}
    </div> 
  </div>
{/if}

<style lang="sass">
.sidenav
  width: 65px
  // height: calc(100% - 4px)
  height: calc(100% - 0.5px)
  top: 0.5px
  position: relative
  z-index: 100
  left: 0
  background-color: var(--sk-bg-0)
  transition: all 0.3s ease-in-out
  
  // :root.dark &
    // top: 4px
    // height: calc(100% - 4px)
    // background: rgba(100, 100, 100, 0.3)

  &::after
    content: ''
    position: absolute
    right: 0
    top: 0
    height: 100%
    width: 0.5px
    // background: linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent)
    background: rgba(0, 0, 0, 0.2)
    pointer-events: none
  
    :root.dark &
      background: rgba(100, 100, 100, 0.3)

      // background: linear-gradient(to right, rgba(100, 100, 100, 0.5), transparent)
  
  &.expanded
    width: 299px
    
  &.closed
    width: 0
    
    .menu-container,
    .flex-none
      opacity: 0
      visibility: hidden

.menu-container
  margin-top: 50px

.nav-toggle
  position: absolute
  right: 2px
  top: 50%
  transform: translatex(100%) translateY(-50%)
  width: 24px
  height: 48px
  background-color: var(--sk-bg-0)
  border: none
  border-radius: 0 24px 24px 0
  cursor: pointer
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.3s ease-in-out
  z-index: 2
  
  // &::after
  //   content: ''
  //   // position: absolute
  //   right: 0
  //   top: 0
  //   height: 100%
  //   width: 0.5px
  //   // background: linear-gradient(to right, rgba(0, 0, 0, 0.2), transparent)
  //   background: rgba(0, 0, 0, 0.2)
  //   pointer-events: none
  
  //   :root.dark &
  //     background: rgba(100, 100, 100, 1)

  
  &:hover
    color: var(--sk-fg-0)
    
  i
    font-size: 14px
    margin-left: 0px
    position: absolute
    left: 50%
    transform: translateX(-75%)
</style>
