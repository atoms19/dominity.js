import {
   computed,
   effect,
   Signal,
   signal,
   untracked
} from "@preact/signals-core";

export let state = signal;
export let derived = computed;
export let  DominityReactive = Signal;
export {effect, untracked}


/*
    reactivity system is borrowed from preact mainly because it is very small and fits in nicely to dominity , altho there were attempts to make my own
    i cant get the performance right so 6kb is a a worthy sacrifice
 */
