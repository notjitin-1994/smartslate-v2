<script lang="ts">
  import { tick } from 'svelte';
  import Header from '$lib/components/pages/common/Header.svelte';
  import Hero from '$lib/components/pages/landing/Hero.svelte';
  import TalentParadox from '$lib/components/pages/landing/TalentParadox.svelte';
  import Framework from '$lib/components/pages/landing/Framework.svelte';
  import ROICalculator from '$lib/components/pages/landing/ROICalculator.svelte';
  import Partners from '$lib/components/pages/landing/Partners.svelte';
  import Footer from '$lib/components/pages/common/Footer.svelte';

  let visibleSections = {
    talentParadox: false,
    framework: false,
    roiCalculator: false,
    partners: false
  };

  let talentParadoxSection: HTMLElement;
  let frameworkSection: HTMLElement;
  let roiCalculatorSection: HTMLElement;
  let partnersSection: HTMLElement;

  async function revealSection(section: keyof typeof visibleSections) {
    visibleSections[section] = true;
    visibleSections = visibleSections; // Trigger reactivity

    // Wait for the DOM to update
    await tick();

    // Now scroll to the element
    if (section === 'talentParadox' && talentParadoxSection) {
      talentParadoxSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'framework' && frameworkSection) {
      frameworkSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'roiCalculator' && roiCalculatorSection) {
      roiCalculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'partners' && partnersSection) {
      partnersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<Header />

<main id="main-content">
  <Hero on:revealNext={() => revealSection('talentParadox')} />

  {#if visibleSections.talentParadox}
    <div bind:this={talentParadoxSection}>
      <TalentParadox on:revealNext={() => revealSection('framework')} />
    </div>
  {/if}

  {#if visibleSections.framework}
    <div bind:this={frameworkSection}>
      <Framework on:revealNext={() => revealSection('roiCalculator')} />
    </div>
  {/if}

  {#if visibleSections.roiCalculator}
    <div bind:this={roiCalculatorSection}>
      <ROICalculator on:revealNext={() => revealSection('partners')} />
    </div>
  {/if}

  {#if visibleSections.partners}
    <div bind:this={partnersSection}>
      <Partners />
    </div>
  {/if}
</main>

<Footer />

<style>
	main {
		/* Creates space for the sticky floating header */
		margin-top: var(--space-lg);
	}
</style>
