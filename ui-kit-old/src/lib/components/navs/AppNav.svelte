<script lang="ts">
    import AppNavItem from "./AppNavItem.svelte"
    import AppNavProfile from "./AppNavProfile.svelte"
    import type { Snippet } from "svelte";
    import { authStore, userRole } from '@econic/ui-kit/stores';
    import { ThemeToggle } from '@econic/ui-kit/components';
    import { onMount } from 'svelte';
    let { 
        authenticated,
        unauthenticated 
    } : {
        authenticated: Snippet;
        unauthenticated: Snippet;
    } = $props();
  
    // Use the authStore instead of session
    const isAuthenticated =  $derived(!!$authStore.initialized);

    const hideAppNav = $derived(!userRole.hasRole('admin') && !userRole.hasRole('developer'));

</script>

  <div class="app-header">
    <nav class="right-nav">


    {#if hideAppNav}
      <ThemeToggle />
    {:else if isAuthenticated}

        
        <!-- <AppNavItem 
          title="Admin"
          path="/app/admin"
          pattern="^/app/admin"
        /> -->
        <AppNavItem 
          title="Demo"
          path="/app/dashboard"
          pattern="^/app"
        />        
        <!-- <AppNavItem 
          title="Collaborators"
          path="/app/collaborate"
          pattern="^/app/collaborate"
        />     -->
        <!-- <AppNavItem 
          title="Data"
          path="/app/integrations/dashboard"
          pattern="^/app/integrations"
        /> -->
        <!-- <AppNavItem 
          title="Market"
          path="/app/dashboard"
          pattern="^/app/dashboard"
        /> -->

        {@render authenticated?.()}
        <ThemeToggle />
        <!-- <AppNavProfile /> -->
    {:else}
      <div class="flex-spacer"></div>
      {@render unauthenticated?.()}
      <ThemeToggle />
      <!-- <a href="/login" class="appnav-item login-link">Sign in | Register</a> -->
      
    {/if}
    </nav>
    </div>

  <style lang="sass">


.right-nav
  display: flex
  flex-shrink: 0
  // margin-right: 16px
  align-items: center
  gap: 8px

.login-link
  display: flex
  font-size: 16px
  align-items: center
  gap: 8px
  // height: var(--sk-nav-height)
  padding: 0 16px
  text-decoration: none
  transition: all 0.2s ease-in-out
  color: inherit
  // margin-right: 1rem
  
  &:hover
    color: white

	
.app-header
  padding-right: 1rem
  @media (max-width: 1500px)
    display: none
  

</style>
  