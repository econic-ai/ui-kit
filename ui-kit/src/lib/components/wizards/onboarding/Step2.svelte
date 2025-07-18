<script lang="ts">
    import { Button } from '@econic/ui-kit/components';
    import { wizardStore } from '@econic/ui-kit/stores';
    import { onMount } from 'svelte';

    const { next, back, exit } = $props<{
        next?: () => void,
        back?: () => void,
        exit?: () => void
    }>();

    // Get the wizard and current step
    function handleAccept() {
        wizardStore.setStepState('onboarding', 2, 'completed');
        next?.();
    }

    function handleBack() {
        back?.();
    }

    function handleExit() {
        exit?.();
    }
</script>

<div class="wizard-step">
    <div class="wizard-step-content">
        <h1>Terms and conditions.</h1>
        <div class="step-content-container">
            <div class="step-scrollable-content">
                <div class="terms-content">
                    <h2>1. Introduction</h2>
                    <p>Welcome to Econic AI ("we," "our," or "us"). By accessing or using our artificial intelligence and data analytics services, you agree to these Terms and Conditions. These terms constitute a legally binding agreement between you and Econic AI regarding your use of our platform, services, and associated technologies.</p>
                    <p>Please read these terms carefully before using our services. By accessing or using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.</p>

                    <h2>2. Service Description</h2>
                    <p>Econic AI provides advanced artificial intelligence and machine learning solutions for business intelligence, data analytics, and process automation. Our platform includes various tools and features designed to enhance your organization's digital capabilities.</p>
                    <p>Our services include, but are not limited to:</p>
                    <ul>
                        <li>Advanced data analytics and visualization tools</li>
                        <li>Machine learning model development and deployment</li>
                        <li>Automated business process optimization</li>
                        <li>Real-time monitoring and alerting systems</li>
                        <li>Custom AI solution development</li>
                        <li>Integration with existing business systems</li>
                    </ul>

                    <h2>3. Data Processing</h2>
                    <p>By using our services, you acknowledge and agree that we will process your organization's data in accordance with our data processing agreements and privacy policy. We implement industry-standard security measures to protect your information.</p>
                    <p>Our data processing activities include:</p>
                    <ul>
                        <li>Collection and storage of business data</li>
                        <li>Analysis and processing for insights generation</li>
                        <li>Model training and optimization</li>
                        <li>Automated decision-making processes</li>
                        <li>Data backup and recovery procedures</li>
                    </ul>
                    <p>We maintain strict data segregation policies and implement advanced encryption protocols to ensure the security and privacy of your information.</p>

                    <h2>4. User Obligations</h2>
                    <p>You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the confidentiality of your account credentials</li>
                        <li>Use the services in compliance with applicable laws and regulations</li>
                        <li>Not attempt to reverse engineer or compromise our systems</li>
                        <li>Regularly update your contact and billing information</li>
                        <li>Report any security vulnerabilities or breaches immediately</li>
                        <li>Ensure proper training of your staff using our platform</li>
                        <li>Maintain appropriate data backup procedures</li>
                    </ul>

                    <h2>5. Intellectual Property</h2>
                    <p>All intellectual property rights in our services, including algorithms, models, and software, remain our exclusive property. You receive a limited license to use these services for your business purposes.</p>
                    <p>This includes, but is not limited to:</p>
                    <ul>
                        <li>Software code and algorithms</li>
                        <li>User interface designs and elements</li>
                        <li>Documentation and training materials</li>
                        <li>Brand names, logos, and trademarks</li>
                        <li>Generated reports and analytics</li>
                    </ul>

                    <h2>6. Liability and Indemnification</h2>
                    <p>Our liability is limited to the extent permitted by law. We are not responsible for indirect, consequential, or incidental damages arising from your use of our services.</p>
                    <p>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:</p>
                    <ul>
                        <li>Violation of these terms</li>
                        <li>Unauthorized use of the services</li>
                        <li>Infringement of third-party rights</li>
                        <li>Misuse of generated insights or recommendations</li>
                    </ul>

                    <h2>7. Service Availability and Performance</h2>
                    <p>While we strive for high availability, we do not guarantee uninterrupted access to our services. We reserve the right to modify, suspend, or terminate services with reasonable notice.</p>
                    <p>Our service level commitments include:</p>
                    <ul>
                        <li>99.9% platform availability target</li>
                        <li>Regular maintenance windows</li>
                        <li>Emergency hotfix deployments</li>
                        <li>24/7 monitoring and alerting</li>
                        <li>Disaster recovery procedures</li>
                    </ul>

                    <h2>8. Data Protection and Privacy Compliance</h2>
                    <p>You are responsible for ensuring your use of our services complies with applicable laws and regulations, including data protection and privacy laws.</p>
                    <p>We maintain compliance with:</p>
                    <ul>
                        <li>GDPR and other privacy regulations</li>
                        <li>Industry-standard security protocols</li>
                        <li>Data retention and deletion policies</li>
                        <li>Cross-border data transfer requirements</li>
                    </ul>

                    <h2>9. Termination and Data Handling</h2>
                    <p>We may terminate or suspend your access to our services for violations of these terms or for any other reason at our discretion. Upon termination:</p>
                    <ul>
                        <li>All access rights will be revoked immediately</li>
                        <li>Data will be retained for 30 days</li>
                        <li>You may request data export during this period</li>
                        <li>All data will be permanently deleted after 30 days</li>
                    </ul>

                    <h2>10. Changes to Terms and Services</h2>
                    <p>We may modify these terms at any time. Continued use of our services after such changes constitutes acceptance of the modified terms. We will provide notification of:</p>
                    <ul>
                        <li>Material changes to these terms</li>
                        <li>Significant service updates</li>
                        <li>Pricing modifications</li>
                        <li>Policy updates</li>
                    </ul>

                    <h2>11. Governing Law and Jurisdiction</h2>
                    <p>These terms are governed by applicable laws, and any disputes shall be resolved in the appropriate courts. You agree to:</p>
                    <ul>
                        <li>Submit to exclusive jurisdiction</li>
                        <li>Waive any objection to venue</li>
                        <li>Accept electronic documents as originals</li>
                        <li>Participate in good faith dispute resolution</li>
                    </ul>

                    <h2>12. Support and Communication</h2>
                    <p>For questions about these terms or our services, contact methods include:</p>
                    <ul>
                        <li>Legal Department: legal@econic.ai</li>
                        <li>Technical Support: support@econic.ai</li>
                        <li>Business Inquiries: sales@econic.ai</li>
                        <li>Emergency Contact: emergency@econic.ai</li>
                    </ul>

                    <h2>13. Financial Terms</h2>
                    <p>Payment and billing terms include:</p>
                    <ul>
                        <li>Monthly or annual subscription options</li>
                        <li>Usage-based pricing components</li>
                        <li>30-day payment terms</li>
                        <li>Automatic renewal policies</li>
                        <li>Refund and credit procedures</li>
                    </ul>

                    <h2>14. Service Level Agreements</h2>
                    <p>Our service level agreements cover:</p>
                    <ul>
                        <li>Response time guarantees</li>
                        <li>Resolution time commitments</li>
                        <li>Uptime guarantees</li>
                        <li>Compensation for breaches</li>
                        <li>Escalation procedures</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="button-container">
        <Button onClick={handleExit}>Exit</Button>
        <Button onClick={handleBack}>Back</Button>
        <div class="spacer"></div>
        <Button onClick={handleAccept}>Accept</Button>
    </div>
</div>

<style lang="sass">
.terms-content
    h2
        color: var(--sk-fg-1)
        font-size: 1.4rem
        margin: 2rem 0 1rem 0
        &:first-child
            margin-top: 0

    p
        color: var(--sk-fg-2)
        line-height: 1.6
        margin-bottom: 1rem

    ul
        margin: 1rem 0
        padding-left: 2rem
        
        li
            color: var(--sk-fg-2)
            margin-bottom: 0.5rem
            line-height: 1.4
</style>

