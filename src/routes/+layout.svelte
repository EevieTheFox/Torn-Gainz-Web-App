<script lang="ts">
	import Header from './Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />
	<main>{@render children()}</main>

	<footer class="footer">
		<p>
			Developed and maintained by EevieTheFox [3942777] - 2026
		</p>
	</footer>
</div>
