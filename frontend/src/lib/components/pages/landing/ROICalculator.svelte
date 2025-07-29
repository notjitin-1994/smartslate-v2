<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Container from '$lib/components/common/Container.svelte';
	import PersonaSelector from './roi-calculator/PersonaSelector.svelte';
	import MetricCard from './roi-calculator/MetricCard.svelte';
	import {
		TrendingUp,
		Award,
		Link as LinkIcon,
		Clock,
		ArrowLeft,
		Briefcase,
		GraduationCap,
		User
	} from 'lucide-svelte';

	type Persona = 'businessman' | 'educator' | 'student';

	let persona: Persona | null = null;

	// State for sliders
	let teamSize = 50;
	let studentCount = 500;
	let currentSalary = 180000;

	// --- Business Metric Calculations ---
	$: retentionSavings = (teamSize * 0.2 * 0.5) * 75000;
	$: productivityBoost = Math.floor(teamSize * 2000 * 0.25);
	$: aiRevenueLift = teamSize * 10000;

	// --- Education Metric Calculations ---
	$: employabilityBoost = Math.round(studentCount * 0.15);
	const fasterPlacement = 6;
	$: industryPartnerships = Math.ceil(studentCount / 100);

	// --- Student Metric Calculations ---
	$: salaryIncrease = currentSalary * 0.22; // 22% average increase
	const promotionTime = 18; // 18 months average
	$: fasterPromotion = promotionTime * 0.35; // 35% faster
	const jobOpportunities = 5; // 5x multiplier

	const tweenedOptions = {
		duration: 800,
		easing: cubicOut
	};

	const animatedSavings = tweened(0, tweenedOptions);
	const animatedProductivity = tweened(0, tweenedOptions);
	const animatedRevenue = tweened(0, tweenedOptions);
	const animatedEmployability = tweened(0, tweenedOptions);
	const animatedPartnerships = tweened(0, tweenedOptions);
	const animatedSalary = tweened(0, tweenedOptions);
	const animatedPromotion = tweened(0, tweenedOptions);

	$: animatedSavings.set(retentionSavings);
	$: animatedProductivity.set(productivityBoost);
	$: animatedRevenue.set(aiRevenueLift);
	$: animatedEmployability.set(employabilityBoost);
	$: animatedPartnerships.set(industryPartnerships);
	$: animatedSalary.set(salaryIncrease);
	$: animatedPromotion.set(fasterPromotion);

	let headlines: Record<Persona, string> = {
		businessman:
			'Turn <strong>Talent</strong> into Your <strong>Greatest Financial Asset</strong>',
		educator: 'Forge the <strong>Future of Graduate Success</strong>',
		student: 'Engineer Your <strong>Career Trajectory</strong>'
	};

	let closingArguments: Record<Persona, string> = {
		businessman: `The data is clear: investing in your team is the most direct path to <strong>sustainable growth</strong>. Beyond the numbers, a culture of learning fosters <strong>unmatched loyalty</strong> and creates a <strong>resilient workforce</strong> ready to outmaneuver the competition. Let's build your competitive advantage, together.`,
		educator: `These numbers represent more than just statistics; they represent <strong>enhanced institutional prestige</strong> and a direct answer to the demands of the modern economy. By producing <strong>verifiably skilled graduates</strong>, you create a powerful flywheel of <strong>industry partnerships and top-tier student recruitment</strong>. Let's build the future of education, together.`,
		student: `Your career is your most valuable asset. The right skills don't just lead to a better salary; they unlock <strong>accelerated career paths</strong>, greater <strong>professional influence</strong>, and the freedom to pursue <strong>opportunities you're truly passionate about</strong>. Invest in yourself and take control of your future.`
	};

	function handlePersonaSelect(event: CustomEvent) {
		persona = event.detail.persona;
	}
</script>

<section id="roi-calculator">
	<Container>
		<div class="section-header">
			<h2>Choose your <span class="accent">Persona</span></h2>
			<p>
				Your goals are <span class="accent">unique</span>. Your data should be too. Select the role
				that best describes you to unlock a
				<span class="accent">personalized impact analysis</span>.
			</p>
		</div>

		<div class="calculator-wrapper">
			{#if !persona}
				<PersonaSelector on:select={handlePersonaSelect} />
			{:else}
				<div class="calculator-view">
					<div class="calculator-header">
						<h2>{@html headlines[persona]}</h2>
						<button on:click={() => (persona = null)} class="back-button">
							<ArrowLeft size={16} />
							<span>Go Back</span>
						</button>
					</div>

					<div class="calculator-body">
						{#if persona === 'businessman'}
							<div class="slider-container">
								<label for="team-size-slider">How large is your team?</label>
								<div class="slider-wrapper">
									<input id="team-size-slider" type="range" min="10" max="1000" step="10" bind:value={teamSize} />
									<span class="slider-value">{teamSize}</span>
								</div>
							</div>
							<div class="metrics-grid">
								<MetricCard icon={TrendingUp} title="Turnover Costs Saved" value={$animatedSavings} isCurrency={true} description="Annually, by cutting attrition in half through targeted upskilling." source="Based on Gallup and LinkedIn Learning data on employee replacement costs." />
								<MetricCard icon={TrendingUp} title="Productivity Hours Gained" value={$animatedProductivity} unit="+" description="Per year, from a more efficient and capable workforce." source="Based on ATD findings on productivity increases from effective training." />
								<MetricCard icon={TrendingUp} title="AI-Driven Revenue Lift" value={$animatedRevenue} isCurrency={true} description="Potential annual gain by equipping your team with strategic AI skills." source="Modeled on McKinsey & Accenture reports on AI adoption and revenue growth." />
							</div>
						{/if}

						{#if persona === 'educator'}
							<div class="slider-container">
								<label for="student-count-slider">How many students in your program?</label>
								<div class="slider-wrapper">
									<input id="student-count-slider" type="range" min="50" max="2000" step="50" bind:value={studentCount} />
									<span class="slider-value">{studentCount}</span>
								</div>
							</div>
							<div class="metrics-grid">
								<MetricCard icon={Award} title="Higher Employability" value={$animatedEmployability} unit="+ Students" description="Placed in high-demand roles within six months of graduation." source="Based on Burning Glass data on the value of industry-recognized credentials." />
								<MetricCard icon={Clock} title="Faster Placements" value={fasterPlacement} unit=" Weeks" description="Average reduction in time-to-hire for skilled graduates." source="Industry benchmark for graduates with specialized, in-demand skill sets." />
								<MetricCard icon={LinkIcon} title="New Industry Partners" value={$animatedPartnerships} unit="+" description="Attracted by a curriculum that produces work-ready talent." source="Modeled on the flywheel effect of universities supplying skilled graduates to corporate ecosystems." />
							</div>
						{/if}

						{#if persona === 'student'}
							<div class="slider-container">
								<label for="salary-slider">What is your current annual salary?</label>
								<div class="slider-wrapper">
									<input id="salary-slider" type="range" min="180000" max="20000000" step="10000" bind:value={currentSalary} />
									<span class="slider-value">₹{currentSalary.toLocaleString('en-IN')}</span>
								</div>
							</div>
							<div class="metrics-grid">
								<MetricCard icon={TrendingUp} title="Potential Salary Increase" value={$animatedSalary} isCurrency={true} description="Annual lift by acquiring in-demand skills in your field." source="Based on World Economic Forum data on salary premiums for upskilling." />
								<MetricCard icon={TrendingUp} title="Faster Promotion" value={$animatedPromotion} unit=" Months" description="Potential time saved to reach your next career milestone." source="Analysis of career progression data from leading HR analytics firms." />
								<MetricCard icon={LinkIcon} title="Job Opportunities" value={jobOpportunities} unit="x" description="Multiplier for relevant job openings unlocked with new skills." source="Data compiled from major job boards on skill-based role availability." />
							</div>
						{/if}
					</div>

					<div class="closing-argument">
						<p>{@html closingArguments[persona]}</p>
					</div>
				</div>
			{/if}
		</div>
	</Container>
</section>

<style>
	#roi-calculator {
		padding: var(--section-padding);
	}

	.section-header {
		max-width: 100%;
		margin: 0 0 3rem 0;
		text-align: left;
	}

	.section-header h2 {
		font-family: var(--font-family-heading);
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 1rem;
	}

	.accent {
		color: var(--secondary-accent);
	}

	.section-header p {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.calculator-wrapper {
		background: rgba(13, 15, 28, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 2.5rem 3.5rem;
		min-height: 400px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.calculator-view {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.calculator-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}

	.calculator-header h2 {
		font-family: var(--font-family-heading);
		font-size: var(--font-size-h3);
		font-weight: 700;
		color: var(--color-text-primary);
		flex-grow: 1;
	}

	.calculator-header :global(strong) {
		font-weight: 700;
		color: var(--color-text-primary);
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: var(--font-size-small);
		font-weight: 600;
		color: var(--color-text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s ease;
		flex-shrink: 0;
	}

	.back-button:hover {
		color: var(--color-text-primary);
	}

	.slider-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.slider-container label {
		font-size: var(--font-size-large);
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.slider-wrapper {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	input[type='range'] {
		flex-grow: 1;
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		outline: none;
		transition: opacity 0.2s;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: #fff;
		cursor: pointer;
		border-radius: 50%;
		border: none;
	}

	.slider-value {
		font-family: var(--font-family-heading);
		font-weight: 600;
		font-size: 2rem;
		color: var(--color-text-primary);
		min-width: 120px;
		text-align: right;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.closing-argument {
		padding-top: 2.5rem;
		margin-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		font-size: var(--font-size-medium);
		color: var(--color-text-secondary);
		line-height: 1.7;
		max-width: 80ch;
		margin-left: auto;
		margin-right: auto;
		text-align: center;
	}

	.closing-argument :global(strong) {
		font-weight: 600;
		color: var(--color-text-primary);
	}
</style>