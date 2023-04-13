import { defineStore } from 'pinia'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
}

export const useNotificationsStore = defineStore({
  id: 'notifications',
  state: () => ({
    notifications: [] as Notification[],
    nextId: 0,
  }),
  actions: {
    addNotification(notification: Omit<Notification, 'id'>) {
      const id = this.nextId++
      this.notifications.push({ ...notification, id })

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        this.removeNotification(id)
      }, 5000)
    },

    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
})
