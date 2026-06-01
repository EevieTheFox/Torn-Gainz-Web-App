<script lang="ts">
    import { resolve } from '$app/paths';
    import { page } from '$app/state';
    import github from '$lib/images/github.svg';
    import logo from '$lib/images/svelte-logo.svg';
    import { onMount } from "svelte";

    type UiTheme = "light" | "dark";
    const KEY = "tg_theme";

    let uiTheme: UiTheme = "light";

    function apply(t: UiTheme) {
        document.documentElement.dataset.theme = t;
    }

    function toggle() {
        uiTheme = uiTheme === "dark" ? "light" : "dark";
        apply(uiTheme);
        localStorage.setItem(KEY, uiTheme);
    }

    onMount(() => {
        const saved = localStorage.getItem(KEY);
        const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

        uiTheme =
            saved === "light" || saved === "dark"
                ? (saved as UiTheme)
                : systemDark
                    ? "dark"
                    : "light";

        apply(uiTheme);
    });
</script>


<header class="siteHeader">
	<div class="corner">
		<a href="https://svelte.dev/docs/kit">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>

            <!-- Home page -->
			<li aria-current={page.url.pathname === '/homepage' ? 'page' : undefined}>
				<a href={resolve('/')}>Home</a>
			</li>

            <!-- About page -->
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href={resolve('/about')}>About</a>
			</li>

			<!-- Calculator page -->
            <li aria-current={page.url.pathname === '/calculator' ? 'page' : undefined}>
                <a href={resolve('/calculator')}>Calculator</a>
            </li>

            <!-- Transparency & legal page -->
            <li aria-current={page.url.pathname === '/policy' ? 'page' : undefined}>
                <a href={resolve('/policy')}>Policy</a>
            </li>

            <!-- Dark/Light theme toggle -->
            <button class="theme-toggle" on:click={toggle}>
                {uiTheme === "dark" ? "Light mode" : "Dark mode"}
            </button>

        </ul>

		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">

    </div>
</header>
