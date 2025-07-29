<script lang="ts">
  import { onMount } from 'svelte';
  import Container from '$lib/components/common/Container.svelte';

</script>

<section>
  <Container>
    <div class="content">
      <h1>
        Build Your <span class="accent">Future-Ready</span> <span class="accent">Workforce</span>
      </h1>
      <p>
        India is on the cusp of a major economic expansion, fueled by its vibrant young population. However, a
        <strong>significant skills gap</strong> threatens progress—companies need
        <strong>job-ready talent</strong> but emerging professionals aren't yet prepared.
      </p>
      <p>
        The future of business is being written in India, yet a <strong>silent crisis</strong>
        threatens to derail it all. Millions of ambitious individuals are entering the workforce, but they lack the specific, critical skills your company needs to innovate and compete. This
        <strong>talent paradox</strong> isn't just a statistic—it's a
        <strong>direct threat to your bottom line and future success</strong>.
      </p>
      <button>
        Uncover the Crisis
      </button>
    </div>
  </Container>
</section>

<style>
  section {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: center;
    padding: 2rem 0;
    overflow: hidden;
    background-color: transparent;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .content {
    width: 100%;
    text-align: left;
    z-index: 1;
  }

  h1 {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }

  .accent {
    color: var(--secondary-accent);
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  strong {
    color: var(--primary-accent);
    font-weight: bold;
  }

  button {
    background-color: var(--secondary-accent);
    color: var(--button-text);
    border: none;
    padding: 0.8rem 1.5rem;
    font-family: var(--font-body);
    font-size: 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
    transition: transform 0.2s;
  }

  button:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    section {
      padding: 4rem 0 2rem 0;
    }
  }
</style>