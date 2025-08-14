<script lang="ts">
  import { toUtcDateString, toUtcMidnightTimestamp } from '../utils/helpers'
  import { t } from 'svelte-i18n'

  import IconArrow from '../Icons/icon-arrow.svg'

  const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const

  const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const

  type Day = {
    date: number
    value: string
    enabled: boolean
    selectedStart: boolean
    selectedEnd: boolean
    inSelectedRange: boolean
    selectedSectionStart?: boolean
    selectedSectionEnd?: boolean
    inHighlightRange: boolean
    highlightSectionStart?: boolean
    highlightSectionEnd?: boolean
    highlightStart?: boolean
    highlightEnd?: boolean
  }

  // All dates are on the format string format XXXX-XX-XX
  type Props = {
    deliveryDate: string
    dateRange: number
    disabledDates?: string[]
    disabledFrom: string
    label: string
  }

  let {
    deliveryDate = $bindable(),
    disabledFrom,
    disabledDates = [],
    dateRange = 1,
    label,
  }: Props = $props()

  // Offset in date picker view in months from date
  let offset = $state(0)
  let currentHover = $state('')

  // Disabled from date UTC timestamp (last millisecond before midnight of disabledFrom day)
  const objdisabledFromEpoc = toUtcMidnightTimestamp(disabledFrom) - 1

  // Disabled before date UTC timestamp (day before current selected date)
  const objdisabledBeforeEpoc = (() => {
    const dt = new Date(toUtcMidnightTimestamp(deliveryDate))
    dt.setUTCDate(dt.getUTCDate() - 1)
    return dt.getTime()
  })()

  // Converts a Date obj to XXXX-XX-XX
  const iso = (date: Date) => {
    const pad = (n: number) => (n < 10 ? '0' + n : n)
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate())
    )
  }

  const selectDate = (newValue: string) => {
    deliveryDate = newValue
    offset = 0
  }

  const go = (direction: number) => {
    offset = offset + direction
  }

  // Derived from current selected date and offset, used to generate curently displayed grid of dates
  let viewDate = $derived.by(() => {
    let viewDate = new Date(deliveryDate)

    viewDate.setMonth(viewDate.getMonth() + offset)
    return viewDate
  })

  const isDateEnabled = (time: number) => {
    const dateString = toUtcDateString(time)

    return (
      time <= objdisabledFromEpoc &&
      time > objdisabledBeforeEpoc &&
      !disabledDates.includes(dateString)
    )
  }

  let weeksFrom = $derived.by(() => {
    const START = 1 // Start week on monday

    const startOfCalendar = new Date(viewDate.getTime())
    startOfCalendar.setDate(1)

    const dayOffset =
      startOfCalendar.getDate() + ((START - startOfCalendar.getDay() - 7) % 7)

    startOfCalendar.setDate(dayOffset)

    let endOfCalendar = new Date(viewDate.getTime())
    endOfCalendar.setDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate(),
    )

    const endOffset =
      endOfCalendar.getDate() + ((START - endOfCalendar.getDay() + 6) % 7)

    endOfCalendar.setDate(endOffset)

    let d = new Date(startOfCalendar.getTime()),
      week: Day[] = [],
      weeks: Day[][] = [week]

    let highlightRemaining = 0
    let selectedRemaining = 0
    let prevDay: Day | null = null

    while (d.getTime() <= endOfCalendar.getTime()) {
      const value = iso(d)
      const enabled = isDateEnabled(toUtcMidnightTimestamp(value))
      const isHovered = value === currentHover && enabled

      if (isHovered) highlightRemaining = dateRange

      const inHighlightRange = highlightRemaining > 0 && enabled
      if (inHighlightRange) highlightRemaining--

      const selectedStart = deliveryDate === value

      if (selectedStart) selectedRemaining = dateRange

      const inSelectedRange = selectedRemaining > 0 && enabled
      if (inSelectedRange) selectedRemaining--

      const day: Day = {
        date: d.getDate(),
        selectedStart,
        inSelectedRange,
        selectedEnd: inSelectedRange && selectedRemaining === 0,
        enabled,
        inHighlightRange,
        value,
        highlightStart: isHovered,
        highlightEnd: inHighlightRange && highlightRemaining === 0,
      }

      const firstDay = d.getDay() === START

      // START detection

      day.highlightSectionStart =
        day.inHighlightRange &&
        (firstDay || !prevDay || !prevDay.inHighlightRange || !prevDay.enabled)

      day.selectedSectionStart =
        day.inSelectedRange &&
        (firstDay || !prevDay || !prevDay.inSelectedRange || !prevDay.enabled)

      // END detection for previous day now that we know the current day

      if (prevDay) {
        if (prevDay.inHighlightRange)
          prevDay.highlightSectionEnd =
            !day.inHighlightRange || !day.enabled || firstDay
        if (prevDay.inSelectedRange)
          prevDay.selectedSectionEnd =
            !day.inSelectedRange || !day.enabled || firstDay
      }

      week.push(day)
      prevDay = day

      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

      if (d.getDay() === START) {
        week = []
        weeks.push(week)
      }
    }

    // Handle the very last day in the calendar
    if (prevDay && prevDay.inHighlightRange) prevDay.highlightSectionEnd = true

    return weeks
  })

  let monthText = $derived.by(() => {
    return $t(MONTHS[viewDate.getMonth()])
  })

  const year = $derived.by(() => viewDate.getFullYear())

  const canGoForward = $derived.by(() => {
    const nextMonthStart = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      1,
    )
    return nextMonthStart.getTime() < objdisabledFromEpoc
  })

  const formatPretty = (date: Date) => {
    const dayAbbr = DAYS[date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1] // adjust because your DAYS starts on Monday
    const dayNum = String(date.getUTCDate()).padStart(2, '0')
    const monthAbbr = $t(MONTHS[date.getUTCMonth()])
    return `${dayAbbr} ${dayNum} ${monthAbbr}`
  }

  const deliveryDateRange = $derived.by(() => {
    const startDate = new Date(toUtcMidnightTimestamp(deliveryDate))
    const endDate = new Date(startDate)
    endDate.setUTCDate(endDate.getUTCDate() + dateRange)

    return [
      [$t('from'), formatPretty(startDate)],
      [$t('to'), formatPretty(endDate)],
    ]
  })
</script>

{#snippet arrowButton(
  disabled: boolean,
  onclick: () => void,
  leftArrow: boolean = false,
)}
  <button
    type="button"
    {onclick}
    {disabled}
    class="tw-w-[42px] tw-h-[42px] tw-rounded-full tw-flex tw-items-center tw-justify-center !tw-border tw-border-alto hover:tw-bg-white"
  >
    <img
      src={IconArrow}
      alt="arrow icon"
      class={`tw-h-[16px] ${leftArrow && 'tw--rotate-180'}`}
    /></button
  >
{/snippet}

<div class="tw-font-bold tw-mb-1">{label}</div>
<div>
  <div
    class="tw-flex tw-justify-around tw-border-r tw-border-l tw-border-t tw-border-b tw-border-alto"
  >
    {#each deliveryDateRange as date, index}
      <div
        class={`tw-flex tw-justify-center tw-items-center tw-p-5 tw-grow tw-border-alto ${index === 1 && 'tw-border-l'}`}
      >
        <div class="tw-flex tw-flex-col tw-items-center">
          <div>{date[0]}</div>
          <div class="tw-font-bold">{date[1]}</div>
        </div>
      </div>
    {/each}
  </div>

  <div class="tw-border-r tw-border-l tw-border-b tw-border-alto">
    <table
      class="tw-table-fixed tw-border-separate tw-text-center tw-min-h-[400px] tw-p-1"
    >
      <thead>
        <tr>
          <th class="!tw-px-0 tw-flex tw-justify-center">
            {@render arrowButton(
              offset === 0,
              () => {
                go(-1)
              },
              true,
            )}
          </th>
          <th colspan="5" class="tw-text-center tw-align-middle"
            >{monthText} {year}</th
          >
          <th class="!tw-px-0 tw-flex tw-justify-center">
            {@render arrowButton(!canGoForward, () => {
              go(+1)
            })}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="!tw-bg-white">
          {#each DAYS as day}
            <th class="tw-text-green-pea">{$t(day)}</th>
          {/each}
        </tr>
        {#each weeksFrom as week}
          <tr class="!tw-bg-white">
            {#each week as day}
              <td
                class={`!tw-align-middle tw-h-[60px] !tw-px-0 !tw-py-1 ${!day.enabled && 'tw-opacity-20 tw-pointer-events-none'}`}
                onclick={() => selectDate(day.value)}
                onmouseenter={() => (currentHover = day.value)}
                onmouseleave={() => (currentHover = '')}
                ><div
                  class={`tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-transition-colors
    ${day.inSelectedRange && 'tw-bg-[#00572099] tw-text-white'}
    ${day.selectedSectionStart && 'tw-rounded-l-full'}
    ${day.selectedSectionEnd && 'tw-rounded-r-full'}
  `}
                >
                  <div
                    class={`tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-transition-colors
    ${day.inHighlightRange && 'tw-bg-sand tw-text-charcoal'}
    ${day.highlightSectionStart && 'tw-rounded-l-full'}
    ${day.highlightSectionEnd && 'tw-rounded-r-full'}
  `}
                  >
                    <div
                      class={`tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-transition-colors
  ${(day.selectedStart || day.selectedEnd) && !day.highlightStart && !day.highlightEnd && !day.inHighlightRange && 'tw-rounded-full tw-bg-tannenbaum'} ${(day.highlightStart || day.highlightEnd) && 'tw-rounded-full tw-bg-sand-dark'}`}
                    >
                      {day.date}
                    </div>
                  </div>
                </div>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
