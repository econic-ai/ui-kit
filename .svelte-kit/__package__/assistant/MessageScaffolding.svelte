<script lang="ts">
	import { onMount } from 'svelte';

	// Dummy data for messages
	const messages = [
		{
			id: 1,
			source: 'system',
			name: 'System',
			content: 'Welcome to Econic Assistant. I\'m here to help you navigate and interact with your workspace.',
			timestamp: new Date(Date.now() - 3600000).toISOString()
		},
		{
			id: 2,
			source: 'user',
			name: 'Jordan',
			content: 'Hello! Can you help me understand how to use the Massive Graph feature?',
			timestamp: new Date(Date.now() - 3500000).toISOString()
		},
		{
			id: 3,
			source: 'assistant',
			name: 'Econic Assistant',
			content: 'Of course! The Massive Graph is a powerful feature that allows you to visualize and interact with complex data relationships. It supports real-time collaboration, 3D visualization, and intelligent data processing.',
			timestamp: new Date(Date.now() - 3400000).toISOString()
		},
		{
			id: 4,
			source: 'assistant-sub',
			name: 'Graph Helper',
			content: 'I can provide specific details about graph navigation: Use mouse to pan, scroll to zoom, and click nodes to expand.',
			timestamp: new Date(Date.now() - 3300000).toISOString()
		},
		{
			id: 5,
			source: 'user',
			name: 'Jordan',
			content: 'That\'s helpful. Can you show me how to create a new node?',
			timestamp: new Date(Date.now() - 3200000).toISOString()
		},
		{
			id: 6,
			source: 'assistant',
			name: 'Econic Assistant',
			content: 'To create a new node in Massive Graph:\n1. Right-click on the canvas\n2. Select "Create Node" from the context menu\n3. Choose your node type\n4. Enter the node details\n\nWould you like me to walk you through a specific node type?',
			timestamp: new Date(Date.now() - 3100000).toISOString()
		},
		{
			id: 7,
			source: 'debug',
			name: 'Debug',
			content: '[Graph Engine] Node creation listener activated. Context menu ready.',
			timestamp: new Date(Date.now() - 3000000).toISOString()
		},
		{
			id: 8,
			source: 'user',
			name: 'Jordan',
			content: 'Yes, please show me how to create an Agent node.',
			timestamp: new Date(Date.now() - 2900000).toISOString()
		},
		{
			id: 9,
			source: 'assistant',
			name: 'Econic Assistant',
			content: 'Creating an Agent node is straightforward. Agent nodes represent autonomous entities in your system that can perform tasks and interact with other nodes.',
			timestamp: new Date(Date.now() - 2800000).toISOString()
		},
		{
			id: 10,
			source: 'assistant-sub',
			name: 'Agent Specialist',
			content: 'Agent properties include: Name, Role, Capabilities, Connections, and Triggers. Each agent can have multiple connections to other nodes.',
			timestamp: new Date(Date.now() - 2700000).toISOString()
		},
		{
			id: 11,
			source: 'system',
			name: 'System',
			content: 'New feature available: Agent Templates. You can now use pre-configured agent templates for common use cases.',
			timestamp: new Date(Date.now() - 2600000).toISOString()
		},
		{
			id: 12,
			source: 'user',
			name: 'Jordan',
			content: 'Great! I\'ll try creating one now. Also, how do I connect agents together?',
			timestamp: new Date(Date.now() - 2500000).toISOString()
		},
		{
			id: 13,
			source: 'assistant',
			name: 'Econic Assistant',
			content: 'To connect agents:\n1. Click and hold on the source agent\n2. Drag to the target agent\n3. Release to create a connection\n4. Configure the connection type in the popup\n\nConnections can be bidirectional or unidirectional, and you can specify data flow rules.',
			timestamp: new Date(Date.now() - 2400000).toISOString()
		},
		{
			id: 14,
			source: 'debug',
			name: 'Debug',
			content: '[Connection Manager] Ready for drag operation. Connection types: Data Flow, Event Trigger, Command Chain, State Sync.',
			timestamp: new Date(Date.now() - 2300000).toISOString()
		},
		{
			id: 15,
			source: 'user',
			name: 'Jordan',
			content: 'Perfect! This is exactly what I needed. Thank you!',
			timestamp: new Date(Date.now() - 2200000).toISOString()
		},
		{
			id: 16,
			source: 'assistant',
			name: 'Econic Assistant',
			content: 'You\'re welcome! Feel free to ask if you need help with anything else. I\'m here to assist with all aspects of the Econic platform.',
			timestamp: new Date(Date.now() - 2100000).toISOString()
		}
	];

	// Format timestamp
	function formatTime(timestamp: string) {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	}

	// Auto-scroll to bottom on mount
	let messagesContainer: HTMLDivElement;
	onMount(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});
</script>

<div class="message-scaffolding">
	<div class="messages-container" bind:this={messagesContainer}>
		{#each messages as message}
			<div class="message-wrapper {message.source}">
				<div class="message">
					<div class="message-header">
						<span class="message-name">{message.name}</span>
						<span class="message-time">{formatTime(message.timestamp)}</span>
					</div>
					<div class="message-content">
						{message.content}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.message-scaffolding {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		
		/* Custom scrollbar styling */
		scrollbar-width: 3px;
		scrollbar-color: var(--sk-scrollbar) transparent;
		
		&::-webkit-scrollbar {
			width: 8px;
		}
		
		&::-webkit-scrollbar-track {
			background: transparent;
		}
		
		&::-webkit-scrollbar-thumb {
			background-color: var(--sk-scrollbar);
			border-radius: 4px;
		}
		
		&::-webkit-scrollbar-thumb:hover {
			background-color: var(--sk-fg-4);
		}
	}

	.message-wrapper {
		display: flex;
		width: 100%;
		
		&.system, &.debug {
			justify-content: center;
		}
		
		&.assistant, &.assistant-sub {
			justify-content: flex-start;
		}
		
		&.user {
			justify-content: flex-end;
		}
		
		&.assistant-sub {
			padding-left: 3rem;
		}
	}

	.message {
		min-width: 75%;
		max-width: 100%;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		
		@media (min-width: 768px) {
			min-width: auto;
			max-width: 75%;
		}
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		gap: 1rem;
	}

	.message-name {
		font-weight: 600;
		font-size: 1.25rem;
		opacity: 0.9;
	}

	.message-time {
		font-size: 1rem;
		opacity: 0.6;
	}

	.message-content {
		font-size: 1.5rem;
		line-height: 1.6;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	/* Message source-specific styling */
	.system .message {
		background: var(--sk-bg-4);
		color: var(--sk-fg-3);
		max-width: 60%;
		text-align: center;
		
		.message-header {
			justify-content: center;
		}
		
		.message-name {
			color: var(--sk-fg-accent);
		}
	}

	.debug .message {
		background: var(--sk-bg-highlight);
		color: var(--sk-fg-3);
		max-width: 80%;
		font-family: monospace;
		
		.message-name {
			color: var(--sk-fg-accent2);
		}
		
		.message-content {
			font-size: 1.25rem;
			font-family: monospace;
		}
	}

	.assistant .message {
		background: var(--sk-bg-3);
		color: var(--sk-fg-2);
		
		.message-name {
			color: var(--sk-fg-1);
		}
	}

	.assistant-sub .message {
		background: var(--sk-bg-4);
		color: var(--sk-fg-3);
		opacity: 0.85;
		
		.message-name {
			color: var(--sk-fg-2);
		}
		
		.message-content {
			font-size: 1.3rem;
		}
	}

	.user .message {
		background: var(--sk-bg-4);
		color: var(--sk-fg-1);
		
		.message-name {
			color: var(--sk-fg-3);
			opacity: 0.9;
		}
		
		.message-time {
			color: var(--sk-fg-3);
			opacity: 0.7;
		}
	}

	/* Light theme adjustments */
	:global(.light) {
		.system .message {
			background: var(--sk-bg-2);
			
			.message-name {
				color: var(--sk-fg-accent);
			}
		}
		
		.debug .message {
			background: var(--sk-bg-highlight);
			color: var(--sk-fg-1);
			
			.message-name {
				color: var(--sk-fg-accent2);
			}
		}
		
		.assistant .message {
			background: var(--sk-bg-3);
		}
		
		.assistant-sub .message {
			background: var(--sk-bg-4);
		}
		
		.user .message {
			background: var(--sk-bg-3);
			color: white;
			
			.message-name, .message-time {
				color: white;
			}
		}
	}
</style>
