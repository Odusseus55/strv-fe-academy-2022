import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { privateApi } from '~/features/api'
import { useUserContext } from '~/features/auth/contexts/userContext'
import { LayoutInternal } from '~/features/ui/components/LayoutInternal'
import { Spinner } from '~/features/ui/components/Spinner'

import { EventDetailComponent } from './parts/EventDetailComponent'

import { useAttendance } from '../../hooks/useAttendance'
import { isUserAttending } from '../../lib/isUserAttending'
import type { ArticleType } from '../../types'
// import { createEvent } from '../../types.fixtures'

export const EventDetailPage: NextPage = () => {
  const router = useRouter()
  const { eventID = '' } = router.query

  const { user } = useUserContext()

  let id = ''

  if (Array.isArray(eventID)) {
    id = ''
  } else {
    id = eventID
  }

  const result = useQuery<ArticleType, Error>(['events', id], async () => {
    const response = await privateApi.get(`/events/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to load events`)
    }

    return (await response.json()) as ArticleType
  })

  const event = result.data
  const isLoggedInUserAttending = event ? isUserAttending(user, event) : false

  const { attendEvent, leaveEvent } = useAttendance(id)

  const handleAttendance = () => {
    if (isLoggedInUserAttending) {
      leaveEvent.mutate()
    } else {
      attendEvent.mutate()
    }
  }

  // console.log(eventID)
  return (
    <LayoutInternal>
      {event ? (
        <EventDetailComponent
          event={event}
          isLoggedInUserAttending={isLoggedInUserAttending}
          handleAttendance={handleAttendance}
          loggedInUser={user}
        />
      ) : (
        <Spinner />
      )}
    </LayoutInternal>
  )
}
