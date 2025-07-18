<script lang="ts">
  // Get the current year for copyright
  const currentYear = new Date().getFullYear();
</script>

<div class="footer-container top-border">
    <div class="sk-container">
        <footer class="footer">
            <div class="footer-grid">
                <div class="footer-logo-column">
                <a href="/" class="logo-link">
                  <img src="/images/econic-android-chrome-192.png" alt="Econic Logo" width="150" />
                    <!-- <img src="../branding/econic_logo.svg" alt="Econic Logo" width="150" /> -->
                </a>
                
                <div class="social-icons">
                    <a href="https://github.com/econic-ai" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    <!-- <a href="https://discord.gg/econic-ai" aria-label="Discord"><i class="fab fa-discord"></i></a> -->
                    <!-- <a href="https://messenger.com/econic-ai" aria-label="Messenger"><i class="fab fa-facebook-messenger"></i></a> -->
                    <a href="https://youtube.com/econic-ai" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                </div>
                
                <div class="copyright">
                    © {currentYear} Econic. All rights reserved.
                </div>
                </div>


                <div class="footer-section">
                <h3>Product</h3>
                <ul>
                    <li><a href="/the-platform">Econic SaaS</a></li>
                    <li><a href="/enterprise">Econic Enterprise</a></li>
                    <li><a href="/orgs">Econic API</a></li>
                </ul>
                </div>

                <div class="footer-section">
                    <h3>Research</h3>
                    <ul>
                        <li><a href="/docs/research">Knowledge Graphs</a></li>
                        <li><a href="/docs/research">Collaborative AI</a></li>
                        <!-- <li><a href="/research">...More</a></li> -->
                    </ul>
                    </div>                

                <div class="footer-section">
                <h3>Legal & Safety</h3>
                <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Use</a></li>
                    <li><a href="#">Data Compliance</a></li>
                </ul>
                </div>

                <div class="footer-section">
                <h3>The Company</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Join Us</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
                </div>
            </div>
        </footer>
    </div>
</div>
<style>
  /* Top border using pseudo-element for theme compatibility */

  .footer-container {
    width: 100%;
    position: relative;
    padding: var(--sk-space-16) var(--sk-space-8);
  }

  .top-border::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0.5px;
    background: rgba(100, 100, 100, 0.3);
    pointer-events: none;
  }

  .footer {
    position: relative;
    width: 100%;
    padding: var(--sk-space-16) var(--sk-space-8);
    /* background-color: var(--sk-bg-0, #121212); */
    font-family: var(--sk-font-family-ui);
    color: var(--sk-fg-3);
  }

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--sk-space-10);
    width: 100%;
    /* max-width: var(--sk-page-content-width); */
    /* margin: 0 auto; */
  }

  .footer-logo-column {
    grid-column: span 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .logo-link {
    display: inline-block;
    width: 150px;
		background: url(../branding/econic_logo.svg) no-repeat 0 50% / calc(100% - var(--padding-right))
  }

  .logo-link img {
    max-width: 200px;
    height: auto;
    /* filter: brightness(0) invert(1); */
  }

  :root.light .logo-link img {
    filter: none;
  }

  .footer-section {
    grid-column: span 1;
  }

  .footer-section h3 {
    font-size: var(--sk-text-xl);
    margin-bottom: var(--sk-space-3);
    font-weight: 500;
    color: var(--sk-fg-2);
  }

  .footer-section ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }


  .footer-section a {
    color: var(--sk-fg-3);
    text-decoration: none;
    font-size: var(--sk-text-base);
    transition: color 0.2s ease;
    opacity: 0.8;
  }

  .footer-section a:hover {
    color: var(--sk-fg-2);
    opacity: 1;
  }

  .social-icons {
    display: flex;
    gap: var(--sk-space-6);
    margin: var(--sk-space-4) 0;
  }

  .social-icons a {
    color: var(--sk-fg-3);
    font-size: 24px;
    transition: color 0.2s ease;
    opacity: 0.7;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .social-icons a:hover {
    color: var(--sk-fg-2);
    opacity: 1;
  }

  .copyright {
    color: var(--sk-fg-3);
    font: var(--sk-font-ui-small);
    opacity: 0.8;
  }

  @media (max-width: 900px) {
    .footer-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-logo-column {
      grid-column: span 2;
      margin-bottom: var(--sk-space-8);
    }
    
    .footer-section {
      grid-column: span 1;
    }
  }
  
  @media (max-width: 600px) {
    .footer-grid {
      grid-template-columns: 1fr;
    }
    
    .footer-logo-column,
    .footer-section {
      grid-column: span 1;
    }
  }
</style> 