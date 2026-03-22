<script>
  import { createEventDispatcher } from "svelte";

  export let item;

  const dispatch = createEventDispatcher();

  function handleToggleDone(event) {
    dispatch("toggleDone", {
      taskId: item.id,
      done: event.currentTarget.checked,
    });
  }

  function handleDeleteTask() {
    dispatch("deleteTask", {
      taskId: item.id,
    });
  }

  function handleEditTask() {
    dispatch("editTask", {
      taskId: item.id,
    });
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "Haute": return {mainColor : "#8A1412", backgroundColor: "#FFAEAC"};
      case "Moyenne": return {mainColor : "#BBA200", backgroundColor : "#FFFFA9"};
      case "Faible": return {mainColor : "#448622", backgroundColor : "#BEFC9F"};
      default: return {mainColor : "#6E777D", backgroundColor: "C9C9C9"};
    }
  }

</script>

  <div style="width: 100%;" class="taskBody flex">
    <div class="flex">
      <input type="checkbox" checked={item.done} on:change={handleToggleDone} />
    </div>
    <div style="width: 100%;" >
      <div style="width: 100%;" class="flex spaceBetween alignCenter">
        <h4 class:item-done={item.done} class="taskTitle">{item.title}</h4>
        {#if item.priority}
            <span 
              class="tag"
              style="background-color: {getPriorityColor(item.priority).backgroundColor}; color: {getPriorityColor(item.priority).mainColor}; border: 0.5px solid {getPriorityColor(item.priority).mainColor}"
            >○ {item.priority}</span>
        {/if}
      </div>
      <div class="taskTopbar flex">
      
        {#if item.dueDate}
          <div class="flex">
            <img src="../src/assets/calendarIcon.svg" alt="calendarIcon" class="icons" />
            <span>{item.dueDate}</span>
          </div>
        {/if}
    
        {#if item.dueTime}
          <div class="flex">
            <img src="../src/assets/timeIcon.svg" alt="timeIcon" class="icons" />
            <span>{item.dueTime}</span>
          </div>
        {/if}
        

        {#if item.tags?.length}
          <div class="flex">
            <img src="../src/assets/tagIcon.svg" alt="tagIcon" class="icons" />
            {#each item.tags as tag}
              <span class="tag secondary">{tag}</span>
            {/each}
          </div>
        {/if}

        {#if item.recurrence && item.recurrence !== "Aucun"}
            <span class="tag outlineAccent">{item.recurrence}</span>
        {/if}
      </div>
        
        {#if item.notes}
          <br>
          <h5 class="notesTitle">Notes</h5>
          <p style="white-space: pre-line">{item.notes}</p>
        {/if}
    
        <div class="taskBottombar">
        </div>
        <div class="buttonsBottombar">
          <button
            type="button"
            class="outlineGray button"
            on:click={handleEditTask}
          >
            Modifier
          </button>
          <button
            type="button"
            class="delete button"
            on:click={handleDeleteTask}
          >
            Supprimer
          </button>
        </div>
      
    </div>
  </div>

<style>
  input[type=checkbox]
  {
    /* Double-sized Checkboxes */
    -ms-transform: scale(1.5); /* IE */
    -moz-transform: scale(1.5); /* FF */
    -webkit-transform: scale(1.5); /* Safari and Chrome */
    -o-transform: scale(1.5); /* Opera */
    transform: scale(1.5);
    padding: 10px;
  }
  .task-item {
    border-radius: 18px;
  }

  .task-check {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
  }

  .item-done {
    text-decoration: line-through;
    opacity: 0.6;
  }

  .taskBody {
    color : #2A343A;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.05);
    padding: 24px
  }
  
  .icons {
    width: 16px;
  }
</style>


