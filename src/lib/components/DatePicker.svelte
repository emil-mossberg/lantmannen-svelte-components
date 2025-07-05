<script lang="ts">
    type Props = {
        date: string
        hoverDistance: number
        disabledDates?: string[]
        dateDisabled: string // TO DO : should also be numerical?
    }

    let {
        date = $bindable(),
        dateDisabled,
        disabledDates = [],
        hoverDistance = 1,
    }: Props = $props()

    let offset = $state(0)
    let currentHover = $state('')

    const objDateDisabled = new Date(dateDisabled)
    const objDateDisabledEpoc = objDateDisabled.getTime()

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

            const enabled =
                d.getTime() < objDateDisabledEpoc &&
                !disabledDates.includes(value)

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

    // TO DO : Add other restrictions same as in table
    // TO DO : Padd yy-m-d with 0 for correct format
    // TO DO implement being able to use other format finland
    const validateInput = () => {
        
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (!regex.test(inputDate)) {
            inputDate = date 
        } else {
            date = inputDate
        }
    }
</script>
<div>TEMP DATE SHOW:{date}</div>
<div>
    <input type="text" bind:value={inputDate} onblur="{validateInput}" />
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
                            class={`tw-w-[60px] tw-h-[60px] ${day.selected && 'tw-text-green-pea'} ${!day.enabled && 'tw-bg-gray-300'} ${day.highlight && 'tw-bg-green-300'}`}
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
