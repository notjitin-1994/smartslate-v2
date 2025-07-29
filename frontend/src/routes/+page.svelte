<script lang="ts">
  import Header from '$lib/components/pages/common/Header.svelte';
  import Hero from '$lib/components/pages/landing/Hero.svelte';
  import TalentParadox from '$lib/components/pages/landing/TalentParadox.svelte';
  import Framework from '$lib/components/pages/landing/Framework.svelte';
  import ROICalculator from '$lib/components/pages/landing/ROICalculator.svelte';
  import Partners from '$lib/components/pages/landing/Partners.svelte';
  import Footer from '$lib/components/pages/common/Footer.svelte';
 </script>
 
 <Header />
 
 <main id="main-content">
  <Hero />
  <TalentParadox />
  <Framework />
  <ROICalculator />
  <Partners />
 </main>

<Footer />

<style>
	main {
		/* Creates space for the sticky floating header */
		margin-top: var(--space-lg);
	}
</style>
