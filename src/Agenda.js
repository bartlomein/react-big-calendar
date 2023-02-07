import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import addClass from 'dom-helpers/addClass'
import removeClass from 'dom-helpers/removeClass'

import scrollbarSize from 'dom-helpers/scrollbarSize'

import { navigate } from './utils/constants'
import { inRange } from './utils/eventLevels'
import { isSelected } from './utils/selection'

function Agenda({
  accessors,
  components,
  date,
  events,
  getters,
  length,
  localizer,
  onDoubleClickEvent,
  onSelectEvent,
  selected,
}) {
  const headerRef = useRef(null)
  const dateColRef = useRef(null)
  const timeColRef = useRef(null)
  const contentRef = useRef(null)
  const tbodyRef = useRef(null)

  const eventRef = useRef(null)
  const actualRef = useRef(null)
  const estimateRef = useRef(null)
  const changeRef = useRef(null)
  const previousRef = useRef(null)

  useEffect(() => {
    _adjustHeader()
  })

  const renderDay = (day, events, dayKey) => {
    const { event: Event, date: AgendaDate } = components

    events = events.filter((e) =>
      inRange(
        e,
        localizer.startOf(day, 'day'),
        localizer.endOf(day, 'day'),
        accessors,
        localizer
      )
    )

    return events.map((event, idx) => {
      let title = accessors.title(event)
      let end = accessors.end(event)
      let start = accessors.start(event)

      const userProps = getters.eventProp(
        event,
        start,
        end,
        isSelected(event, selected)
      )

      let dateLabel = idx === 0 && localizer.format(day, 'agendaDateFormat')
      let first =
        idx === 0 ? (
          <td rowSpan={events.length} className="rbc-agenda-date-cell">
            {AgendaDate ? (
              <AgendaDate day={day} label={dateLabel} />
            ) : (
              dateLabel
            )}
          </td>
        ) : (
          false
        )

      return (
        <div
          key={dayKey + '_' + idx}
          className={`agenda-grid-top-header ${first && `agenda-topLine`}`}
          style={userProps.style}
        >
          <div className="agenda-day-container">
            {first && <span className="agenda-day">{first}</span>}
          </div>
          <div className="rbc-agenda-time-cell">
            {timeRangeLabel(day, event)}
          </div>
          <div
            className="rbc-agenda-event-cell"
            onClick={(e) => onSelectEvent && onSelectEvent(event, e)}
            onDoubleClick={(e) =>
              onDoubleClickEvent && onDoubleClickEvent(event, e)
            }
          >
            {Event ? <Event event={event} title={title} /> : title}
          </div>

          <div
            className={`${event?.actual ? `agenda-actual` : `actual-empty`}`}
          >
            {event?.actual ? event?.actual?.toFixed(2) : '-'}
          </div>
          <div
            className={`${
              event?.estimate ? `agenda-estimate` : `estimate-empty`
            }`}
          >
            {event?.estimate ? event?.estimate?.toFixed(2) : '-'}
          </div>
          <div
            className={`${event?.change ? `agenda-change` : `change-empty`}`}
          >
            {event?.change ? event?.change?.toFixed(2) : '-'}
          </div>
          <div className={`${event.previous ? `agenda-prev` : `prev-empty`}`}>
            {event?.previous ? event?.previous?.toFixed(2) : '-'}
          </div>
        </div>
      )
    }, [])
  }

  const timeRangeLabel = (day, event) => {
    let labelClass = '',
      TimeComponent = components.time,
      label = localizer.messages.allDay

    let end = accessors.end(event)
    let start = accessors.start(event)

    if (!accessors.allDay(event)) {
      if (localizer.eq(start, end)) {
        label = localizer.format(start, 'agendaTimeFormat')
      } else if (localizer.isSameDate(start)) {
        label = localizer.format({ start }, 'agendaTimeRangeFormat')
      } else if (localizer.isSameDate(day, start)) {
        label = localizer.format(start, 'agendaTimeFormat')
      } else if (localizer.isSameDate(day)) {
        // label = localizer.format(end, 'agendaTimeFormat')
      }
    }

    if (localizer.gt(day, start, 'day')) labelClass = 'rbc-continues-prior'
    if (localizer.lt(day, end, 'day')) labelClass += ' rbc-continues-after'

    return (
      <span className={labelClass.trim()}>
        {TimeComponent ? (
          <TimeComponent event={event} day={day} label={label} />
        ) : (
          label
        )}
      </span>
    )
  }

  const _adjustHeader = () => {
    if (!tbodyRef.current) return

    let header = headerRef.current
    let firstRow = tbodyRef.current.firstChild

    if (!firstRow) return

    let isOverflowing =
      contentRef.current.scrollHeight > contentRef.current.clientHeight

    // dateColRef.current.style.width = _widths[0] + 'px'
    // timeColRef.current.style.width = _widths[1] + 'px'
    // eventRef.current.style.width = _widths[2] + 'px'
    // actualRef.current.style.width = _widths[3] + 'px'
    // estimateRef.current.style.width = _widths[4] + 'px'
    // changeRef.current.style.width = _widths[5] + 'px'
    // previousRef.current.style.width = _widths[6] + 'px'

    if (isOverflowing) {
      addClass(header, 'rbc-header-overflowing')
      header.style.marginRight = scrollbarSize() + 'px'
    } else {
      removeClass(header, 'rbc-header-overflowing')
    }
  }

  let { messages } = localizer
  let end = localizer.add(date, length, 'day')

  let range = localizer.range(date, end, 'day')

  events = events.filter((event) =>
    inRange(
      event,
      localizer.startOf(date, 'day'),
      localizer.endOf(end, 'day'),
      accessors,
      localizer
    )
  )

  events.sort((a, b) => +accessors.start(a) - +accessors.start(b))

  return (
    <div className="rbc-agenda-view">
      {events.length !== 0 ? (
        <React.Fragment>
          <div ref={headerRef} className="rbc-agenda-table ">
            <div>
              <div className="agenda-grid-top-header">
                <div className="rbc-header" ref={dateColRef}>
                  {messages.date}
                </div>
                <div className="rbc-header" ref={timeColRef}>
                  {messages.time}
                </div>
                <div className="rbc-header" ref={eventRef}>
                  {messages.event}
                </div>

                <div className="rbc-header agenda" ref={actualRef}>
                  Actual
                </div>
                <div className="rbc-header agenda" ref={estimateRef}>
                  Est
                </div>
                <div className="rbc-header agenda" ref={changeRef}>
                  Change
                </div>
                <div className="rbc-header agenda" ref={previousRef}>
                  Prev
                </div>
              </div>
            </div>
          </div>
          <div className="rbc-agenda-content" ref={contentRef}>
            <div className="rbc-agenda-table">
              <div ref={tbodyRef}>
                {range.map((day, idx) => renderDay(day, events, idx))}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <span className="rbc-agenda-empty">{messages.noEventsInRange}</span>
      )}
    </div>
  )
}

Agenda.propTypes = {
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  date: PropTypes.instanceOf(Date),
  events: PropTypes.array,
  getters: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
  localizer: PropTypes.object.isRequired,
  onSelectEvent: PropTypes.func,
  onDoubleClickEvent: PropTypes.func,
  selected: PropTypes.object,
}

Agenda.defaultProps = {
  length: 30,
}

Agenda.range = (start, { length = Agenda.defaultProps.length, localizer }) => {
  let end = localizer.add(start, length, 'day')
  return { start, end }
}

Agenda.navigate = (
  date,
  action,
  { length = Agenda.defaultProps.length, localizer }
) => {
  switch (action) {
    case navigate.PREVIOUS:
      return localizer.add(date, -length, 'day')

    case navigate.NEXT:
      return localizer.add(date, length, 'day')

    default:
      return date
  }
}

Agenda.title = (start, { length = Agenda.defaultProps.length, localizer }) => {
  let end = localizer.add(start, length, 'day')
  return localizer.format({ start, end }, 'agendaHeaderFormat')
}

export default Agenda
