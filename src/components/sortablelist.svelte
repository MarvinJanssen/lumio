<script context="module">
  // This is a custom version of the SortableList component in the
  // 'svelte-sortablejs' package. The original package inserted the
  // clone element back into the original list, which caused a lot
  // of problems with keyed each blocks (unique ID collisions on
  // redraw). In the future we will do away with this package.
  
  let dragginglist;
</script>
<script>
  import sortablejs from "sortablejs";
  import {onMount} from "svelte";
  import {
    createCustoms,
    removeNodes,
    insertNodes,
    getMode,
    handleStateRemove,
    handleStateAdd,
    ID,
    handleStateChanges
  } from "../../node_modules/svelte-sortablejs/src/utils";
  export let id = undefined;
  export let classname = "";
  export let list = [];
  export let clone = (item, evt) => ({ ...item, id: ID() });
  export let options = {};
  let el, sortable;
  export function getSortable() {
    return sortable;
  }
  onMount(() => {
    sortable = sortablejs.create(el, {
      ...{
        ...options,
        animation: 0,
        dataIdAttr: "sortable-id"
      },
      onStart(evt) {
        dragginglist = list;
        options.onStart && options.onStart(evt);
      },

      onEnd(evt) {
        dragginglist = null;
        options.onEnd && options.onEnd(evt);
      },
      onAdd(evt) {
        const otherList = [...dragginglist];
        const customs = createCustoms(evt, otherList);
        const newList = handleStateAdd(customs, list);
        // added -Marvin
        if (evt.pullMode === 'clone') // add the clone to the NEW list instead
          newList[evt.newIndex] = clone(newList[evt.newIndex],evt);
        else
          removeNodes(customs);
        //console.log(newList,dragginglist);
        list = newList;
        options.onAdd && options.onAdd(evt);
      },
      onRemove(evt) {
        const mode = getMode(evt);
        const customs = createCustoms(evt, list);
        insertNodes(customs);

        let newList = [...list];
        // remove state if not in clone mode. otherwise, keep.
        if (evt.pullMode !== "clone")
          newList = handleStateRemove(customs, newList);
        // if clone, it doesn't really remove. instead it clones in place.
        else {
          // switch used to get the clone
          let customClones = customs;
          switch (mode) {
            case "multidrag":
              customClones = customs.map((item, index) => ({
                ...item,
                element: evt.clones[index]
              }));
              break;
            case "normal":
              customClones = customs.map((item, index) => ({
                ...item,
                element: evt.clone
              }));
              break;
            case "swap":
            default: {
              invariant(
                true,
                `mode "${mode}" cannot clone. Please remove "props.clone" from <ReactSortable/> when using the "${mode}" plugin`
              );
            }
          }
          removeNodes(customClones);

          // removed -Marvin
          // replace selected items with cloned items
          // customs.forEach(curr => {
          //   const index = curr.oldIndex;
          //   const newItem = clone(curr.item, evt);
          //   newList.splice(index, 1, newItem);
          // });
        }

        // remove item.selected from list
        newList = newList.map(item => ({ ...item, selected: false }));
        list = newList;
        options.onRemove && options.onRemove(evt);
      },
      onUpdate(evt) {
        const customs = createCustoms(evt, list);
        removeNodes(customs);
        insertNodes(customs);
        const newList = handleStateChanges(customs, list);
        list = newList;
        options.onUpdate && options.onUpdate(evt);
      }
    });
  });
</script>

<style>

</style>

<div {id} class="svelte-sortable {classname}" bind:this={el}>
  <slot />
</div>
