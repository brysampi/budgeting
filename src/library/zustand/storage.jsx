import { create } from "zustand";

export const expensesCategoryStore = create((set) => ({
    data: [],
    setData: (newData) => set({ data: newData }),
    // addData: (item) => set((state) => ({ data: [...state.data, item] })),
}));

export const walletStorage = create((set) => ({
    data: [],
    setData: (newData) => set({ data: newData }),
}));

// ------------------------------------------------------------------------
// Example of how to use it
// export const useStore = create((set) => ({
//   data: [],  // array of objects

//   // Replace the whole array
//   setData: (newData) => set({ data: newData }),

//   // Add new item(s) to the array
//   addData: (item) => set((state) => ({ data: [...state.data, item] })),

//   // Update an item by id
//   updateData: (id, newItem) =>
//     set((state) => ({
//       data: state.data.map((obj) => (obj.id === id ? { ...obj, ...newItem } : obj)),
//     })),

//   // Remove an item by id
//   removeData: (id) =>
//     set((state) => ({
//       data: state.data.filter((obj) => obj.id !== id),
//     })),
// }));

// ------------------------------------------------------------------------
// Component Example
// function MyComponent() {
//   const data = useStore((state) => state.data);
//   const setData = useStore((state) => state.setData);
//   const addData = useStore((state) => state.addData);
//   const updateData = useStore((state) => state.updateData);
//   const removeData = useStore((state) => state.removeData);

//   return (
//     <div>
//       <button onClick={() =>
//         setData([
//           { id: 12, name: 'test' },
//           { id: 13, name: 'test2' },
//           { id: 14, name: 'test3' }
//         ])
//       }>Set Initial Data</button>

//       <button onClick={() => addData({ id: 15, name: 'test4' })}>Add Item</button>
//       <button onClick={() => updateData(13, { name: 'updated' })}>Update id 13</button>
//       <button onClick={() => removeData(12)}>Remove id 12</button>

//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }