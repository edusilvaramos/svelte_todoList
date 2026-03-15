<script>
  import ListCard from './ListCard.svelte';

  // List collection received from the parent page.
  export let lists = [];
</script>

  <!-- Responsive grid that renders one card per list. -->
  <div class="row g-4">
    {#each lists as list}
      <div class="col-12 col-md-6 col-lg-4">
        <ListCard {list} />
      </div>
    {/each}
  </div>
