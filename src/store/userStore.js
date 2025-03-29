import {create} from 'zustand';

const useUserStore = create((set) => ({
    user: {
        id: "10",
        username: "ay",
        avatar: "https://avatars.githubusercontent.com/u/1014730?v=4",
    }, 
    setUser: (user) => set(() => ({
        user
    }))
}))

export default useUserStore;