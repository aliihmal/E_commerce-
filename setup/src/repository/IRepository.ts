export type id =string;
export interface Initializabel{
    init():Promise<void>;
}
export interface IRpository<T> { 

        create(item:T):Promise<id>;
      
      // Throws an error if item not found 
      get(id:id):Promise<T>;
      getAll():Promise<T[]>;

      //throw item not found || invalid item
      update(item:T):Promise<void>;

      //throw item not found    
      delete(id:id):Promise<void>;
}
