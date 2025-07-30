<script lang="ts">
    import { toUtcDateString, toUtcMidnightTimestamp} from '../helpers'
    type Day = {
        date: number
        selected: boolean
        enabled: boolean
        highlight: boolean
        value: string
    }

    // All dates are on the format string format XXXX-XX-XX
    type Props = {
        date: string // TO DO rename to delivery date? since its the bindable
        hoverDistance: number
        disabledDates?: string[]
        disabledFrom: string
    }

    let {
        date = $bindable(),
        disabledFrom,
        disabledDates = [],
        hoverDistance = 1,
    }: Props = $props()

    // Offset in date picker view in months from date
    let offset = $state(0)
    let currentHover = $state('')

    // Disabled from date UTC timestamp (last millisecond before midnight of disabledFrom day)
    const objdisabledFromEpoc = toUtcMidnightTimestamp(disabledFrom) - 1

    // Disabled before date UTC timestamp (day before current selected date)
    const objdisabledBeforeEpoc = (() => {
        const dt = new Date(toUtcMidnightTimestamp(date))
        dt.setUTCDate(dt.getUTCDate() - 1)
        return dt.getTime()
    })()

    // TO DO : localize month and weekdays
    let days = 'Mo|Tu|We|Th|Fr|Sa|Su'.split('|')
    let months = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|')

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
        date = newValue
        offset = 0
    }

    const go = (direction: number) => {
        offset = offset + direction
    }

    // Derived from current selected date and offset, used to generate curently displayed grid of dates
    let viewDate = $derived.by(() => {
        let viewDate = new Date(date)

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

        // TO DO understand how this aligns back to first visible in month even if before the month

        // Set to first day of month
        startOfCalendar.setDate(1)

        const dayOffset =
            startOfCalendar.getDate() +
            ((START - startOfCalendar.getDay() - 7) % 7)

        // Adjust to first day of week that the month is in
        startOfCalendar.setDate(dayOffset)

        let endOfCalendar = new Date(viewDate.getTime())

        endOfCalendar.setDate(
            new Date(
                viewDate.getFullYear(),
                viewDate.getMonth() + 1,
                0
            ).getDate()
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
                selected: date === value,
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
        return months[viewDate.getMonth()]
    })

    const year = $derived.by(() => viewDate.getFullYear())

    const canGoForward = $derived.by(() => {
        const nextMonthStart = new Date(
            viewDate.getFullYear(),
            viewDate.getMonth() + 1,
            1
        )
        return nextMonthStart.getTime() < objdisabledFromEpoc
    })

    let inputDate = $state(date)

    function parseValidateAndFormatDate() {
        const inutDateObj = new Date(inputDate)

        if (isNaN(inutDateObj.getTime())) {
            inputDate = date
            return
        }

        const formattedDate = inutDateObj.toISOString().slice(0, 10) // 'YYYY-MM-DD'

        // const formattedDate = inutDateObj.toLocaleString().slice(0, 10) // 'YYYY-MM-DD'

        const timestamp = inutDateObj.getTime()

        if (!isDateEnabled(timestamp)) {
            inputDate = date
        } else {
            console.log(formattedDate)
            date = formattedDate
            inputDate = formattedDate
        }
    }
</script>

{#snippet arrowButton(disabled: boolean, text: string, onclick: () => void)}
    <button
        type="button"
        {onclick}
        {disabled}
        class={`${'disabled:tw-opacity-50'}`}>{text}</button
    >
{/snippet}

<div>
    <div class="tw-pb-3">
        <input
            type="text"
            onkeydown="{(e) => {
                  if (e.key === 'Enter') {
            e.preventDefault()
        }
            }}"
            bind:value={inputDate}
            onblur={parseValidateAndFormatDate}
        />
    </div>

    <table
        class="tw-table-fixed tw-border-separate tw-border tw-border-gray-300 tw-text-center tw-p-4"
    >
        <thead>
            <tr>
                <th class="!tw-px-0 tw-text-left">
                    {@render arrowButton(offset === 0, '◄', () => {
                        go(-1)
                    })}
                </th>
                <th colspan="5" class="tw-text-center">{monthText} {year}</th>
                <th class="!tw-px-0 tw-text-right">
                    {@render arrowButton(!canGoForward, '►', () => {
                        go(+1)
                    })}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                {#each days as day}
                    <th>{day}</th>
                {/each}
            </tr>
            {#each weeksFrom as week}
                <tr>
                    {#each week as day}
                        <td
                            class={`tw-w-[60px] tw-h-[60px]  ${day.selected && 'tw-text-green-pea tw-border tw-border-green-pea tw-font-bold'} ${!day.enabled && 'tw-opacity-20'} ${day.highlight && 'tw-bg-green-pea tw-text-white tw-font-bold'}`}
                            onclick={() => selectDate(day.value)}
                            onmouseenter={() => (currentHover = day.value)}
                            onmouseleave={() => (currentHover = '')}
                            >{day.date}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
