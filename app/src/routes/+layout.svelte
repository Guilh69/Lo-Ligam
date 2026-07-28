<script>
	import '../app.css';
	import logo from '$lib/assets/logo.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={logo} />
	<title>Lo Ligam</title>
</svelte:head>

{@render children()}
