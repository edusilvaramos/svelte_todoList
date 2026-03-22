<script>
  import { searchQuery, searchResults } from "../stores/searchStore";

</script>

<input
  class="searchInput"
  type="text"
  placeholder="Rechercher par tag, tâche ou liste..."
  bind:value={$searchQuery}
/>

<div class="searchItems">
  {#each $searchResults as item}
    <div class="itemCard">
      <div class="flex">
        {#if item.type === "list"}
        <img alt="list icon" class="icon listIcon" src="/src/assets/listIcon.svg" /> 
        {:else}
        <img alt="task icon" class="icon taskIcon" src="/src/assets/circleIcon.svg" /> 
        {/if}
        <a style="color: #352EB1;" href="/list/{item.listId}">{item.title}</a>
      </div>
      <small style="color : gray">{item.path.join(" / ")}</small>
    </div>
    
  {/each}
  </div>

<style>
  .searchItems {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    margin-bottom: 32px;
  }

  .itemCard {
    display: flex;
    flex-direction: column;
    gap: 0px;
    
  }
  .searchInput {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid gray;
  }
  textarea:focus, .searchInput:focus {
    outline: none;
    border: 1px solid #5149D7;
  }
</style>