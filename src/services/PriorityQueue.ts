import connection from '../providers/database';

export class PriorityQueue {
    private items: { paciente: any, prioridad: number }[] = [];
  
    enqueue(paciente: any, prioridad: number) {
      const item = { paciente, prioridad };
      let added = false;
  
      // Insert to priority queue
      for (let i = 0; i < this.items.length; i++) {
        if (item.prioridad > this.items[i].prioridad) {
          this.items.splice(i, 0, item);
          added = true;
          break;
        }
      }
  
      // If the item has the lowest priority
      if (!added) {
        this.items.push(item);
      }
    }
  
    dequeue() {
      return this.items.shift(); // Remove the first element
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  }
  