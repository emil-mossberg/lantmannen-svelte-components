<script lang="ts">
    type Props = {
        date: string 
    }

    let { date = $bindable() }: Props = $props()

    let offset = $state(0)

    const START = 1 // Start week on monday
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
        value: string
        class: string
    }

    let weeksFrom = $derived.by(() => {
        // TO DO : understand first and last and re write for better readability
        let first = new Date(viewDate.getTime())

        // TO DO understand how this aligns back to first visible in month even if before the month
        first.setDate(1)
        first.setDate(first.getDate() + ((START - first.getDay() - 7) % 7))

        let last = new Date(viewDate.getTime())
        last.setDate(
            new Date(
                viewDate.getFullYear(),
                viewDate.getMonth() + 1,
                0
            ).getDate()
        )
        last.setDate(last.getDate() + ((START - last.getDay() + 6) % 7))

        var d = new Date(first.getTime()),
            M = viewDate.getMonth(),
            Y = viewDate.getFullYear(),
            week : Day[] = [],
            weeks = [week]

        while (d.getTime() <= last.getTime()) {
            var dd = d.getDate(),
                mm = d.getMonth(),
                yy = d.getFullYear(),
                value = iso(d)

            week.push({
                date: dd,
                value,
                class: [
                    date === value ? 'tw-bg-red-200' : '',
                    mm == M
                        ? ''
                        : (mm > M ? yy >= Y : yy > Y)
                          ? 'future'
                          : 'past',
                ].join(' '),
            })

            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)

            if (d.getDay() === START) {
                week = []
                weeks.push(week)
            }
        }
        console.log(weeks)
        return weeks
    })

    let month = $derived.by(() => {
        return months[viewDate.getMonth()]
    })

    const year = $derived.by(() => viewDate.getFullYear())
</script>

<div>WORK IN PROGRESS</div>
<div>{date}</div>

<table
    class="tw-table-fixed tw-border-collapse tw-border tw-border-gray-300 tw-w-full tw-text-center"
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
                        class="text-center w-16 {day.class}"
                        onclick={() => selectDate(day.value)}>{day.date}</td
                    >
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
