<!-- Halos colorés flous, en fond fixe derrière tout le contenu. Purement
     décoratif : aucun contenu, aucune interaction. -->
<div class="page-bg" aria-hidden="true">
	<span class="blob blob-gold"></span>
	<span class="blob blob-teal"></span>
	<span class="blob blob-brick"></span>
</div>

<style>
	.page-bg {
		position: fixed;
		inset: 0;
		overflow: hidden;
		z-index: 1;
		pointer-events: none;
		background: radial-gradient(
			circle at 50% 0%,
			rgba(250, 243, 230, 0.9) 0%,
			rgba(245, 234, 216, 0.86) 60%
		);
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(70px);
	}

	.blob-gold {
		width: 420px;
		height: 420px;
		background: var(--color-gold);
		opacity: 0.35;
		top: -140px;
		left: -120px;
	}

	.blob-teal {
		width: 380px;
		height: 380px;
		background: var(--color-teal);
		opacity: 0.2;
		bottom: -100px;
		right: -100px;
	}

	.blob-brick {
		width: 300px;
		height: 300px;
		background: var(--color-brick);
		opacity: 0.15;
		top: 25%;
		right: 8%;
	}
</style>
