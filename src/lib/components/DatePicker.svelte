<script lang="ts">
  import { toUtcDateString, toUtcMidnightTimestamp } from '../helpers'
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
    selected: boolean
    enabled: boolean
    highlight: boolean
    value: string
  }

  // All dates are on the format string format XXXX-XX-XX
  type Props = {
    deliveryDate: string
    hoverDistance: number
    disabledDates?: string[]
    disabledFrom: string
    label: string
  }

  let {
    deliveryDate = $bindable(),
    disabledFrom,
    disabledDates = [],
    hoverDistance = 1,
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

    // Set to first day of month
    startOfCalendar.setDate(1)

    const dayOffset =
      startOfCalendar.getDate() + ((START - startOfCalendar.getDay() - 7) % 7)

    // Adjust to first day of week that the month is in
    startOfCalendar.setDate(dayOffset)

    let endOfCalendar = new Date(viewDate.getTime())

    endOfCalendar.setDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate(),
    )

    // Adjust to last day of week that the month is in
    const endOffset =
      endOfCalendar.getDate() + ((START - endOfCalendar.getDay() + 6) % 7)

    endOfCalendar.setDate(endOffset)

    var d = new Date(startOfCalendar.getTime()),
      week: Day[] = [],
      weeks = [week]

    const currentHoverIso = iso(new Date(currentHover))

    let highlightRemaining = 0

    while (d.getTime() <= endOfCalendar.getTime()) {
      var dd = d.getDate(),
        value = iso(d)

      const enabled = isDateEnabled(toUtcMidnightTimestamp(value))

      const isHovered = value === currentHoverIso && enabled

      if (isHovered) {
        highlightRemaining = hoverDistance
      }

      const highlight = highlightRemaining > 0 && enabled

      if (highlight) {
        highlightRemaining--
      }

      const day = {
        date: dd,
        selected: deliveryDate === value,
        enabled,
        highlight,
        value,
      }

      week.push(day)

      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

      if (d.getDay() === START) {
        week = []
        weeks.push(week)
      }
    }

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

  let inputDate = $state(deliveryDate)

  function parseValidateAndFormatDate() {
    const inutDateObj = new Date(inputDate)

    if (isNaN(inutDateObj.getTime())) {
      inputDate = deliveryDate
      return
    }

    const formattedDate = inutDateObj.toISOString().slice(0, 10) // Give date format 'YYYY-MM-DD'

    // const formattedDate = inutDateObj.toLocaleString().slice(0, 10) // 'YYYY-MM-DD'

    const timestamp = inutDateObj.getTime()

    if (!isDateEnabled(timestamp)) {
      inputDate = deliveryDate
    } else {
      deliveryDate = formattedDate
      inputDate = formattedDate
    }
  }
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
  <div class="tw-pb-3">
    <input
      type="text"
      onkeydown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      }}
      bind:value={inputDate}
      onblur={parseValidateAndFormatDate}
    />
  </div>

  <table
    class="tw-table-fixed tw-border-separate tw-text-center tw-min-h-[400px]"
  >
    <thead>
      <tr>
        <th class="!tw-px-0 tw-text-left">
          {@render arrowButton(
            offset === 0,
            () => {
              go(-1)
            },
            true,
          )}
        </th>
        <th colspan="5" class="tw-text-center">{monthText} {year}</th>
        <th class="!tw-px-0 tw-text-right">
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
              class={`!tw-align-middle tw-h-[60px] !tw-px-0 !tw-py-2 ${day.selected && 'tw-border tw-border-green-pea'} ${!day.enabled && 'tw-opacity-20 tw-pointer-events-none'}`}
              onclick={() => selectDate(day.value)}
              onmouseenter={() => (currentHover = day.value)}
              onmouseleave={() => (currentHover = '')}
              ><div class={`tw-h-full tw-flex tw-items-center tw-justify-center ${day.highlight && 'tw-bg-green-pea tw-text-white'}`}>
                {day.date}
              </div>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
