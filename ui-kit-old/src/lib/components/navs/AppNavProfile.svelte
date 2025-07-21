<script lang="ts">
  import { clickOutside } from "@econic/ui-kit/actions";
  import { authStore } from "@econic/ui-kit/stores";
  
  let isOpen = false;
  let buttonImageLoaded = false;
  let menuImageLoaded = false;
  
  const organizations = [
    { id: 1, name: "Acme Corp", avatar: "A" },
    { id: 2, name: "TechStart Inc", avatar: "T" },
    { id: 3, name: "Global Systems", avatar: "G" },
    { id: 4, name: "Data Analytics Ltd", avatar: "D" }
  ];

  // Get user data from Firebase auth
  $: user = $authStore.user;

  // Create a proxied image URL if photoURL exists
  $: imageUrl = user?.photoURL 
    ? `/api/proxy/image?url=${encodeURIComponent(user.photoURL)}`
    : null;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function handleClickOutside() {
    isOpen = false;
  }

  function handleButtonImageLoad() {
    buttonImageLoaded = true;
  }

  function handleButtonImageError() {
    buttonImageLoaded = false;
  }

  function handleMenuImageLoad() {
    menuImageLoaded = true;
  }

  function handleMenuImageError() {
    menuImageLoaded = false;
  }
</script>

<div class="profile-container" use:clickOutside={{ handleClick: handleClickOutside }}>
  <button class="profile-button" onclick={toggleMenu}>
    <div class="image-container">
      {#if imageUrl}
        <img 
          src={imageUrl} 
          alt={user?.displayName || 'Profile'} 
          class="avatar-image"
          onload={handleButtonImageLoad}
          onerror={handleButtonImageError}
        />
      {/if}
      {#if !buttonImageLoaded || !imageUrl}
        <i class="fa fa-user-circle"></i>
      {/if}
    </div>
  </button>
  
  {#if isOpen}
    <div class="dropdown-menu">
      <div class="menu-section">
        <a href="/user/profile" class="menu-item">
          {#if imageUrl}
            <img 
              src={imageUrl} 
              alt={user?.displayName || 'Profile'} 
              class="menu-avatar"
              onload={handleMenuImageLoad}
              onerror={handleMenuImageError}
            />
            {#if !menuImageLoaded}
              <i class="fa fa-user"></i>
            {/if}
          {:else}
            <i class="fa fa-user"></i>
          {/if}
          <span>{user?.displayName || 'User'}</span>
        </a>
        <div class="user-email">{user?.email}</div>
        <a href="/user/settings" class="menu-item">
          <i class="fa fa-gear"></i>
          <span>My settings</span>
        </a>
      </div>

      <div class="menu-section">
        <div class="section-header">My Organisations</div>
        {#each organizations as org}
          <a href="#" class="menu-item">
            <div class="org-avatar">{org.avatar}</div>
            <span>{org.name}</span>
          </a>
        {/each}
      </div>

      <div class="menu-section">
        <button class="menu-item logout" onclick={() => authStore.signOut()}>
          <i class="fa fa-arrow-right-from-bracket"></i>
          <span>Log out</span>
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="sass">
.profile-container
  position: relative

.profile-button
  position: relative
  width: 50px
  height: var(--sk-nav-height)
  display: flex
  align-items: center
  justify-content: center
  color: #666
  cursor: pointer
  transition: color 0.2s ease-in-out
  background: none
  border: none
  margin-right: 1rem
  
  &:hover
    color: #999
  
  i
    position: absolute
    font-size: 20px
    z-index: 1

.dropdown-menu
  z-index: 1001
  position: absolute
  top: var(--sk-nav-height)
  right: 0
  width: 200px
  background-color: var(--sk-bg-3)
  border: 1px solid rgba(255,255,255,0.1)
  border-top: none
  box-shadow: 0 4px 12px rgba(0,0,0,0.2)

.menu-section
  border-bottom: 1px solid rgba(255,255,255,0.1)
  padding: 4px 0
  
  &:last-child
    border-bottom: none

.section-header
  padding: 4px 12px
  color: #666
  font-size: 11px
  text-transform: uppercase
  letter-spacing: 0.5px

.menu-item
  display: flex
  align-items: center
  padding: 6px 12px
  color: #CCC
  text-decoration: none
  transition: all 0.2s ease-in-out
  gap: 8px
  font-size: 13px
  
  &:hover
    background-color: rgba(255,255,255,0.05)
    color: white
  
  i
    font-size: 14px
    width: 16px
    
  &.logout
    width: 100%
    text-align: left
    background: none
    border: none
    cursor: pointer
    color: #FF6B6B
    
    &:hover
      background-color: rgba(255,107,107,0.1)

.org-avatar
  width: 16px
  height: 16px
  background-color: #444
  display: flex
  align-items: center
  justify-content: center
  font-size: 11px
  color: white

.avatar-image
  position: relative
  width: 32px
  height: 32px
  border-radius: 50%
  object-fit: cover
  z-index: 2

.menu-avatar
  width: 24px
  height: 24px
  border-radius: 50%
  object-fit: cover

.user-email
  padding: 0 12px 8px
  color: #666
  font-size: 12px

.image-container
  width: 32px
  height: 32px
  position: relative
  display: flex
  align-items: center
  justify-content: center

  i
    font-size: 32px
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

.avatar-image
  width: 32px
  height: 32px
  border-radius: 50%
  display: block
</style> 