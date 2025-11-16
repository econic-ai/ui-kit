<script lang="ts">
	const currentYear = new Date().getFullYear();
	let { links } = $props();

	// Create a combined array that includes the legal section
	const footerLinks = $derived([
		...links,
		{
			title: 'Legal',
			slug: 'legal',
			sections: [
				{ title: 'Privacy Policy', path: '#' },
				{ title: 'Terms & Conditions', path: '#' }
			]
		}
	]);
</script>

<div class="sk-footer">

	<div class="footer-container top-border">
		<!-- <div class="sk-container"> -->

		<div class="footer-logo-container">
			<a href="/" class="logo-link">
				<img src="/logos/econic.svg" alt="Econic Logo" width="160" />
				<!-- <img src="../branding/econic_logo.svg" alt="Econic Logo" width="150" /> -->
			</a>

			<!-- <div class="footer-social-icons">
				<a href="https://discord.gg/YpKq92XWz2" class="footer-social-icon discord"> -->
					<!-- <img src="../icons/footer/discord-icon.svg" alt="Discord" width="24" height="24" /> -->
				<!-- </a>		
				<a href="/" class="footer-social-icon github"> -->
					<!-- <img src="../icons/footer/github-icon.svg" alt="GitHub" width="24" height="24" /> -->
				<!-- </a> -->
				<!-- <a href="/" class="footer-social-icon instagram"> -->
					<!-- <img src="../icons/footer/instagram-icon.svg" alt="Instagram" width="24" height="24" /> -->
				<!-- </a> -->
				<!-- <a href="/" class="footer-social-icon youtube"> -->
					<!-- <img src="../icons/footer/youtube-icon.svg" alt="YouTube" width="24" height="24" /> -->
				<!-- </a> -->
			<!-- </div> -->

		</div>

		<footer class="footer">
			<!-- <div class="footer-grid">
				{#each footerLinks as link}
					{#if link.sections && link.sections.length > 0}
						<div class="footer-section">
							<h3>{link.title.toUpperCase()}</h3>
							<ul class="footer-section-list">
								{#each link.sections as section}
									<li><a href={section.path || '#'}>{section.title}</a></li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</div> -->
			<div class="footer-bottom">
				<div class="footer-bottom-links">
					<a href="/privacy">Privacy Policy</a>
					<a href="/terms">Terms of Service</a>
				</div>
				<div class="copyright">

					© {currentYear} Econic. All rights reserved.
				</div>
				<!-- <p>© {currentYear} Econic. All rights reserved.</p> -->
			</div>
		</footer>
		<!-- </div> -->
	</div>
</div>

<style>
	/* Top border using pseudo-element for theme compatibility */

	.footer-container {
		width: 100%;
		position: relative;
		padding-top: var(--sk-space-36);
		padding-left: var(--sk-space-8);
		padding-right: var(--sk-space-8);
    	padding-bottom:var(--sk-space-16);
		/* margin: auto; */
		/* max-width: 1440px; */
   		/* background: url('../icons/footer/Footer-background.png') center center/cover no-repeat; */

		/* @media (min-width: 670px) {
			padding-bottom: var(--sk-space-16);
		} */
	}

	.footer-bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		/* padding-top: var(--sk-space-24); */
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
		/* padding-top: var(--sk-space-24); */
		padding-left: var(--sk-space-24);
		padding-right: var(--sk-space-24);
		/* background-color: var(--sk-bg-0, #121212); */
		font-family: var(--sk-font-family-ui);
		color: var(--sk-fg-3);
		margin: auto;
		max-width: 1240px;
    max-height: 100%;
	}

	.footer-grid {
		display: flex;
		flex-wrap: nowrap;
		gap: 2rem;
		width: 100%;
		justify-content: space-between;
		/* max-width: var(--sk-page-content-width); */
		/* margin: 0 auto; */
	}


	.footer-bottom-links {
		display: flex;
		flex-direction: row;
		gap: 2rem;
		margin-right: 2rem;
	}

	.footer-bottom-links a {
		color: var(--sk-fg-3);
		text-decoration: none;
		font-size: var(--sk-text-base);
	}

	.logo-link {
		display: inline-block;
		/* width: 150px; */
		background-image: url(../branding/econic.svg);
		background-repeat: no-repeat;
		background-position: 50% 50%;
		background-size: contain;

	}

	.logo-link img {
		max-width: 200px;
		height: auto;
		/* filter: brightness(0) invert(1); */
	}

	:root.light .logo-link img {
		filter: none;
	}

  .footer-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: var(--sk-space-12);
    gap: 3rem;
  }

	.footer-section {
		flex: 1;
		min-width: 120px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 3rem;
	}

	.footer-section h3 {
		font-size: var(--sk-text-sm);
		margin-bottom: var(--sk-space-3);
		font-weight: 700;
		color: var(--sk-fg-2);
	}

	.footer-section ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
		font-weight: 300;
		color: var(--sk-fg-2);

	}

	.footer-section a {
		color: var(--sk-fg-3);
		text-decoration: none;
		font-size: var(--sk-text-base);
		transition: color 0.2s ease;
		opacity: 0.8;
    	gap: 0.5rem;
	}

	.footer-section a:hover {
		color: var(--sk-fg-2);
		opacity: 1;
	}

  .footer-section-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

	.footer-social-icons {
		display: flex;
		/* gap: var(--sk-space-6); */
		/* margin: var(--sk-space-4) 0; */
		align-items: center;
		justify-content: center;		
	}

	.footer-social-icon {
		width: 32px;
		height: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin: 1rem;	

		&.discord {
			background-image: url(../icons/footer/discord-icon.svg);
			background-repeat: no-repeat;
			background-position: 50% 50%;
			/* width: 24px; */
			background-size: contain;
		}

		&.github {
			background-image: url(../icons/footer/github-icon.svg);
			background-repeat: no-repeat;
			background-position: 50% 50%;
			width: 26px;
			background-size: contain;
		}

		&.instagram {
			background-image: url(../icons/footer/instagram-icon.svg);
			background-repeat: no-repeat;
			background-position: 50% 50%;
			background-size: contain;
			width: 28px;
		}

		&.youtube {
			background-image: url(../icons/footer/youtube-icon.svg);
			background-repeat: no-repeat;
			background-position: 50% 50%;
			background-size: contain;
			width: 36px;
		}		
	}
/* 
	.social-icons a {
		color: var(--sk-fg-3);
		font-size: 24px;
		transition: color 0.2s ease;
		opacity: 0.7;
		width: 42px;
		height: 42px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.social-icons a:hover {
		color: var(--sk-fg-2);
		opacity: 1;
	} */

	.copyright {
		color: var(--sk-fg-3);
		font: var(--sk-font-ui-small);
		opacity: 0.8;
	}

	/* .footer-columns h3 {
		color: #d9d9d9;
		font-family: Inter, sans-serif;
		font-size: 0.5rem;
		font-style: normal;
		font-weight: 600;
		line-height: normal;
		text-transform: uppercase;
	}
	.footer-columns ul li {
		color: #d9d9d9;
		font-family: Inter, sans-serif;
		font-size: 0.5rem;
		font-style: normal;
		font-weight: 300;
		line-height: normal;
		text-transform: capitalize;
 
	} */

	@media (max-width: 900px) {
		.footer-grid {
			flex-wrap: wrap;
			justify-content: flex-start;
		}

		.footer-section {
			flex: 1 1 calc(50% - 1rem);
			min-width: 140px;
		}
	}

	@media (max-width: 600px) {
		.footer-grid {
			flex-direction: column;
			align-items: center;
		}

		.footer-section {
			flex: 1 1 100%;
			text-align: center;
			min-width: unset;
		}
	}
</style>
