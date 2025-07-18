<script lang="ts">
    export let icon: string | null = null;
    export let title: string;
    export let path: string = "#";
    export let pattern: string | null = null;
  
    import { page } from '$app/stores';
  
    $: selected = pattern ? new RegExp(pattern).test($page.url.pathname) : false;
    $: isExternal = !pattern;
  </script>
  
  <a 
    href={path} 
    class="header-item appnav-item"
    class:selected={selected}
    aria-current={selected ? 'page' : undefined}
    class:text-only={!icon}
    class:external={isExternal}
    rel={isExternal ? "noopener noreferrer" : ""}
  >

    <span class="title">{title}</span>
  </a>
  
  <style lang="sass">
    .header-item
      display: flex
      align-items: center
      gap: 4px
      padding: 0.1rem 1rem 0 1rem
      text-decoration: none
      transition: all 0.2s ease-in-out
      border-bottom: 1px solid transparent
      color: inherit

      &:not(.external):hover
        color: #999
        background-color: rgba(255,255,255,0.05)
        
      &.selected
        color: var(--sk-fg-accent)
        // border-bottom: 1px solid var(--sk-fg-accent)
        
      .title
        font-size: 16px
        // font-weight: 500
  </style> 