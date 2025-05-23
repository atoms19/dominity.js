import { state ,effect,derived} from "./reactivity";

export class DominityStore {
    constructor(name, storeData) {
       this._values = {};
       if(storeData.states){
       Object.keys(storeData.states).forEach((key) => {
          this._values[key] = state(storeData.states[key]);
       });
    }
       if(storeData.actions){
       Object.keys(storeData.actions).forEach((key) => {
          this[key] = (...params) => {
             storeData.actions[key](this._values, this,...params);
          };
       });
    }
       if(storeData.getters){
       Object.keys(storeData.getters).forEach((key) => {
          this[key] = derived(storeData.getters[key]);
       });
       }
    }
 
    getRef(ref) {
       return derived(() => this._values[ref].value);
    }
    getEditableRef(ref) {
       let refer = derived(() => this._values[ref].value);
       effect(() => {
          this._values[ref].value = refer.value;
       });
       return refer;
    }
    
    getRefs(obj) {
       if (obj && obj.edit) return this._values;
       let refobj = {};
       for (const key in this._values) {
          refobj[key] = derived(() => this._values[key].value);
       }
       return refobj;
    }
 }
 
 export function createStore(name, storeData) {
    return new DominityStore(name, storeData);
 }
 