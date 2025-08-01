<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let visible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector('.infographic-container');
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  });
  
  const features = [
    {
      icon: '📊',
      title: 'Industry-Validated Skills',
      description: 'Courses on the most in-demand skills identified through comprehensive industry research.'
    },
    {
      icon: '👔',
      title: 'Leader & Hiring Manager Visibility',
      description: 'Smartslate Certification is recognized and valued by industry leaders and hiring managers.'
    },
    {
      icon: '🎯',
      title: 'Strict Certification Standards',
      description: 'Rigorous requirements ensure only truly qualified candidates earn certification.'
    }
  ];
</script>

<div class="infographic-container" in:fade={{ duration: 600 }}>
  <div class="infographic">
    {#each features as feature, i (i)}
      <div 
        class="feature" 
        in:fly={{ 
          y: 50, 
          duration: 600, 
          delay: i * 100,
          easing: quintOut
        }}
        out:fade
      >
        <div class="icon">
          {feature.icon}
        </div>
        <h3 class="title">{feature.title}</h3>
        <p class="description">{feature.description}</p>
      </div>
    {/each}
    
    <div 
      class="sparkle"
      class:visible
      in:fade={{ 
        delay: 1000,
        duration: 1000
      }}
    >
      <div class="sparkle-dot dot-1"></div>
      <div class="sparkle-dot dot-2"></div>
    </div>
  </div>
</div>

<style>
  .infographic-container {
  	width: 100%;
  	height: 100%;
  	display: flex;
  	flex-direction: column;
  	justify-content: center;
  }
  
  .infographic {
  	position: relative;
  	display: grid;
  	grid-template-columns: 1fr;
  	gap: var(--space-lg);
  	counter-reset: feature;
  }
  
  .feature {
  	position: relative;
  	padding: 2rem 1.5rem;
  	background: var(--container-bg);
  	border-radius: 12px;
  	box-shadow: var(--shadow-lg);
  	transition: transform 0.3s ease, box-shadow 0.3s ease;
  	z-index: 1;
  	overflow: hidden;
  	border: 1px solid var(--border-color);
  }
  
  .feature::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4F46E5, #7C3AED);
  }
  
  .feature:hover {
  	transform: translateY(-5px);
  	box-shadow: var(--shadow-xl);
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  .title {
  	font-size: 1.25rem;
  	font-weight: 600;
  	color: var(--text-primary);
  	margin-bottom: 1rem;
  	line-height: 1.3;
  }
  
  .description {
  	color: var(--text-secondary);
  	line-height: 1.6;
  	font-size: 0.95rem;
  }
  
  .sparkle {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    transition: opacity 1s ease;
  }
  
  .sparkle.visible {
    opacity: 1;
  }
  
  .sparkle-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8B5CF6, #4F46E5);
    filter: blur(1px);
    opacity: 0;
  }
  
  .dot-1 {
    top: 20%;
    left: 15%;
    animation: float 6s ease-in-out infinite;
  }
  
  .dot-2 {
    top: 60%;
    right: 20%;
    animation: float 7s ease-in-out 1s infinite;
  }
  
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-20px) scale(1.2);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .infographic {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .feature {
      padding: 1.5rem;
    }
  }
</style>
