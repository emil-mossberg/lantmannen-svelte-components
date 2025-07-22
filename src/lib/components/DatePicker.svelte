<script lang="ts">
    type Props = {
        date: string
        hoverDistance: number
        disabledDates?: string[]
        disabledFrom: string // TO DO : should also be numerical?
    }

    let {
        date = $bindable(),
        disabledFrom,
        disabledDates = [],
        hoverDistance = 1,
    }: Props = $props()

    let offset = $state(0)
    let currentHover = $state('')

    const objdisabledFrom = new Date(disabledFrom)
    const objdisabledFromEpoc = objdisabledFrom.getTime()

    // TO DO : localize month and weekdays
    let days = 'Mo|Tu|We|Th|Fr|Sa|Su'.split('|')
    let months = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec'.split('|')

    function iso(date: Date) {
        const pad = (n: number) => (n < 10 ? '0' + n : n)
        return (
            date.getFullYear() +
            '-' +
            pad(date.getMonth() + 1) +
            '-' +
            pad(date.getDate())
        )
    }

    function selectDate(newValue: string) {
        date = newValue
        offset = 0
    }

    function go(direction: number) {
        offset = offset + direction
    }

    let viewDate = $derived.by(() => {
        let viewDate = new Date(date)

        viewDate.setMonth(viewDate.getMonth() + offset)
        return viewDate
    })

    type Day = {
        date: number
        selected: boolean
        enabled: boolean
        highlight: boolean
        value: string
    }

    const isDateEnabled = (value: string, time: number) => {
        return time < objdisabledFromEpoc && !disabledDates.includes(value)
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

        // Adjust to first day of week that above day is in in
        startOfCalendar.setDate(dayOffset)

        let endOfCalendar = new Date(viewDate.getTime())

        endOfCalendar.setDate(
            new Date(
                viewDate.getFullYear(),
                viewDate.getMonth() + 1,
                0
            ).getDate()
        )

        const endOffset =
            endOfCalendar.getDate() + ((START - endOfCalendar.getDay() + 6) % 7)

        endOfCalendar.setDate(endOffset)

        var d = new Date(startOfCalendar.getTime()),
            M = viewDate.getMonth(),
            Y = viewDate.getFullYear(),
            week: Day[] = [],
            weeks = [week]

        const currentHoverDate = new Date(currentHover)
        const currentHoverIso = iso(currentHoverDate)

        let highlightRemaining = 0

        while (d.getTime() <= endOfCalendar.getTime()) {
            var dd = d.getDate(),
                value = iso(d)

            const enabled = isDateEnabled(value, d.getTime())

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

    let month = $derived.by(() => {
        return months[viewDate.getMonth()]
    })

    const year = $derived.by(() => viewDate.getFullYear())

    let inputDate = $state(date)

    function parseValidateAndFormatDate() {
        
        const inutDateObj = new Date(inputDate)

        if (isNaN(inutDateObj.getTime())) {
            inputDate = date
            return
        }

        // TO DO clean up
        // const formattedDate = inutDateObj.toISOString().slice(0, 10) // 'YYYY-MM-DD'
        const formattedDate = inutDateObj.toLocaleString().slice(0, 10) // 'YYYY-MM-DD'
        
        console.log('Formatted date', formattedDate)

        const timestamp = inutDateObj.getTime()

        if (!isDateEnabled(formattedDate, timestamp)) {
            inputDate = date
        } else {
            // TO DO fix
            date = formattedDate
            // inputDate = formattedDate
        }
    }
</script>

<div>
    <div class="tw-pb-3">
        <input
            type="text"
            bind:value={inputDate}
            onblur={parseValidateAndFormatDate}
        />
    </div>

    <table
        class="tw-table-fixed tw-border-separate tw-border tw-border-gray-300 tw-text-center tw-p-4"
    >
        <thead>
            <tr>
                <th class="btn" onclick={() => go(-1)}>&#9664;</th>
                <th colspan="5">{month} {year}</th>
                <th class="btn" onclick={() => go(+1)}>&#9654;</th>
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
