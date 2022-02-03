import create from "zustand";

const useAction = create((set) => ({
  isShooting: false,
  shoot: (value) =>
    set((state) => {
      return { isShooting: value };
    }),
}));

export { useAction };
