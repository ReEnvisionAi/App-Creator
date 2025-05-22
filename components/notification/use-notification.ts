import { useContext } from 'react'
import { NotificationContext } from './index'

export function useNotification() {
  return useContext(NotificationContext)
}