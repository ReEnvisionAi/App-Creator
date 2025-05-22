import { createContext, useContext, useRef, useState } from 'react'
import anime from 'animejs/lib/anime.es.js'
import { X } from 'lucide-react'

type NotificationType = 'success' | 'error' | 'info'

type Notification = {
  id: string
  title: string
  description?: string
  type: NotificationType
}

type NotificationContextType = {
  notify: (options: Omit<Notification, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const notify = (options: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(2)
    const notification: Notification = { ...options, id }

    setNotifications((prev) => [...prev, notification])

    // Animate in
    setTimeout(() => {
      const element = notificationRefs.current[id]
      if (element) {
        anime({
          targets: element,
          translateX: [-500, 0],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutExpo'
        })
      }
    }, 0)

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(id)
    }, 5000)
  }

  const dismissNotification = (id: string) => {
    const element = notificationRefs.current[id]
    if (element) {
      anime({
        targets: element,
        translateX: [0, 500],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInExpo',
        complete: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        }
      })
    }
  }

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-0 top-0 z-50 m-4 flex flex-col items-end space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            ref={(el) => (notificationRefs.current[notification.id] = el)}
            className={`flex w-96 items-center justify-between rounded-lg p-4 text-white shadow-lg ${getBackgroundColor(
              notification.type
            )}`}
          >
            <div>
              <h3 className="font-semibold">{notification.title}</h3>
              {notification.description && (
                <p className="mt-1 text-sm">{notification.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export { NotificationContext }