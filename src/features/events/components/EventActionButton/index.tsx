import { useRouter } from 'next/router'
import type { FC } from 'react'

import type { UserType } from '~/features/auth/contexts/userContext'
import { Button } from '~/features/ui/components/Button'

import { useAttendance } from '../../hooks/useAttendance'

type Props = {
  isLoggedInUserOwner: boolean
  isLoggedInUserAttending: boolean
  eventID: string
  isPast: boolean
  user: UserType | null
}

type ButtonProps = {
  buttonText: 'EDIT' | 'JOIN' | 'LEAVE'
  accent: 'primary' | 'destructive' | 'silent'
}

const getButtonInfo = (
  isLoggedInUserOwner: boolean,
  isLoggedInUserAttending: boolean
): ButtonProps => {
  if (isLoggedInUserOwner) {
    return { buttonText: 'EDIT', accent: 'silent' }
  }
  if (isLoggedInUserAttending) {
    return { buttonText: 'LEAVE', accent: 'destructive' }
  }

  return { buttonText: 'JOIN', accent: 'primary' }
}

export const EventActionButton: FC<Props> = ({
  isLoggedInUserOwner,
  isLoggedInUserAttending,
  eventID,
  isPast,
  user,
}) => {
  const router = useRouter()
  const { attendEvent, leaveEvent } = useAttendance(eventID)

  const { buttonText, accent } = getButtonInfo(
    isLoggedInUserOwner,
    isLoggedInUserAttending
  )

  const handleButtonAction = () => {
    if (isLoggedInUserOwner) {
      void router.push(`/events/edit/${eventID}`)
    } else {
      if (isLoggedInUserAttending) {
        leaveEvent.mutate()
      } else {
        attendEvent.mutate()
      }
    }
  }

  if ((!isPast && user) || (isPast && isLoggedInUserOwner)) {
    return (
      <Button
        type="button"
        size="small"
        accent={accent}
        onClick={handleButtonAction}
      >
        {buttonText}
      </Button>
    )
  }

  return null
}
