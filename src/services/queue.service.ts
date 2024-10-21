// cola pa los doctores y cola para yeye
import { UserQueue } from "../interface/User";

class Queue<T> {
    private items: UserQueue[] = [];

    public enqueue(element: UserQueue): boolean {
        const sizeBef = this.size()
    
        this.items.push(element);
        
        if (this.size() > sizeBef) {
            return true; 
        } else {
            return false; 
        }
    }

    public pop(): UserQueue | null{
        if (this.isEmpty()) {
            return null;
        }
        
        const ele = this.items.shift(); 
        
        if (ele !== undefined) {
            return ele as UserQueue; 
        } else {
            return null;
        }
    }

    public peek(): T | UserQueue {
        return this.items[0];
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public size(): number {
        return this.items.length;
    }

}
export const doctorQueue = new Queue<UserQueue>();
