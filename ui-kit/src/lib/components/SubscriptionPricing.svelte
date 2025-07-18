<script lang="ts">
    // Props for the component
    const { onSelect, selectedPlan: initialSelectedPlan } = $props<{
        onSelect?: (plan: string) => void,
        selectedPlan?: string
    }>();

    interface Feature {
        name: string;
        category?: string;
        description?: string;
    }

    interface PlanFeature {
        type: 'none' | 'info' | 'included';
        info?: string;
        class?: string;
    }

    interface Plan {
        id: string;
        title: string;
        description: string;
        icon: string;
        basePrice: number;
        seatPrice?: number;
        features: Record<string, PlanFeature>;
    }

    // Define features with optional categories
    const features: Feature[] = [
        // Core/Primary features (no category)
        { name: 'Personal AI', description: 'Basic AI interaction capabilities' },
        { name: 'Data Integration', description: 'Connect your data sources' },
        { name: 'Knowledge Graph', description: 'Connect your data sources' },
        { name: 'Intelligence Feeds', description: 'Connect your data sources' },
        { name: 'Beta Features', description: 'Connect your data sources' },
        
        // Collaboration features
        { name: 'Team Collaboration', category: 'Collaboration', description: 'Work together with your team' },
        { name: 'Shared Workspaces', category: 'Collaboration', description: 'Create and manage shared spaces' },
        { name: 'Role Management', category: 'Collaboration', description: 'Define user roles and permissions' },
        
        // Analytics features
        { name: 'Basic Analytics', category: 'Analytics', description: 'View basic usage statistics' },
        { name: 'Advanced Insights', category: 'Analytics', description: 'Deep dive into your data' },
        { name: 'Custom Reports', category: 'Analytics', description: 'Create personalized reports' },
        
        // Security features
        { name: 'Data Encryption', category: 'Security', description: 'Enterprise-grade encryption' },
        { name: 'Audit Logs', category: 'Security', description: 'Track all system activities' },
        { name: 'SSO Integration', category: 'Security', description: 'Single sign-on capability' }
    ];

    // Define plans with their features
    const plans: Plan[] = [
        {
            id: 'free',
            title: 'Free',
            description: 'Get started with basic features',
            icon: 'fa-regular fa-rocket',
            basePrice: 0,
            features: {
                'Personal AI': { type: 'included' },
                'Data Integration': { type: 'included' },
                'Knowledge Graph': { type: 'included' },
                'Intelligence Feeds': { type: 'included' },
                'Beta Features': { type: 'none' },
                'Team Collaboration': { type: 'none' },
                'Shared Workspaces': { type: 'none' },
                'Role Management': { type: 'none' },
                'Basic Analytics': { type: 'included' },
                'Advanced Insights': { type: 'none' },
                'Custom Reports': { type: 'none' },
                'Data Encryption': { type: 'included' },
                'Audit Logs': { type: 'none' },
                'SSO Integration': { type: 'none' }
            }
        },
        {
            id: 'personal',
            title: 'Beta',
            description: 'Perfect for individual professionals',
            icon: 'fa-regular fa-user',
            basePrice: 50,
            features: {
                'Personal AI': { type: 'included' },
                'Knowledge Graph': { type: 'included' },
                'Intelligence Feeds': { type: 'included' },
                'Beta Features': { type: 'included', class: 'orange' },
                'Data Integration': { type: 'included' },
                'Team Collaboration': { type: 'none' },
                'Shared Workspaces': { type: 'none' },
                'Role Management': { type: 'none' },
                'Basic Analytics': { type: 'included' },
                'Advanced Insights': { type: 'info', info: 'Basic insights only' },
                'Custom Reports': { type: 'none' },
                'Data Encryption': { type: 'included' },
                'Audit Logs': { type: 'info', info: 'Personal logs only' },
                'SSO Integration': { type: 'none' }
            }
        },
        {
            id: 'teams',
            title: 'Teams',
            description: 'Collaborate with your team',
            icon: 'fa-regular fa-users',
            basePrice: 50,
            seatPrice: 30,
            features: {
                'Personal AI': { type: 'included' },
                'Data Integration': { type: 'included' },
                'Knowledge Graph': { type: 'included' },
                'Intelligence Feeds': { type: 'included' },
                'Beta Features': { type: 'none' },
                'Team Collaboration': { type: 'included' },
                'Shared Workspaces': { type: 'included' },
                'Role Management': { type: 'included' },
                'Basic Analytics': { type: 'included' },
                'Advanced Insights': { type: 'included' },
                'Custom Reports': { type: 'info', info: 'Up to 5 custom reports' },
                'Data Encryption': { type: 'included' },
                'Audit Logs': { type: 'included' },
                'SSO Integration': { type: 'info', info: 'Additional cost' }
            }
        },
        {
            id: 'enterprise',
            title: 'Enterprise',
            description: 'Full suite for organizations',
            icon: 'fa-regular fa-building',
            basePrice: 499,
            seatPrice: 49,
            features: {
                'Personal AI': { type: 'included' },
                'Data Integration': { type: 'included' },
                'Knowledge Graph': { type: 'included' },
                'Intelligence Feeds': { type: 'included' },
                'Beta Features': { type: 'none' },
                'Team Collaboration': { type: 'included' },
                'Shared Workspaces': { type: 'included' },
                'Role Management': { type: 'included' },
                'Basic Analytics': { type: 'included' },
                'Advanced Insights': { type: 'included' },
                'Custom Reports': { type: 'included' },
                'Data Encryption': { type: 'included' },
                'Audit Logs': { type: 'included' },
                'SSO Integration': { type: 'included' }
            }
        }
    ];

    // Initialize selected plan from prop
    let selectedPlan = $state<string | undefined>(initialSelectedPlan);

    function handleSelect(planId: string) {
        selectedPlan = planId;
        onSelect?.(planId);
    }
</script>

<div class="subscription-pricing">
    <div class="pricing-container">
        <div class="pricing-table">
            <!-- Features column -->
            <div class="features-column">
                <div class="header-spacer"></div>
                {#each features as feature}
                    {#if feature.category && features.indexOf(feature) === features.findIndex(f => f.category === feature.category)}
                        <div class="category-divider">
                            <span class="category-text">
                                {feature.category}
                                <i class="fa-solid fa-chevron-right category-icon"></i>
                            </span>
                        </div>
                    {/if}
                    <div class="feature-row">
                        <span class="feature-name">{feature.name}</span>
                    </div>
                {/each}
            </div>

            <!-- Plan columns -->
            {#each plans as plan}
                <div class="plan-column" class:selected={selectedPlan === plan.id} onclick={() => handleSelect(plan.id)}>
                    <div class="plan-header">
                        <div class="plan-icon">
                            <i class={plan.icon}></i>
                        </div>
                        <h3>{plan.title}</h3>
                        <p class="plan-description">{plan.description}</p>
                        <div class="plan-pricing">
                            <div class="base-price">
                                <span class="currency">$</span>
                                <span class="amount">{plan.basePrice}</span>
                                <span class="period">/mo</span>
                            </div>
                            {#if plan.seatPrice}
                                <div class="seat-price">
                                    +${plan.seatPrice} seat/mo
                                </div>
                            {/if}
                        </div>
                    </div>

                    {#each features as feature}
                        {#if feature.category && features.indexOf(feature) === features.findIndex(f => f.category === feature.category)}
                            <div class="category-divider">
                                <span class="category-text">&nbsp;</span>
                            </div>
                        {/if}
                        <div class="feature-row">
                            <div class="feature-indicator test {plan.features[feature.name].class}">
                                {#if plan.features[feature.name].type === 'included'}
                                    <i class="fa-solid fa-circle feature-included"></i>
                                {:else if plan.features[feature.name].type === 'info'}
                                    <i class="fa-solid fa-circle-info feature-info" title={plan.features[feature.name].info}></i>
                                {:else}
                                    <i class="fa-regular fa-circle feature-none"></i>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="sass">
.subscription-pricing
    width: 100%
    padding: 2rem
    background-color: var(--sk-bg-2)
    border-radius: 8px

.pricing-container
    width: 100%
    margin: 0 auto

    h2
        text-align: center
        margin-bottom: 3rem
        color: var(--sk-fg-1)
        font-size: 5rem
        font-weight: 400

.pricing-table
    display: flex
    gap: 1rem
    overflow-x: auto
    padding-bottom: 2rem

.features-column
    min-width: 280px
    width: 100%
    padding-top: 300px

.plan-column
    min-width: 280px
    width: 100%
    cursor: pointer
    transition: all 0.2s ease-in-out
    border: 1px solid var(--sk-border)
    border-radius: 8px
    background-color: var(--sk-bg-1)
    padding-bottom: 4rem

    &:hover
        border-color: var(--sk-bg-4)
        background-color: var(--sk-bg-2)

    &.selected
        border-color: var(--sk-fg-accent)

.header-spacer
    margin-bottom: 3rem

.plan-header
    height: 300px
    padding: 2rem
    border-bottom: 1px solid var(--sk-border)
    text-align: center
    margin-bottom: 3rem

    h3
        color: var(--sk-fg-1)
        font-size: 1.8rem
        margin: 0.5rem 0
        padding: 0.5rem 1.5rem
        display: inline-block
        border-radius: 4px
        background-color: var(--sk-bg-4)

    .plan-icon
        font-size: 5.4rem
        color: var(--sk-fg-accent)
        margin: 1.5rem

    .plan-description
        color: var(--sk-fg-3)
        font-size: 1.7rem
        font-weight: 300
        margin-bottom: 1.5rem
        min-height: 2.4em

.plan-pricing
    .base-price
        font-size: 3.4rem
        line-height: 1.2
        color: var(--sk-fg-1)
        margin-bottom: 0rem

        .currency, .period
            font-size: 1.5rem
            color: var(--sk-fg-3)

    .seat-price
        font-size: 1.5rem
        color: var(--sk-fg-3)

.feature-row
    padding: 1.5rem
    display: flex
    align-items: center
    min-height: 3rem
    font-size: 1.5rem
    line-height: 1
    height: 40px

    .feature-name
        color: var(--sk-fg-2)
        padding-left: 1rem
        font-weight: 300
        line-height: 1

    .feature-indicator
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        line-height: 1

.category-divider
    margin: 4rem 0 0.5rem 0
    border-top: 1px solid var(--sk-border)
    min-height: 3rem
    display: flex
    align-items: center

    .category-text
        padding: 1rem
        color: var(--sk-fg-2)
        font-size: 1.2rem
        font-weight: 500
        text-transform: uppercase
        letter-spacing: 0.05em
        display: flex
        align-items: center
        gap: 0.5rem

        .category-icon
            font-size: 0.8rem
            color: var(--sk-fg-3)

.feature-included
    color: #00d647
    font-size: 2rem
    line-height: 1

.feature-info
    color: var(--sk-fg-3)
    font-size: 2rem
    line-height: 1
    cursor: help

.feature-none
    color: var(--sk-fg-4)
    font-size: 2rem
    line-height: 1


.orange
    i
        color: orange
</style> 