<script>
  import { Link } from "svelte-routing";

  export let items = [];
</script>

{#if items.length > 0}
  <nav aria-label="breadcrumb" class="mb-4">
    <ol class="breadcrumb mb-0">
      {#each items as item, index}
        {#if index === items.length - 1}
          <li class="breadcrumb-item active" aria-current="page">
            {item.label}
          </li>
        {:else}
          <li class="breadcrumb-item">
            <Link class="navItem" to={item.href}>{item.label}</Link>
          </li>
        {/if}
      {/each}
    </ol>
  </nav>
{/if}